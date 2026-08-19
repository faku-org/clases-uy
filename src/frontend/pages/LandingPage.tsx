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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <HeroSection />
      <ModalidadSection />
      <PreciosSection />
      <MetodoSection />
      <MateriasSection />
      <ContactoSection />
      <Footer />
    </div>
  );
}
