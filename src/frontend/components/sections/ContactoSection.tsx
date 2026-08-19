import { motion } from "motion/react";
import { Instagram, Clock, ArrowRight, MessageCircle, Mail } from "lucide-react";
import { Button } from "../ui/Button";
import { siteConfig } from "../../config/site";
import { useRevealOnce } from "../../hooks/useRevealOnce";
import { whatsappLink, mailtoLink } from "../../lib/contact";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const hidden = { opacity: 0, y: 20 } as const;
const shown = { opacity: 1, y: 0 } as const;

export function ContactoSection() {
  const { ref, visible } = useRevealOnce();
  const whatsapp = whatsappLink();

  return (
    <section id="contacto" className="py-24 px-4 sm:px-6 bg-neutral-950/50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={hidden}
          animate={visible ? shown : hidden}
          transition={{ duration: 0.6, ...hermit }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-semibold tracking-widest text-accent-soft uppercase mb-3">
            Contacto
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Empezá hoy
          </h2>
          <p className="text-gray-400 mb-10">
            Solicitá tu turno online o escribime directamente.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-10">
            <a href="/solicitar">
              <Button size="lg">
                Solicitar turno
                <ArrowRight size={18} />
              </Button>
            </a>

            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  <MessageCircle size={18} />
                  WhatsApp
                </Button>
              </a>
            )}

            <a
              href={siteConfig.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline">
                <Instagram size={18} />
                {siteConfig.contact.instagram}
              </Button>
            </a>

            <a href={mailtoLink("Consulta por clases particulares")}>
              <Button size="lg" variant="outline">
                <Mail size={18} />
                {siteConfig.contact.email}
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{siteConfig.contact.schedule}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
