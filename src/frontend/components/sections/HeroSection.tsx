import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { siteConfig } from "../../config/site";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1524] via-ink to-ink" />

      {/* Curva trazada sobre el cuadriculado: la firma de la marca */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="curva" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2196f3" stopOpacity="0" />
            <stop offset="45%" stopColor="#90caf9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2196f3" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -40 690 C 220 690, 300 560, 420 430 S 640 150, 900 110 S 1150 80, 1240 70"
          fill="none"
          stroke="url(#curva)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
        />
      </svg>

      {/* Brand glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[460px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-[420px] h-[320px] bg-accent-hover/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/5 w-[320px] h-[260px] bg-accent-soft/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ...hermit }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs text-accent-pale mb-8 backdrop-blur-sm"
        >
          <Star size={12} className="text-accent-soft" fill="currentColor" />
          Desde {siteConfig.since} · {siteConfig.specialization}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ...hermit }}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-none bg-gradient-to-br from-white via-accent-pale to-accent-soft bg-clip-text text-transparent"
        >
          Clases
          <span className="text-accent-soft relative font-serif italic">
            UY
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-soft via-accent to-accent-hover rounded-full" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ...hermit }}
          className="text-xl sm:text-2xl font-medium text-gray-300 mb-3"
        >
          {siteConfig.teacher}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ...hermit }}
          className="text-base text-gray-500 mb-10 max-w-xl mx-auto"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ...hermit }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button size="lg" onClick={() => navigate("/solicitar")}>
            Solicitar turno
            <ArrowRight size={18} />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
            Ingresar
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ...hermit }}
          className="mt-14"
        >
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
            Materias de
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {siteConfig.universities.map((university) => (
              <span
                key={university.short}
                title={university.name}
                className="px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-sm font-medium text-gray-300 hover:border-accent/50 hover:bg-accent/10 hover:text-accent-pale transition-colors"
              >
                {university.short}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
