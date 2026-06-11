import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env;
const supabaseUrl = metaEnv?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

let client: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
} else {
  console.warn(
    'Supabase credentials are not configured yet. The application will run, but database submissions will fail. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
  );
}

const createFallbackChain = () => {
  return {
    insert: () => {
      console.error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return Promise.resolve({ data: null, error: new Error('Supabase is not configured') });
    },
    select: () => {
      console.error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return Promise.resolve({ data: null, error: new Error('Supabase is not configured') });
    },
    update: () => {
      console.error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return Promise.resolve({ data: null, error: new Error('Supabase is not configured') });
    },
    delete: () => {
      console.error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return Promise.resolve({ data: null, error: new Error('Supabase is not configured') });
    },
    upsert: () => {
      console.error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return Promise.resolve({ data: null, error: new Error('Supabase is not configured') });
    }
  };
};

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!client) {
      if (prop === 'from') {
        return () => createFallbackChain();
      }
      return undefined;
    }
    const val = client[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  }
});
