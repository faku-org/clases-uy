export const siteConfig = {
  title: "Clases ORT",
  teacher: "Profesor Nicolas Stecar",
  since: 2003,
  tagline: "Clases particulares para estudiantes universitarios",
  specialization: "Especializado en alumnos de la ORT",

  pricing: {
    individual: {
      label: "Clase individual",
      duration: "90 minutos",
      price: 55,
      currency: "USD",
    },
    pack: {
      label: "Pack 4 clases",
      duration: "90 minutos c/u",
      price: 200,
      currency: "USD",
      badge: "Ahorro",
    },
    note: "Se abonan por adelantado mediante PayPal. Sin posibilidad de devolución ni cambio de horario.",
  },

  modality: {
    online: true,
    platform: "Google Meet",
    features: [
      "Clases individuales",
      "Pizarra virtual interactiva",
      "Atención personalizada",
    ],
  },

  contact: {
    instagram: "@clases.ort",
    instagramUrl: "https://instagram.com/clases.ort",
    schedule: "Lunes a sábado, 13 a 21 hs",
    email: "clasesort@ejemplo.com",
  },

  method: [
    {
      title: "Atención Personalizada",
      description:
        "Adaptación de los contenidos según lo que viste en tu cátedra.",
      icon: "UserCheck",
    },
    {
      title: "Teoría + Práctica",
      description:
        "Resolución de ejercicios y parciales combinados con explicaciones teóricas.",
      icon: "BookOpen",
    },
    {
      title: "Ambiente Distendido",
      description: "Clases con profesionalismo en un ambiente relajado.",
      icon: "Smile",
    },
    {
      title: "Objetivos a Medida",
      description:
        "Administrá tus objetivos y tiempos de estudio de manera óptima.",
      icon: "Target",
    },
  ],

  faculties: [
    {
      name: "Facultad de Ingeniería",
      subjects: [
        "Cálculo en una variable",
        "Cálculo en varias variables",
        "Cálculo vectorial",
        "Física 1",
        "Física 2",
        "Ecuaciones diferenciales",
        "Matemática discreta",
        "Química General",
        "Matemática 1",
        "Matemática 2",
        "Matemática 3",
        "Probabilidad y estadística",
      ],
    },
    {
      name: "Facultad de Administración y Ciencias Sociales",
      subjects: [
        "Matemática 1",
        "Matemática 2",
        "Probabilidad y estadística",
        "Principios de economía",
        "Métodos de economía matemática 1",
        "Métodos de economía matemática 2",
        "Microeconomía intermedia",
        "Principios de estadística",
        "Teoría de juegos",
      ],
    },
    {
      name: "Facultad de Arquitectura",
      subjects: ["Matemática 1", "Matemática 2"],
    },
  ],

  legal: {
    disclaimer:
      "No represento a la universidad ORT. Logo y nombre utilizados a modo ilustrativo.",
  },
} as const;
