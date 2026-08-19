import { motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { siteConfig } from "../../config/site";
import { useRevealOnce } from "../../hooks/useRevealOnce";

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
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest text-[#e06666] uppercase mb-3">
            Precios
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Simple y transparente</h2>
          <p className="mt-3 text-gray-400">Sin costos ocultos. Pagás por adelantado vía PayPal.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Individual */}
          <motion.div
            initial={hidden24}
            animate={visible ? shown : hidden24}
            transition={{ duration: 0.6, delay: 0.1, ...hermit }}
            className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col"
          >
            <p className="text-sm font-medium text-gray-400 mb-1">{pricing.individual.label}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-bold text-white">${pricing.individual.price}</span>
              <span className="text-gray-400 mb-1.5">{pricing.individual.currency}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">{pricing.individual.duration}</p>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {["1 clase de 90 minutos", "Google Meet + pizarra virtual", "Atención personalizada"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={14} className="text-[#e06666] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" onClick={() => navigate("/solicitar")}>
              Solicitar clase
            </Button>
          </motion.div>

          {/* Pack */}
          <motion.div
            initial={hidden24}
            animate={visible ? shown : hidden24}
            transition={{ duration: 0.6, delay: 0.2, ...hermit }}
            className="p-8 rounded-2xl bg-[#e06666]/5 border border-[#e06666]/20 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffd966]/15 border border-[#ffd966]/30">
              <Zap size={11} className="text-[#ffd966]" />
              <span className="text-[10px] font-semibold text-[#ffd966]">{pricing.pack.badge}</span>
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">{pricing.pack.label}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-bold text-white">${pricing.pack.price}</span>
              <span className="text-gray-400 mb-1.5">{pricing.pack.currency}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{pricing.pack.duration}</p>
            <p className="text-xs text-[#ffd966]/70 mb-6">
              ${pricing.pack.price / 4} por clase · Ahorrás $
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
                  <Check size={14} className="text-[#e06666] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/solicitar")}>Solicitar pack</Button>
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
