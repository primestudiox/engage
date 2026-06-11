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
            desc: 'We collect the information you provide voluntarily during registration (such as name, email address, phone number, and experience parameters) to configure your WhatsApp community access.',
          },
          {
            title: 'Utilization of Information',
            desc: 'This data is used solely to deliver the WhatsApp community invite, personalize content suggestions (like beginner vs developer tools), and communicate weekly summaries.',
          },
          {
            title: 'Privacy Protection',
            desc: 'Your private contact details are kept secure and are never rented, shared, or sold to third-party services. General analytics are fully anonymized.',
          },
        ],
      },
      terms: {
        title: 'Terms of Use',
        sub: 'Guidelines for participating in the Engage community.',
        items: [
          {
            title: 'Community Access',
            desc: 'Access to the WhatsApp updates channel and curated AI resources is offered completely free of charge for personal and professional growth.',
          },
          {
            title: 'Code of Conduct',
            desc: 'All community participants are expected to maintain professional courtesy. Spamming, harassing other members, or distributing malicious tools is strictly prohibited.',
          },
          {
            title: 'Disclaimer of Warranty',
            desc: 'Curated resources, custom prompts, and weekly Masterclass content are provided "as-is" without warranty. Users execute templates at their own discretion.',
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
            desc: 'Nous récoltons les informations fournies volontairement lors de votre inscription (nom, email, téléphone, expertise) afin de configurer votre accès à la communauté.',
          },
          {
            title: 'Utilisation des informations',
            desc: 'Ces données servent uniquement à la bonne transmission du lien d\'invitation WhatsApp, à la personnalisation des conseils et à l\'envoi des résumés hebdomadaires.',
          },
          {
            title: 'Protection de la vie privée',
            desc: 'Vos détails de contact privés restent stockés en sécurité et ne sont jamais loués, partagés ou vendus à des tiers pour des fins commerciales.',
          },
        ],
      },
      terms: {
        title: 'Conditions d’Utilisation',
        sub: 'Règles d’usage pour participer à Engage.',
        items: [
          {
            title: 'Accès Communautaire',
            desc: 'La participation au groupe WhatsApp et l\'accès aux ressources IA sont facultatifs et offerts gratuitement à titre individuel et professionnel.',
          },
          {
            title: 'Code de Conduite',
            desc: 'Les membres doivent faire preuve d\'un comportement courtois et constructif. Le spam ou la promotion de contenus malveillants entraîne un bannissement immédiat.',
          },
          {
            title: 'Limite de Responsabilité',
            desc: 'Les guides, configurations et scripts tiers sont partagés à but éducatif. Engage ne peut être tenu responsable d\'une perte de données liée à leur usage.',
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
            desc: 'Guardamos la información proporcionada voluntariamente al registrarte (como nombre, correo, teléfono y conocimientos de programación) para habilitar tu cuenta.',
          },
          {
            title: 'Uso de tu información',
            desc: 'Esta información se utiliza únicamente para darte acceso al grupo de WhatsApp, refinar tus sugerencias semanales y enviar boletines de actualizaciones IA.',
          },
          {
            title: 'Protección de privacidad',
            desc: 'Tus datos de contacto privados nunca se alquilan, comparten ni venden a servicios de terceros sin tu consentimiento explícito.',
          },
        ],
      },
      terms: {
        title: 'Términos de Uso',
        sub: 'Políticas para participar en Engage.',
        items: [
          {
            title: 'Acceso a la comunidad',
            desc: 'El ingreso al canal de WhatsApp "Engage" y las utilerías gratuitas se garantizan sin costo alguno para tu aprendizaje continuo.',
          },
          {
            title: 'Código de Conducta',
            desc: 'Se requiere respeto profesional en todos los canales. Queda prohibido el spam, publicidad no autorizada o distribución de herramientas dañinas.',
          },
          {
            title: 'Exclusión de Garantías',
            desc: 'Los prompts y recomendaciones se proveen "tal cual" sin soporte garantizado. El usuario es responsable de su ejecución en entornos productivos.',
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
