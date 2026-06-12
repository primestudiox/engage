import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Clock 
} from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../utils/firebase';
import { getOrCreateLeadsSheet, appendLeadsToSheet, LeadData } from '../utils/sheets';
import { supabase } from '../lib/supabase';
import { getFlagEmoji } from '../utils/geo';
import { User } from 'firebase/auth';

export default function AdminSyncDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminUrl, setIsAdminUrl] = useState(false);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedSpreadsheetId, setLastSyncedSpreadsheetId] = useState<string | null>(
    localStorage.getItem('engage_last_spreadsheet_id')
  );

  // Parse URL to decide if the secret Admin Dashboard Trigger should render
  useEffect(() => {
    const checkAdminParam = () => {
      const hasParam = window.location.search.includes('admin=true') || window.location.hash.includes('admin');
      setIsAdminUrl(hasParam);
    };

    checkAdminParam();
    window.addEventListener('hashchange', checkAdminParam);
    window.addEventListener('popstate', checkAdminParam);
    
    return () => {
      window.removeEventListener('hashchange', checkAdminParam);
      window.removeEventListener('popstate', checkAdminParam);
    };
  }, []);

  // Load leads from Supabase (primary) fallback to localStorage
  const loadLeads = async (currentUser: User | null) => {
    setIsLoadingLeads(true);
    setSyncError(null);

    // If signed-in admin, load from Supabase
    if (currentUser && currentUser.email === 'Dsylvestrealain@gmail.com') {
      try {
        const { data: rows, error: sbError } = await supabase
          .from('leads')
          .select('*');

        if (sbError) {
          throw sbError;
        }

        const sbLeads: LeadData[] = (rows || []).map((row: any) => ({
          id: row.id?.toString() || '',
          name: row.name || '',
          gender: row.gender || '',
          phone: row.phone || '',
          country: {
            name: row.country_name || '',
            code: row.country_code || '',
            dialCode: row.dial_code || '',
            flag: row.country_code ? getFlagEmoji(row.country_code) : '🇨🇮',
          },
          description: row.profile || '',
          experience: row.blocage || '',
          readyToInvest: row.ready_to_invest || '',
          joinMastermind: row.wants_whatsapp_plan || false,
          timestamp: row.created_at || new Date().toISOString(),
          synced: row.synced || false,
        }));
        
        // Sort leads by timestamp newest first
        sbLeads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLeads(sbLeads);
        localStorage.setItem('engage_leads', JSON.stringify(sbLeads));
        setIsLoadingLeads(false);
        return;
      } catch (err: any) {
        console.warn('Could not load leads from Supabase, falling back to local cache...', err);
        setSyncError('Supabase load restricted. Ensure tables are readable and configuration is correct.');
      }
    }

    // Fallback to local storage cache
    const stored = localStorage.getItem('engage_leads');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LeadData[];
        parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLeads(parsed);
      } catch (e) {
        console.error('Failed to parse cached leads:', e);
      }
    } else {
      setLeads([]);
    }
    setIsLoadingLeads(false);
  };

  useEffect(() => {
    // Initial fetch from localStorage
    loadLeads(null);

    // Listen for custom newly submitted lead events
    const handleLocalUpdate = () => loadLeads(user);
    window.addEventListener('engage_leads_updated', handleLocalUpdate);
    return () => {
      window.removeEventListener('engage_leads_updated', handleLocalUpdate);
    };
  }, [user]);

  // Listen to Auth changes to fetch database leads
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        loadLeads(currentUser);
      },
      () => {
        setUser(null);
        loadLeads(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setSyncError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        await loadLeads(result.user);
      }
    } catch (err: any) {
      setSyncError(err.message || 'Authentication with Google failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Disconnect your active session Google credentials?')) {
      await logout();
      setUser(null);
      setLeads([]);
    }
  };

  const syncLeadsToGoogle = async () => {
    setSyncError(null);
    const pendingLeads = leads.filter(l => !l.synced);
    
    if (pendingLeads.length === 0 && lastSyncedSpreadsheetId) {
      alert('All leads in Cloud Firestore are already fully synced to Google Sheets!');
      return;
    }

    const confirmed = window.confirm(
      pendingLeads.length > 0 
        ? `Are you sure you want to sync ${pendingLeads.length} new leads to your Google Sheets?`
        : 'Recheck or establish Google Sheets sync?'
    );
    if (!confirmed) return;

    setIsSyncing(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        const result = await googleSignIn();
        if (!result) {
          throw new Error('Authentication is required to authorize Google Sheets API access.');
        }
      }

      const activeToken = token || (await getAccessToken());
      if (!activeToken) {
        throw new Error('Failed to retrieve active Google OAuth authorization.');
      }

      // 1. Get or create the spreadsheet holding leads
      const spreadsheetId = await getOrCreateLeadsSheet(activeToken);
      setLastSpreadsheetId(spreadsheetId);

      // 2. Sync pending leads if any
      if (pendingLeads.length > 0) {
        await appendLeadsToSheet(spreadsheetId, activeToken, pendingLeads);
        
        // 3. Update synced tag in Supabase
        if (user && user.email === 'Dsylvestrealain@gmail.com') {
          const ids = pendingLeads.map((l) => l.id).filter(Boolean);
          if (ids.length > 0) {
            const { error: updateErr } = await supabase
              .from('leads')
              .update({ synced: true })
              .in('id', ids);
            if (updateErr) {
              console.error('Failed to update synced status in Supabase:', updateErr);
            }
          }
        } else {
          // If fallback local storage sync
          const localUpdated = leads.map(l => ({ ...l, synced: true }));
          localStorage.setItem('engage_leads', JSON.stringify(localUpdated));
        }

        // Re-load the database to reflect synced indicators
        await loadLeads(user);
      }

      alert('Sync completed successfully! Your Google Sheet has been updated with the new rows.');
    } catch (err: any) {
      console.error('Google Sheets sync unsuccessful:', err);
      setSyncError(err.message || 'Verification / sheet writes failed. Ensure Google Sheets permissions are granded.');
    } finally {
      setIsSyncing(false);
    }
  };

  const setLastSpreadsheetId = (id: string) => {
    setLastSyncedSpreadsheetId(id);
    localStorage.setItem('engage_last_spreadsheet_id', id);
  };

  const clearLeads = async () => {
    const targetCount = leads.length;
    if (targetCount === 0) return;

    const confirmed = window.confirm(
      `CRITICAL WARNING: This will permanently delete all ${targetCount} leads from Supabase. This action is irreversible (but will NOT delete synced entries from Google Sheets). Continue?`
    );
    
    if (confirmed) {
      if (user && user.email === 'Dsylvestrealain@gmail.com') {
        try {
          const ids = leads.map(l => l.id).filter(Boolean);
          if (ids.length > 0) {
            const { error: delErr } = await supabase
              .from('leads')
              .delete()
              .in('id', ids);
            if (delErr) throw delErr;
          }
        } catch (err) {
          console.error('Failed to clear Supabase table:', err);
        }
      }
      localStorage.removeItem('engage_leads');
      setLeads([]);
      window.dispatchEvent(new Event('engage_leads_updated'));
    }
  };

  // If the secret URL parameters are not set, completely hide the Admin trigger widget 
  if (!isAdminUrl) {
    return null;
  }

  const pendingCount = leads.filter(l => !l.synced).length;

  return (
    <>
      {/* Secret floating trigger button at bottom right */}
      <button
        id="sheet-sync-button"
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#121315]/90 hover:bg-[#16181a] border border-white/[0.08] hover:border-[#00f6ac]/50 text-white hover:text-[#00f6ac] px-4.5 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl transition-all duration-300 cursor-pointer text-xs font-mono font-bold tracking-wider uppercase group"
      >
        <div className="relative">
          <Database className="h-4.5 w-4.5 text-[#00f6ac]" />
          {pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-sans font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {pendingCount}
            </span>
          )}
        </div>
        <span>Lead Manager</span>
      </button>

      {/* Admin Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#020202]/85 backdrop-blur-sm z-50 cursor-default"
            />

            {/* Sidebar content drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#0e1012] border-l border-white/[0.08] shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#00f6ac]" />
                    Lead Manager Dashboard
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage and sync signup sheets to Google Sheets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {/* Authorization Setup Area */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-400">
                        Spreadsheet Integration
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Authorize with Google to activate automated/manual worksheet sync.
                      </p>
                    </div>
                    {user ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 text-[10px] font-mono">
                        Disconnected
                      </span>
                    )}
                  </div>

                  {user ? (
                    <div className="space-y-4.5 pt-1.5">
                      <div className="flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.03]">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'Google Account'} 
                            className="w-8 h-8 rounded-full border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#00f6ac]/10 flex items-center justify-center font-mono text-[#00f6ac] font-bold text-sm">
                            {user.displayName?.[0] || 'G'}
                          </div>
                        )}
                        <div className="text-left leading-none">
                          <p className="text-xs font-semibold text-white">{user.displayName || 'Authorized Admin'}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">{user.email}</p>
                        </div>
                      </div>

                      {user.email !== 'Dsylvestrealain@gmail.com' && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>
                            Warning: Connected email <strong>{user.email}</strong> is not verified as the administrator email (Dsylvestrealain@gmail.com). You cannot load Cloud Firestore entries.
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={syncLeadsToGoogle}
                          disabled={isSyncing}
                          className="flex-1 bg-[#00f6ac] hover:bg-[#2effc0] disabled:bg-[#00f6ac]/50 text-black text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#00f6ac]/5 hover:shadow-[#00f6ac]/15 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {isSyncing ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <span>{isSyncing ? 'Syncing...' : 'Sync to Google Sheets'}</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-xl border border-red-500/20 transition-all cursor-pointer hover:text-white"
                          title="Disconnect Account"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2.5">
                      <button
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="w-full flex items-center justify-center gap-2 bg-white bg-opacity-95 hover:bg-white text-[#121315] font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {isLoggingIn ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-[#121315]" />
                        ) : (
                          <LogIn className="h-4 w-4 text-[#121315]" />
                        )}
                        <span>Sign in with Administrator Google Account</span>
                      </button>
                    </div>
                  )}

                  {syncError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-start gap-2 animate-shake">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{syncError}</span>
                    </div>
                  )}

                  {lastSyncedSpreadsheetId && (
                    <div className="pt-2 border-t border-white/[0.04]">
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${lastSyncedSpreadsheetId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#00f6ac] hover:underline font-mono"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open "Engage Community Leads" Sheet
                      </a>
                    </div>
                  )}
                </div>

                {/* Submissions stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">
                      Total Leads (Cloud DB)
                    </p>
                    <p className="text-2.5xl font-serif font-bold text-white mt-1">
                      {leads.length}
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">
                      Pending Sync
                    </p>
                    <p className={`text-2.5xl font-serif font-bold mt-1 ${pendingCount > 0 ? 'text-amber-400' : 'text-[#00f6ac]'}`}>
                      {pendingCount}
                    </p>
                  </div>
                </div>

                {/* Leads lists directories */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                      Sign-up Directory ({leads.length})
                      {isLoadingLeads && <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#00f6ac]" />}
                    </h4>
                    {leads.length > 0 && (
                      <button
                        onClick={clearLeads}
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500 hover:underline font-mono cursor-pointer bg-transparent border-none"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear directory
                      </button>
                    )}
                  </div>

                  {leads.length === 0 ? (
                    <div className="py-12 text-center rounded-2xl bg-white/[0.01] border border-white/[0.04] p-6">
                      <div className="w-10 h-10 rounded-full bg-white/[0.02] mx-auto flex items-center justify-center text-gray-600 mb-3.5">
                        <Clock className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No leads in database yet</p>
                      <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto leading-relaxed">
                        Leads filled out by users globally will be securely saved into Firestore and populate here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar-thin">
                      {leads.map((lead) => (
                        <div 
                          key={lead.id}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-all flex items-center justify-between text-left"
                        >
                          <div className="space-y-1 pr-4 truncate">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-white truncate">{lead.name}</span>
                              <span className="text-[10px] font-mono text-gray-400 shrink-0">({lead.country.flag})</span>
                              {lead.gender && (
                                <span className={`text-[8px] px-1 py-0.1 rounded font-mono font-semibold shrink-0 ${
                                  lead.gender === 'Homme' || lead.gender === 'Hombre' || lead.gender === 'Male' || lead.gender === 'M'
                                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                                    : 'bg-pink-500/15 text-pink-400 border border-pink-500/20'
                                }`}>
                                  {lead.gender === 'M' ? 'Homme' : 
                                   lead.gender === 'F' ? 'Femme' : 
                                   lead.gender}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-gray-400 truncate">
                              {lead.country.dialCode} {lead.phone}
                            </p>
                            <div className="text-[9px] text-gray-400 font-mono space-y-0.5 mt-1">
                              <div className="truncate"><span className="text-[#00f6ac]/70 font-semibold font-mono">Profil:</span> {lead.description}</div>
                              <div className="truncate"><span className="text-[#00f6ac]/70 font-semibold font-mono">Blocage:</span> {lead.experience}</div>
                              {lead.readyToInvest && <div className="truncate"><span className="text-[#00f6ac]/70 font-semibold font-mono">Budget:</span> {lead.readyToInvest}</div>}
                            </div>
                            <p className="text-[9px] text-gray-500 font-mono mt-1">
                              {new Date(lead.timestamp).toLocaleDateString()} at {new Date(lead.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {lead.synced ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00f6ac]/15 text-[#00f6ac] border border-[#00f6ac]/20 text-[9px] font-mono">
                                <CheckCircle2 className="h-3 w-3" />
                                Synced
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono">
                                <Clock className="h-3 w-3" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/[0.06] bg-[#0c0d0f] text-[10px] font-mono text-gray-500 text-left flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-[#00f6ac] shrink-0" />
                <span>
                  All registration details submitted by visitors are stored directly in Cloud Firestore (Zero-Trust authorization rules) and synchronized to your designated Google Sheet of preference.
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
