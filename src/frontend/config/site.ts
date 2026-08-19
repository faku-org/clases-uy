export const siteConfig = {
  title: "ClasesUY",
  teacher: "Profesor Nicolas Stecar",
  since: 2003,
  tagline: "Clases particulares para estudiantes universitarios",
  specialization: "Para todas las universidades del Uruguay",

  /** Se muestran como chips en el hero. El detalle vive en la base de datos. */
  universities: [
    { short: "ORT", name: "Universidad ORT Uruguay" },
    { short: "UM", name: "Universidad de Montevideo" },
    { short: "UCU", name: "Universidad Católica del Uruguay" },
    { short: "UdelaR", name: "Universidad de la República" },
    { short: "UDE", name: "Universidad de la Empresa" },
  ],

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
    instagram: "@UYclases",
    instagramUrl: "https://instagram.com/UYclases",
    schedule: "Lunes a sábado, 13 a 21 hs",
    email: "uyclases@gmail.com",

    /**
     * Número de WhatsApp en formato internacional, sólo dígitos
     * (código de país + número, sin +, espacios ni guiones).
     * Ejemplo Uruguay: "59899123456".
     * Si queda vacío, el botón de WhatsApp no se muestra.
     */
    whatsapp: "",
    whatsappMessage: "Hola! Te escribo desde ClasesUY, quería consultar por clases particulares.",
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


  legal: {
    disclaimer:
      "ClasesUY es un servicio independiente. No representa a ninguna de las universidades mencionadas; sus nombres se usan sólo a modo de referencia.",
  },
} as const;
