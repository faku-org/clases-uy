import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../lib/auth";
import { LOGIN_MUTATION } from "../lib/graphql";
import { DemoCredentials } from "../components/DemoCredentials";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await loginMutation({
        variables: { email: form.email, password: form.password },
      });
      login(data.login.user);
      navigate(data.login.user.role === "admin" ? "/admin" : "/mis-turnos");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(msg.replace("GraphQL error: ", ""));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ...hermit }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              Clases<span className="text-accent-soft">UY</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido de vuelta</h1>
          <p className="text-sm text-gray-400">Ingresá con tu cuenta</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-1">
              Ingresar
            </Button>
          </form>
        </div>

        <DemoCredentials
          onUse={(account) => {
            setError("");
            setForm({ email: account.email, password: account.password });
          }}
        />

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-accent-soft hover:text-accent-pale transition-colors">
            Registrate
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
