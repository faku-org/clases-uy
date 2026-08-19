import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { useAuth } from "../lib/auth";
import { UNIVERSITIES_QUERY, CREATE_SOLICITUD_MUTATION } from "../lib/graphql";

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

const MIN_HOURS = 1;
const MAX_HOURS = 40;

const DAYS = [
  { key: "L", label: "Lun" },
  { key: "M", label: "Mar" },
  { key: "X", label: "Mié" },
  { key: "J", label: "Jue" },
  { key: "V", label: "Vie" },
  { key: "S", label: "Sáb" },
];

const TIME_SLOTS = [
  { value: "morning", label: "Mañana (8 - 13 hs)" },
  { value: "afternoon", label: "Tarde (13 - 18 hs)" },
  { value: "evening", label: "Noche (18 - 21 hs)" },
];

type Faculty = { id: string; name: string; subjects: { id: string; name: string }[] };
type University = { id: string; name: string; shortName: string; faculties: Faculty[] };

type FormData = {
  universityId: string;
  facultyId: string;
  subjectId: string;
  difficulty: number;
  urgency: number;
  hoursPerWeek: number | "";
  difficultTopics: string;
  preferredDays: string[];
  preferredTimeSlot: string;
  examPrep: string;
};

function HoursInput({
  value,
  onChange,
}: {
  value: number | "";
  onChange: (v: number | "") => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="hours-per-week"
        className="text-sm font-medium text-gray-300"
      >
        ¿Cuántas horas por semana podés dedicarle?
      </label>
      <div className="relative">
        <input
          id="hours-per-week"
          type="number"
          inputMode="numeric"
          min={MIN_HOURS}
          max={MAX_HOURS}
          step={1}
          placeholder="Por ejemplo: 6"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? "" : Number(raw));
          }}
          className="w-full px-4 py-2.5 pr-16 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
          horas
        </span>
      </div>
      <p className="text-xs text-gray-500">
        Indicá un número entre {MIN_HOURS} y {MAX_HOURS}.
      </p>
    </div>
  );
}

