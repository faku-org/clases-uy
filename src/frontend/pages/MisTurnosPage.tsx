import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { motion } from "motion/react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  Plus,
  BookOpen,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { MIS_SOLICITUDES_QUERY } from "../lib/graphql";
import { useAuth } from "../lib/auth";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

type Solicitud = {
  id: string;
  subject: { id: string; name: string; faculty: { name: string } };
  difficulty: number;
  urgency: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  assignedDate: string | null;
  assignedTime: string | null;
  durationMinutes: number | null;
  googleEventLink: string | null;
  createdAt: string;
};

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    icon: Clock,
    color: "text-amber",
    bg: "bg-amber/10 border-amber/20",
  },
  approved: {
    label: "Aprobada",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  rejected: {
    label: "Rechazada",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
};

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function SolicitudCard({ s }: { s: Solicitud }) {
  const cfg = STATUS_CONFIG[s.status];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ...hermit }}
      className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-semibold text-white">{s.subject.name}</p>
          <p className="text-sm text-gray-500">{s.subject.faculty.name}</p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}
        >
          <Icon size={12} />
          {cfg.label}
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        Solicitado el {formatDate(s.createdAt)}
      </div>

      {s.status === "approved" && s.assignedDate && (
        <div className="pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
            <Calendar size={14} className="text-accent-soft" />
            <span>
              {formatDate(s.assignedDate)} — {s.assignedTime} hs
              {s.durationMinutes && ` (${s.durationMinutes} min)`}
            </span>
          </div>
          {s.googleEventLink && (
            <a href={s.googleEventLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Calendar size={14} />
                Agregar a Google Calendar
              </Button>
            </a>
          )}
        </div>
      )}

      {s.status === "rejected" && s.rejectionReason && (
        <div className="pt-4 border-t border-neutral-800">
          <p className="text-sm text-gray-400">
            <span className="text-gray-500">Motivo: </span>
            {s.rejectionReason}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export function MisTurnosPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading } = useQuery<{ misSolicitudes: Solicitud[] }>(MIS_SOLICITUDES_QUERY);

  const solicitudes = data?.misSolicitudes ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Mis turnos</h1>
              <p className="text-sm text-gray-400">Hola, {user?.name?.split(" ")[0]}</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate("/solicitar")}>
            <Plus size={16} />
            Nuevo
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && solicitudes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-4 border border-neutral-800">
              <BookOpen size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-2 font-medium">Sin solicitudes aún</p>
            <p className="text-sm text-gray-600 mb-6">
              Solicitá tu primera clase y empezá a estudiar.
            </p>
            <Button onClick={() => navigate("/solicitar")}>Solicitar turno</Button>
          </div>
        )}

        {solicitudes.length > 0 && (
          <div className="flex flex-col gap-3">
            {solicitudes.map((s) => (
              <SolicitudCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
