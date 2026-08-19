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
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-[#0a0a0a] to-[#0a0a0a]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#e06666]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ...hermit }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-gray-400 mb-8"
        >
          <Star size={12} className="text-[#ffd966]" fill="#ffd966" />
          Desde {siteConfig.since} — {siteConfig.specialization}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ...hermit }}
          className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-none"
        >
          Clases{" "}
          <span className="text-[#e06666] relative">
            ORT
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#e06666]/30 rounded-full" />
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
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
