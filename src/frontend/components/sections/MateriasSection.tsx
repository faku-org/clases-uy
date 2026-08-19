import { useState } from "react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";
import { useRevealOnce } from "../../hooks/useRevealOnce";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const hidden20 = { opacity: 0, y: 20 } as const;
const hidden16 = { opacity: 0, y: 16 } as const;
const shown = { opacity: 1, y: 0 } as const;

export function MateriasSection() {
  const { ref, visible } = useRevealOnce();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="materias" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={hidden20}
          animate={visible ? shown : hidden20}
          transition={{ duration: 0.6, ...hermit }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest text-[#e06666] uppercase mb-3">
            Materias
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">¿Qué materia necesitás?</h2>
          <p className="mt-3 text-gray-400">
            Cobertura completa de matemáticas, física, economía y más.
          </p>
        </motion.div>

        <motion.div
          initial={hidden16}
          animate={visible ? shown : hidden16}
          transition={{ duration: 0.6, delay: 0.1, ...hermit }}
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {siteConfig.faculties.map((faculty, i) => (
              <button
                key={faculty.name}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === i
                    ? "bg-[#e06666] text-white"
                    : "bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                }`}
              >
                {faculty.name.replace("Facultad de ", "")}
              </button>
            ))}
          </div>

          {/* Subjects */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {siteConfig.faculties[activeTab].name}
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.faculties[activeTab].subjects.map((subject, i) => (
                <motion.span
                  key={subject}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-gray-300"
                >
                  {subject}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
