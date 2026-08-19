import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { motion } from "motion/react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  BarChart3,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import {
  DASHBOARD_QUERY,
  SOLICITUDES_QUERY,
  APPROVE_SOLICITUD_MUTATION,
  REJECT_SOLICITUD_MUTATION,
} from "../lib/graphql";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

type Solicitud = {
  id: string;
  user: { name: string; email: string };
  subject: { name: string; faculty: { name: string } };
  difficulty: number;
  urgency: number;
  hoursPerWeek: number;
  difficultTopics: string;
  preferredDays: string;
  preferredTimeSlot: string;
  examPrep: string;
  status: string;
  rejectionReason: string | null;
  assignedDate: string | null;
  assignedTime: string | null;
  durationMinutes: number | null;
  createdAt: string;
};

type DashboardData = {
  pendingCount: number;
  approvedTodayCount: number;
  totalStudents: number;
  recentSolicitudes: { id: string; user: { name: string }; subject: { name: string }; status: string; createdAt: string }[];
};

const SLOT_LABELS: Record<string, string> = {
  morning: "Mañana",
  afternoon: "Tarde",
  evening: "Noche",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-[#ffd966] bg-[#ffd966]/10",
  approved: "text-green-400 bg-green-400/10",
  rejected: "text-red-400 bg-red-400/10",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

function ApproveModal({
  solicitudId,
  onClose,
  onDone,
}: {
  solicitudId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({ date: "", time: "", duration: "90" });
  const [approveSolicitud, { loading }] = useMutation(APPROVE_SOLICITUD_MUTATION, {
    refetchQueries: [{ query: DASHBOARD_QUERY }, { query: SOLICITUDES_QUERY }],
  });

  const handleApprove = async () => {
    await approveSolicitud({
      variables: {
        id: solicitudId,
        input: {
          assignedDate: form.date,
          assignedTime: form.time,
          durationMinutes: parseInt(form.duration, 10),
        },
      },
    });
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ...hermit }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Aprobar solicitud</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            label="Fecha"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            label="Hora"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
          <Input
            label="Duración (minutos)"
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              className="flex-1"
              loading={loading}
              disabled={!form.date || !form.time}
              onClick={handleApprove}
            >
              <Check size={16} />
              Confirmar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function RejectModal({
  solicitudId,
  onClose,
  onDone,
}: {
  solicitudId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState("");
  const [rejectSolicitud, { loading }] = useMutation(REJECT_SOLICITUD_MUTATION, {
    refetchQueries: [{ query: DASHBOARD_QUERY }, { query: SOLICITUDES_QUERY }],
  });

  const handleReject = async () => {
    await rejectSolicitud({ variables: { id: solicitudId, reason } });
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ...hermit }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Rechazar solicitud</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Textarea
            label="Motivo del rechazo (opcional)"
            placeholder="Explicá brevemente el motivo..."
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              className="flex-1 !bg-red-600 hover:!bg-red-700"
              loading={loading}
              onClick={handleReject}
            >
              <XCircle size={16} />
              Rechazar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SolicitudDetail({
  s,
  onClose,
  onRefetch,
}: {
  s: Solicitud;
  onClose: () => void;
  onRefetch: () => void;
}) {
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);

  const handleDone = () => {
    setModal(null);
    onRefetch();
    onClose();
  };

  return (
    <>
      {modal === "approve" && (
        <ApproveModal solicitudId={s.id} onClose={() => setModal(null)} onDone={handleDone} />
      )}
      {modal === "reject" && (
        <RejectModal solicitudId={s.id} onClose={() => setModal(null)} onDone={handleDone} />
      )}

      <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ...hermit }}
          className="w-full max-w-md h-full bg-neutral-950 border-l border-neutral-800 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Detalle de solicitud</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                  Alumno
                </p>
                <p className="font-medium text-white">{s.user.name}</p>
                <p className="text-sm text-gray-400">{s.user.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                  Materia
                </p>
                <p className="font-medium text-white">{s.subject.name}</p>
                <p className="text-sm text-gray-400">{s.subject.faculty.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">
                  Evaluación
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dificultad</span>
                    <span className="text-white font-medium">{s.difficulty}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Urgencia</span>
                    <span className="text-white font-medium">{s.urgency}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hs/semana</span>
                    <span className="text-white font-medium">{s.hoursPerWeek}h</span>
                  </div>
                </div>
                {s.difficultTopics && (
                  <p className="text-sm text-gray-300 mt-3 pt-3 border-t border-neutral-800">
                    {s.difficultTopics}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                  Horario
                </p>
                <p className="text-sm text-white">
                  Días: {s.preferredDays || "—"}
                </p>
                <p className="text-sm text-gray-400">
                  Franja: {SLOT_LABELS[s.preferredTimeSlot] ?? s.preferredTimeSlot}
                </p>
                {s.examPrep && (
                  <p className="text-sm text-gray-400 mt-2">{s.examPrep}</p>
                )}
              </div>

              {s.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 !border-red-500/30 !text-red-400 hover:!border-red-500"
                    onClick={() => setModal("reject")}
                  >
                    <XCircle size={16} />
                    Rechazar
                  </Button>
                  <Button className="flex-1" onClick={() => setModal("approve")}>
                    <CheckCircle2 size={16} />
                    Aprobar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: dashData } = useQuery<{ dashboard: DashboardData }>(DASHBOARD_QUERY);
  const {
    data: solicitudesData,
    refetch,
  } = useQuery<{ solicitudes: Solicitud[] }>(SOLICITUDES_QUERY, {
    variables: { status: statusFilter || null },
  });

  const dashboard = dashData?.dashboard;
  const solicitudes = solicitudesData?.solicitudes ?? [];

  const statCards = [
    { label: "Pendientes", value: dashboard?.pendingCount ?? "—", icon: Clock, color: "text-[#ffd966]" },
    { label: "Aprobadas hoy", value: dashboard?.approvedTodayCount ?? "—", icon: CheckCircle2, color: "text-green-400" },
    { label: "Total alumnos", value: dashboard?.totalStudents ?? "—", icon: Users, color: "text-[#e06666]" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {selectedSolicitud && (
        <SolicitudDetail
          s={selectedSolicitud}
          onClose={() => setSelectedSolicitud(null)}
          onRefetch={refetch}
        />
      )}

      {/* Top bar */}
      <header className="border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-[#e06666]" />
          <span className="font-semibold text-white">Panel Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{user?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            Salir
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statCards.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ...hermit }}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <s.icon size={16} className={s.color} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5">
          {[
            { value: "pending", label: "Pendientes" },
            { value: "approved", label: "Aprobadas" },
            { value: "rejected", label: "Rechazadas" },
            { value: "", label: "Todas" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                statusFilter === f.value
                  ? "bg-[#e06666] text-white"
                  : "bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          {solicitudes.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              No hay solicitudes con este filtro
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Alumno
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Materia
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Fecha
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {solicitudes.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSolicitud(s)}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{s.user.name}</p>
                      <p className="text-xs text-gray-500">{s.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-200">{s.subject.name}</p>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {s.subject.faculty.name.replace("Facultad de ", "")}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="text-sm text-gray-400">
                        {new Intl.DateTimeFormat("es-UY", {
                          day: "numeric",
                          month: "short",
                        }).format(new Date(s.createdAt))}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status]}`}
                      >
                        {STATUS_LABELS[s.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ChevronRight size={16} className="text-gray-600 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
