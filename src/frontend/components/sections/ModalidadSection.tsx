import { motion } from "motion/react";
import { Video, Monitor, Clock } from "lucide-react";
import { useRevealOnce } from "../../hooks/useRevealOnce";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

const hidden = { opacity: 0, y: 24 } as const;
const shown = { opacity: 1, y: 0 } as const;
const shownSm = { opacity: 1, y: 0 } as const;
const hiddenSm = { opacity: 0, y: 20 } as const;

const cards = [
  {
    icon: Video,
    title: "Videollamada",
    description: "Clases por Google Meet con alta calidad de video y audio.",
  },
  {
    icon: Monitor,
    title: "Pizarra virtual",
    description: "Pizarra interactiva en tiempo real para resolver ejercicios juntos.",
  },
  {
    icon: Clock,
    title: "90 minutos",
    description: "Sesiones de 90 minutos, el tiempo ideal para cubrir contenido en profundidad.",
  },
];

export function ModalidadSection() {
  const { ref, visible } = useRevealOnce();

  return (
    <section className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={hiddenSm}
          animate={visible ? shownSm : hiddenSm}
          transition={{ duration: 0.6, ...hermit }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest text-[#e06666] uppercase mb-3">
            Modalidad
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Clases 100% online
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Clases individuales por videollamada con pizarra virtual interactiva.
            Sin traslados, sin horarios fijos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={hidden}
              animate={visible ? shown : hidden}
              transition={{ duration: 0.6, delay: i * 0.1, ...hermit }}
              className="group p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e06666]/10 flex items-center justify-center mb-4 group-hover:bg-[#e06666]/15 transition-colors">
                <card.icon size={20} className="text-[#e06666]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
