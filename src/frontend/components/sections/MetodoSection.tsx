import { motion } from "motion/react";
import { UserCheck, BookOpen, Smile, Target } from "lucide-react";
import { siteConfig } from "../../config/site";
import { useRevealOnce } from "../../hooks/useRevealOnce";
import { SectionHeading } from "../ui/SectionHeading";
import { Card, CardIcon } from "../ui/Card";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const hidden20 = { opacity: 0, y: 20 } as const;
const hidden24 = { opacity: 0, y: 24 } as const;
const shown = { opacity: 1, y: 0 } as const;

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  BookOpen,
  Smile,
  Target,
};

export function MetodoSection() {
  const { ref, visible } = useRevealOnce();

  return (
    <section className="py-24 px-4 sm:px-6 bg-neutral-950/50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={hidden20}
          animate={visible ? shown : hidden20}
          transition={{ duration: 0.6, ...hermit }}
          className="mb-14"
        >
          <SectionHeading
            eyebrow="Método"
            title="Por qué funciona"
            description="Veinte años dando la misma materia enseñan dónde se traba cada alumno. La clase se arma alrededor de eso."
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {siteConfig.method.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Target;
            return (
              <motion.div
                key={item.title}
                initial={hidden24}
                animate={visible ? shown : hidden24}
                transition={{ duration: 0.6, delay: i * 0.08, ...hermit }}
              >
                <Card className="h-full flex gap-4 p-6">
                  <div className="shrink-0">
                    <CardIcon>
                      <Icon size={20} />
                    </CardIcon>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1.5">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
