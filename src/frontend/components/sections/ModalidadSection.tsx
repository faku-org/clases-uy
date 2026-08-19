import { motion } from "motion/react";
import { Video, Monitor, Clock } from "lucide-react";
import { useRevealOnce } from "../../hooks/useRevealOnce";
import { SectionHeading } from "../ui/SectionHeading";
import { Card, CardIcon } from "../ui/Card";

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
          className="mb-14"
        >
          <SectionHeading
            eyebrow="Modalidad"
            title="Clases 100% online"
            description="Uno a uno por videollamada, con pizarra interactiva para resolver los ejercicios juntos. Sin traslados y con el horario que elijas."
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={hidden}
              animate={visible ? shown : hidden}
              transition={{ duration: 0.6, delay: i * 0.1, ...hermit }}
            >
              <Card className="h-full p-6">
                <CardIcon>
                  <card.icon size={20} />
                </CardIcon>
                <h3 className="font-semibold text-white mt-5 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
