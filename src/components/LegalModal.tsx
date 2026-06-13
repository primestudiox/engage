import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
  lang: 'en' | 'fr' | 'es';
}

export default function LegalModal({ isOpen, onClose, type, lang }: LegalModalProps) {
  const content = {
    en: {
      privacy: {
        title: 'Privacy Policy',
        sub: 'We care about your privacy at Engage.',
        items: [
          {
            title: 'Data Collection',
            desc: 'We collect the information you provide voluntarily during registration (such as name, email address, phone number, business status, profile, biggest obstacle, and investment readiness) to register you for the 10-Day Challenge and process your requests.',
          },
          {
            title: 'Utilization of Information',
            desc: 'This data is used solely to deliver the Business AI Challenge details, process requested audits (Mastermind), communicate newsletters with special program discounts (35%), and grant access to the WhatsApp group.',
          },
          {
            title: 'Privacy Protection',
            desc: 'Your private contact details are kept fully secure and are never rented, shared, or sold to third-party services. You retain complete control over your personal data and can request deletion at any time.',
          },
        ],
      },
      terms: {
        title: 'Terms of Use',
        sub: 'Guidelines for participating in the Business AI Challenge and community.',
        items: [
          {
            title: 'Registration & Audits',
            desc: 'Participation in the 10-Day Business AI Challenge, weekly newsletter, and the option to request a personalized audit or special offers are completely voluntary and designed for professional growth.',
          },
          {
            title: 'Community Code of Conduct',
            desc: 'All community participants in WhatsApp and other channels must maintain professional courtesy. Spamming, unsolicious marketing, or distributing harmful content is strictly prohibited.',
          },
          {
            title: 'Educational Disclaimer',
            desc: 'Challenge materials, potential business plans, and strategy advice are provided "as-is" for educational and illustrative purposes. Custom strategies depend on execution; no financial results are guaranteed.',
          },
        ],
      },
    },
    fr: {
      privacy: {
        title: 'Politique de Confidentialité',
        sub: 'Nous protégeons vos données chez Engage.',
        items: [
          {
            title: 'Collecte des données',
            desc: 'Nous récoltons les informations fournies volontairement lors de votre inscription (nom, email, téléphone, statut d\'entreprise, profil, obstacle majeur, intérêt d\'investissement) afin d\'enregistrer votre participation au Challenge de 10 Jours et traiter vos demandes.',
          },
          {
            title: 'Utilisation des informations',
            desc: 'Ces données servent uniquement d\'accès au Challenge Business IA, de traitement des demandes d\'audit personnalisé (Mastermind), d\'envoi de la newsletter avec offres spéciales (-35% de réduction) et de transmission du lien WhatsApp.',
          },
          {
            title: 'Protection de la vie privée',
            desc: 'Vos détails de contact privés restent stockés de manière hautement sécurisée. Ils ne sont jamais loués, partagés ou vendus à des tiers. Vous disposez d\'un droit total d\'accès, de modification ou de suppression.',
          },
        ],
      },
      terms: {
        title: 'Conditions d’Utilisation',
        sub: 'Règles d’usage pour participer au Challenge Business IA.',
        items: [
          {
            title: 'Inscription & Audits',
            desc: 'La participation au Challenge de 10 Jours, la newsletter et l\'accès aux demandes d\'audit personnalisé ou réductions promotionnelles sont facultatives et proposées pour stimuler votre croissance entrepreneuriale.',
          },
          {
            title: 'Code de Conduite de la Communauté',
            desc: 'Tous les participants au groupe WhatsApp ou canaux associés doivent faire preuve de courtoisie professionnelle. Les spams, la publicité sauvage et le démarchage non sollicité entraînent une exclusion immédiate.',
          },
          {
            title: 'Limite de Responsabilité',
            desc: 'Les supports du challenge, exemples de plans d\'affaires IA et livrables sont fournis à titre éducatif et indicatif. Les résultats dépendent entièrement de votre exécution ; aucun revenu ou gain n\'est garanti.',
          },
        ],
      },
    },
    es: {
      privacy: {
        title: 'Política de Privacidad',
        sub: 'Cuidamos de tu privacidad en Engage.',
        items: [
          {
            title: 'Recopilación de datos',
            desc: 'Guardamos la información proporcionada voluntariamente al registrarte (nombre, correo, teléfono, estado del negocio, perfil, mayor obstáculo y disponibilidad a invertir) para registrar tu participación al Desafío de 10 Días y procesar tus solicitudes.',
          },
          {
            title: 'Uso de tu información',
            desc: 'Esta información se utiliza únicamente para el Desafío de IA Empresarial, procesar la auditoría solicitada (Mastermind), enviar boletines con descuentos especiales (35% de descuento) y dar acceso al grupo privado de WhatsApp.',
          },
          {
            title: 'Protección de privacidad',
            desc: 'Tus datos de contacto privados se guardan en servidores seguros. Nunca se alquilan ni venden a terceros sin consentimiento. Cuentas con derecho absoluto para solicitar su baja o rectificación.',
          },
        ],
      },
      terms: {
        title: 'Términos de Uso',
        sub: 'Políticas para participar en el Desafío de IA Empresarial.',
        items: [
          {
            title: 'Registro y Auditorías',
            desc: 'La participación en el Desafío de 10 Días, boletines informativos o solicitudes de asesoramiento personalizado son opcionales y destinados exclusivamente al desarrollo profesional y empresarial.',
          },
          {
            title: 'Código de Conducta Comunitaria',
            desc: 'Se requiere respeto profesional en todos los canales como WhatsApp. El envío de spam, prospección no solicitada o conductas difamatorias conllevará la expulsión inmediata.',
          },
          {
            title: 'Exclusión de Garantías',
            desc: 'Los materiales del curso, planes de negocio guía y consejos se entregan de forma informativa. El éxito depende de tu implementación directa; no se garantizan resultados económicos concretos.',
          },
        ],
      },
    },
  };

  const active = content[lang][type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85"
          />

          {/* Modal Container card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0e1012] text-white shadow-2xl p-6 md:p-8"
          >
            {/* Header section with closing button */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="inline-flex items-center gap-1 bg-[#00f6ac]/15 text-[#00f6ac] text-[11px] font-semibold tracking-wider font-mono uppercase px-2 py-0.5 rounded-md border border-[#00f6ac]/25">
                  <Lock className="h-2.5 w-2.5" /> {lang === 'fr' ? 'Sécurité Certifiée' : lang === 'es' ? 'Seguridad Certificada' : 'Security Certified'}
                </span>
                <h3 className="text-2.5xl font-serif font-extrabold tracking-tight mt-2">{active.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{active.sub}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Cards */}
            <div className="space-y-4">
              {active.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.015] border border-white/[0.04] p-4.5 rounded-2xl flex items-start gap-4 transition-all hover:bg-white/[0.025] hover:border-white/[0.08]"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f6ac]/15 to-transparent border border-[#00f6ac]/25 text-[#00f6ac] font-mono text-xs font-bold flex items-center justify-center select-none">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white tracking-wide text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-[12.5px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button Action */}
            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer border border-white/5 hover:border-white/10"
              >
                {lang === 'fr' ? 'Fermer' : lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
