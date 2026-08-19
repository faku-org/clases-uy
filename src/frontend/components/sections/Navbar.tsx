import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useScrolled } from "../../hooks/useScrolled";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/Button";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Precios", href: "#precios" },
  { label: "Materias", href: "#materias" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const scrolled = useScrolled();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-800/60"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#e06666] flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            Clases <span className="text-[#e06666]">ORT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                  Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate("/mis-turnos")}>
                Mis turnos
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Ingresar
              </Button>
              <Button size="sm" onClick={() => navigate("/solicitar")}>
                Solicitar turno
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0a0a0a]/98 border-b border-neutral-800 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
                {user ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => { navigate("/mis-turnos"); setMenuOpen(false); }}
                    >
                      Mis turnos
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Salir
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => { navigate("/login"); setMenuOpen(false); }}
                    >
                      Ingresar
                    </Button>
                    <Button
                      onClick={() => { navigate("/solicitar"); setMenuOpen(false); }}
                    >
                      Solicitar turno
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
