import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../lib/auth";
import { REGISTER_MUTATION } from "../lib/graphql";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<FormState>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "El nombre es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email inválido";
    if (form.password.length < 8) next.password = "Mínimo 8 caracteres";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Las contraseñas no coinciden";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    try {
      const { data } = await registerMutation({
        variables: {
          input: { name: form.name, email: form.email, password: form.password },
        },
      });
      login(data.register.user);
      navigate("/solicitar");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrarse";
      setServerError(msg.replace("GraphQL error: ", ""));
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value }),
    error: errors[key],
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e06666]/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ...hermit }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#e06666] flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              Clases <span className="text-[#e06666]">ORT</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Crear cuenta</h1>
          <p className="text-sm text-gray-400">Registrate para solicitar clases</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          {serverError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nombre completo"
              placeholder="Nicolas Stecar"
              autoComplete="name"
              {...field("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              {...field("email")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  {...field("password")}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg bg-neutral-900 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-neutral-700 focus:border-[#e06666] focus:ring-[#e06666]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <Input
              label="Confirmar contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              {...field("confirmPassword")}
            />

            <Button type="submit" loading={loading} className="w-full mt-1">
              Crear cuenta
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-[#e06666] hover:text-[#c85555] transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