const STEPS = ["Datos", "Dificultad", "Horarios", "Confirmar"];

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-300">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
              value === n
                ? "bg-accent text-white"
                : "bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-white border border-neutral-700"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SolicitudPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    universityId: "",
    facultyId: "",
    subjectId: "",
    difficulty: 3,
    urgency: 3,
    hoursPerWeek: "",
    difficultTopics: "",
    preferredDays: [],
    preferredTimeSlot: "",
    examPrep: "",
  });

  const { data: universitiesData } = useQuery<{ universities: University[] }>(UNIVERSITIES_QUERY);
  const [createSolicitud, { loading }] = useMutation(CREATE_SOLICITUD_MUTATION);

  const universities = universitiesData?.universities ?? [];
  const selectedUniversity = universities.find((u) => u.id === form.universityId);
  const faculties = selectedUniversity?.faculties ?? [];
  const selectedFaculty = faculties.find((f) => f.id === form.facultyId);
  const subjects = selectedFaculty?.subjects ?? [];

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDay = (day: string) => {
    set(
      "preferredDays",
      form.preferredDays.includes(day)
        ? form.preferredDays.filter((d) => d !== day)
        : [...form.preferredDays, day]
    );
  };

  const canProceed = () => {
    if (step === 0) return form.universityId && form.facultyId && form.subjectId;
    if (step === 1) {
      const hours = Number(form.hoursPerWeek);
      const validHours =
        form.hoursPerWeek !== "" &&
        Number.isInteger(hours) &&
        hours >= MIN_HOURS &&
        hours <= MAX_HOURS;
      return validHours && form.difficultTopics.trim().length > 0;
    }
    if (step === 2) return form.preferredDays.length > 0 && form.preferredTimeSlot;
    return true;
  };

  const handleSubmit = async () => {
    try {
      await createSolicitud({
        variables: {
          input: {
            subjectId: form.subjectId,
            difficulty: form.difficulty,
            urgency: form.urgency,
            hoursPerWeek: Number(form.hoursPerWeek),
            difficultTopics: form.difficultTopics,
            preferredDays: form.preferredDays.join(","),
            preferredTimeSlot: form.preferredTimeSlot,
            examPrep: form.examPrep,
          },
        },
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ...hermit }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-accent-soft" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Solicitud enviada</h2>
          <p className="text-gray-400 mb-8">
            El profesor Nicolas revisará tu solicitud y se pondrá en contacto a la brevedad.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/mis-turnos")}>
              Ver mis turnos
            </Button>
            <Button onClick={() => navigate("/")}>Volver al inicio</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Solicitar turno</h1>
            <p className="text-sm text-gray-400">
              Paso {step + 1} de {STEPS.length}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-1.5">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-accent" : "bg-neutral-800"
                }`}
              />
              <span className="text-[10px] text-gray-500 text-center">{s}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ...hermit }}
          >
            <div className="relative z-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-semibold text-white mb-1">Datos del alumno</h2>
                    <p className="text-sm text-gray-400">Confirmá tu información y elegí la materia</p>
                  </div>
                  <Input label="Nombre completo" value={user?.name ?? ""} disabled />
                  <Input label="Email" value={user?.email ?? ""} disabled />
                  <Select
                    label="Universidad"
                    placeholder="Seleccioná tu universidad"
                    value={form.universityId}
                    onChange={(universityId) => {
                      setForm((prev) => ({
                        ...prev,
                        universityId,
                        facultyId: "",
                        subjectId: "",
                      }));
                    }}
                    options={universities.map((u) => ({
                      value: u.id,
                      label: `${u.shortName} - ${u.name}`,
                    }))}
                  />
                  {form.universityId && (
                    <Select
                      label="Facultad"
                      placeholder="Seleccioná tu facultad"
                      value={form.facultyId}
                      onChange={(facultyId) => {
                        setForm((prev) => ({
                          ...prev,
                          facultyId,
                          subjectId: "",
                        }));
                      }}
                      options={faculties.map((f) => ({ value: f.id, label: f.name }))}
                    />
                  )}
                  {form.facultyId && (
                    <Select
                      label="Materia"
                      placeholder="Seleccioná la materia"
                      value={form.subjectId}
                      onChange={(subjectId) => set("subjectId", subjectId)}
                      options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                    />
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-semibold text-white mb-1">Evaluación</h2>
                    <p className="text-sm text-gray-400">Contanos cómo estás con la materia</p>
                  </div>
                  <RatingInput
                    label="¿Qué tanto te cuesta la materia?"
                    value={form.difficulty}
                    onChange={(v) => set("difficulty", v)}
                  />
                  <RatingInput
                    label="¿Qué tan urgente es el apoyo?"
                    value={form.urgency}
                    onChange={(v) => set("urgency", v)}
                  />
                  <HoursInput
                    value={form.hoursPerWeek}
                    onChange={(v) => set("hoursPerWeek", v)}
                  />
                  <Textarea
                    label="¿Qué temas te resultan más difíciles?"
                    placeholder="Contanos en detalle qué temas necesitás reforzar..."
                    rows={4}
                    value={form.difficultTopics}
                    onChange={(e) => set("difficultTopics", e.target.value)}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-semibold text-white mb-1">Preferencias de horario</h2>
                    <p className="text-sm text-gray-400">¿Cuándo preferís tener las clases?</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-300">Días preferidos</p>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map((d) => (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => toggleDay(d.key)}
                          className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                            form.preferredDays.includes(d.key)
                              ? "bg-accent text-white"
                              : "bg-neutral-800 text-gray-400 border border-neutral-700 hover:text-white"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Select
                    label="Franja horaria preferida"
                    placeholder="Seleccioná una franja"
                    value={form.preferredTimeSlot}
                    onChange={(slot) => set("preferredTimeSlot", slot)}
                    options={TIME_SLOTS}
                  />

                  <Textarea
                    label="¿Tenés parcial o examen próximo?"
                    placeholder="Descripción del examen, fecha aproximada, contenidos..."
                    rows={3}
                    value={form.examPrep}
                    onChange={(e) => set("examPrep", e.target.value)}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-semibold text-white mb-1">Resumen</h2>
                    <p className="text-sm text-gray-400">Revisá tu solicitud antes de enviarla</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Alumno", value: user?.name },
                      { label: "Email", value: user?.email },
                      {
                        label: "Universidad",
                        value: selectedUniversity?.name,
                      },
                      {
                        label: "Facultad",
                        value: selectedFaculty?.name,
                      },
                      {
                        label: "Materia",
                        value: subjects.find((s) => s.id === form.subjectId)?.name,
                      },
                      {
                        label: "Dificultad",
                        value: `${form.difficulty}/5`,
                      },
                      { label: "Urgencia", value: `${form.urgency}/5` },
                      {
                        label: "Hs/semana",
                        value: `${form.hoursPerWeek} horas`,
                      },
                      {
                        label: "Temas difíciles",
                        value: form.difficultTopics,
                      },
                      {
                        label: "Días",
                        value: form.preferredDays.join(", "),
                      },
                      {
                        label: "Franja",
                        value:
                          TIME_SLOTS.find((t) => t.value === form.preferredTimeSlot)?.label ?? "",
                      },
                      form.examPrep
                        ? { label: "Examen", value: form.examPrep }
                        : null,
                    ]
                      .filter(Boolean)
                      .map((row) => (
                        <div
                          key={row!.label}
                          className="flex gap-3 text-sm"
                        >
                          <span className="text-gray-500 shrink-0 w-24">{row!.label}</span>
                          <span className="text-gray-200 break-words">{row!.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-0 flex gap-3 mt-4">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Atrás
                </Button>
              )}
              {step < 3 ? (
                <Button
                  className="flex-1"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Continuar
                </Button>
              ) : (
                <Button className="flex-1" loading={loading} onClick={handleSubmit}>
                  Enviar solicitud
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
