import { motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { siteConfig } from "../../config/site";
import { useRevealOnce } from "../../hooks/useRevealOnce";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const hidden20 = { opacity: 0, y: 20 } as const;
const hidden24 = { opacity: 0, y: 24 } as const;
const hidden0 = { opacity: 0 } as const;
const shown = { opacity: 1, y: 0 } as const;
const shown0 = { opacity: 1 } as const;

export function PreciosSection() {
  const { ref, visible } = useRevealOnce();
  const navigate = useNavigate();
  const { pricing } = siteConfig;

  return (
    <section id="precios" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={hidden20}
          animate={visible ? shown : hidden20}
          transition={{ duration: 0.6, ...hermit }}
          className="mb-14"
        >
          <SectionHeading
            eyebrow="Precios"
            title="Simple y transparente"
            description="Sin costos ocultos. Se abona por adelantado vía PayPal."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Individual */}
          <motion.div
            initial={hidden24}
            animate={visible ? shown : hidden24}
            transition={{ duration: 0.6, delay: 0.1, ...hermit }}
          >
            <Card className="h-full p-8 flex flex-col">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-3">
              {pricing.individual.label}
            </p>
            <div className="flex items-end gap-1.5 mb-1">
              <span className="font-mono text-5xl font-semibold text-white tabular-nums">
                ${pricing.individual.price}
              </span>
              <span className="font-mono text-sm text-gray-400 mb-2">
                {pricing.individual.currency}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-6">{pricing.individual.duration}</p>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {["1 clase de 90 minutos", "Google Meet + pizarra virtual", "Atención personalizada"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={14} className="text-accent-soft shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" onClick={() => navigate("/solicitar")}>
              Solicitar clase
            </Button>
            </Card>
          </motion.div>

          {/* Pack */}
          <motion.div
            initial={hidden24}
            animate={visible ? shown : hidden24}
            transition={{ duration: 0.6, delay: 0.2, ...hermit }}
          >
            <Card featured className="h-full p-8 flex flex-col overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30">
              <Zap size={11} className="text-accent-soft" />
              <span className="font-mono text-[10px] font-medium text-accent-soft uppercase tracking-wider">
                {pricing.pack.badge}
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-3">
              {pricing.pack.label}
            </p>
            <div className="flex items-end gap-1.5 mb-1">
              <span className="font-mono text-5xl font-semibold text-white tabular-nums">
                ${pricing.pack.price}
              </span>
              <span className="font-mono text-sm text-gray-400 mb-2">{pricing.pack.currency}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{pricing.pack.duration}</p>
            <p className="font-mono text-xs text-accent-soft mb-6 tabular-nums">
              ${pricing.pack.price / 4} por clase · ahorrás $
              {pricing.individual.price * 4 - pricing.pack.price}
            </p>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {[
                "4 clases de 90 minutos",
                "Google Meet + pizarra virtual",
                "Seguimiento continuo del progreso",
                "Mejor precio por clase",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={14} className="text-accent-soft shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/solicitar")}>Solicitar pack</Button>
            </Card>
          </motion.div>
        </div>

        <motion.p
          initial={hidden0}
          animate={visible ? shown0 : hidden0}
          transition={{ duration: 0.6, delay: 0.4, ...hermit }}
          className="text-center text-xs text-gray-500 mt-6 max-w-lg mx-auto"
        >
          {pricing.note}
        </motion.p>
      </div>
    </section>
  );
}
