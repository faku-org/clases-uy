import { useState } from "react";
import { motion } from "motion/react";
import { useQuery } from "@apollo/client";
import { useRevealOnce } from "../../hooks/useRevealOnce";
import { UNIVERSITIES_QUERY } from "../../lib/graphql";
import { SectionHeading } from "../ui/SectionHeading";

type Faculty = { id: string; name: string; subjects: { id: string; name: string }[] };
type University = { id: string; name: string; shortName: string; faculties: Faculty[] };

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const hidden20 = { opacity: 0, y: 20 } as const;
const hidden16 = { opacity: 0, y: 16 } as const;
const shown = { opacity: 1, y: 0 } as const;

export function MateriasSection() {
  const { ref, visible } = useRevealOnce();
  const [activeTab, setActiveTab] = useState(0);

  const { data } = useQuery<{ universities: University[] }>(UNIVERSITIES_QUERY);
  const universities = data?.universities ?? [];
  const active = universities[activeTab];

  return (
    <section id="materias" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={hidden20}
          animate={visible ? shown : hidden20}
          transition={{ duration: 0.6, ...hermit }}
          className="mb-14"
        >
          <SectionHeading
            eyebrow="Materias"
            title="¿Qué materia necesitás?"
            description="Matemática, física, química y economía, con el programa de cada cátedra. Elegí tu universidad."
          />
        </motion.div>

        <motion.div
          initial={hidden16}
          animate={visible ? shown : hidden16}
          transition={{ duration: 0.6, delay: 0.1, ...hermit }}
        >
          {/* Tabs por universidad */}
          <div className="flex flex-wrap gap-2 mb-8">
            {universities.map((university, i) => (
              <button
                key={university.id}
                onClick={() => setActiveTab(i)}
                title={university.name}
                className={`px-4 py-2 rounded-lg font-mono text-sm tracking-wide transition-all duration-200 cursor-pointer border ${
                  activeTab === i
                    ? "bg-accent text-white border-accent shadow-[0_10px_30px_-14px_rgba(33,150,243,0.9)]"
                    : "bg-slate text-gray-400 border-line hover:text-accent-pale hover:border-accent/40"
                }`}
              >
                {university.shortName}
              </button>
            ))}
          </div>

          {/* Materias por facultad */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-2 to-slate border border-line min-h-40">
            {!active && (
              <p className="text-sm text-gray-500">Cargando materias...</p>
            )}

            {active?.faculties.map((faculty, f) => (
              <div key={faculty.id} className={f > 0 ? "mt-7" : ""}>
                <p className="font-mono text-[11px] text-accent-soft/70 uppercase tracking-[0.18em] mb-4">
                  {faculty.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {faculty.subjects.map((subject, i) => (
                    <motion.span
                      key={subject.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
                      className="px-3 py-1.5 rounded-lg bg-accent/5 border border-line text-sm text-gray-300 hover:border-accent/40 hover:text-accent-pale transition-colors"
                    >
                      {subject.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
