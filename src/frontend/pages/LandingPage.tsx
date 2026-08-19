import { Navbar } from "../components/sections/Navbar";
import { HeroSection } from "../components/sections/HeroSection";
import { ModalidadSection } from "../components/sections/ModalidadSection";
import { PreciosSection } from "../components/sections/PreciosSection";
import { MetodoSection } from "../components/sections/MetodoSection";
import { MateriasSection } from "../components/sections/MateriasSection";
import { ContactoSection } from "../components/sections/ContactoSection";
import { Footer } from "../components/sections/Footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-ink">
      {/* La hoja cuadriculada corre por debajo de toda la página */}
      <div
        className="cuadriculado pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ModalidadSection />
        <PreciosSection />
        <MetodoSection />
        <MateriasSection />
        <ContactoSection />
        <Footer />
      </div>
    </div>
  );
}
