/**
 * Catálogo de universidades, facultades y materias.
 * Fuente: https://sites.google.com/view/uyclases
 *
 * Los `id` son estables y se usan como clave de upsert: no los cambies una vez
 * que hay solicitudes apuntando a esas facultades.
 */
export type SeedFaculty = {
  id: string;
  name: string;
  slug: string;
  subjects: string[];
};

export type SeedUniversity = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  faculties: SeedFaculty[];
};

export const SEED_UNIVERSITIES: SeedUniversity[] = [
  {
    id: "uni-ort",
    name: "Universidad ORT Uruguay",
    shortName: "ORT",
    slug: "ort",
    faculties: [
      {
        id: "fac-ingenieria",
        name: "Facultad de Ingeniería",
        slug: "ingenieria",
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
        id: "fac-adm",
        name: "Facultad de Administración y Ciencias Sociales",
        slug: "administracion",
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
        id: "fac-arq",
        name: "Facultad de Arquitectura",
        slug: "arquitectura",
        subjects: ["Matemática 1", "Matemática 2"],
      },
    ],
  },
  {
    id: "uni-um",
    name: "Universidad de Montevideo",
    shortName: "UM",
    slug: "um",
    faculties: [
      {
        id: "fac-um-ingenieria",
        name: "Facultad de Ingeniería",
        slug: "um-ingenieria",
        subjects: [
          "Geometría y álgebra lineal 1",
          "Geometría y álgebra lineal 2",
          "Análisis matemático 1",
          "Análisis matemático 2",
          "Análisis matemático 3",
          "Física 1",
          "Física 2",
          "Cálculo numérico",
          "Matemática discreta",
          "Probabilidad y estadística",
          "Lógica",
          "Economía",
          "Fundamentos químicos de la ingeniería",
        ],
      },
      {
        id: "fac-um-empresariales",
        name: "Facultad de Ciencias Empresariales y Economía",
        slug: "um-empresariales",
        subjects: [
          "Matemática 1",
          "Matemática 2",
          "Estadística 1",
          "Probabilidad",
          "Introducción a la economía",
        ],
      },
    ],
  },
  {
    id: "uni-ucu",
    name: "Universidad Católica del Uruguay",
    shortName: "UCU",
    slug: "ucu",
    faculties: [
      {
        id: "fac-ucu-general",
        name: "Materias generales",
        slug: "ucu-general",
        subjects: [
          "Matemática 1",
          "Matemática 2",
          "Microeconomía",
          "Estadística aplicada",
          "Estadística 1",
          "Estadística 2",
          "Matemática discreta 1",
          "Matemática discreta 2",
          "Probabilidad y estadística aplicada",
          "Fundamentos matemáticos",
          "Métodos matemáticos",
          "Álgebra lineal",
          "Cálculo",
          "Cálculo multivariable",
          "Ecuaciones diferenciales",
          "Estadística inferencial",
          "Electricidad y magnetismo",
          "Electromagnetismo",
          "Química general",
          "Mecánica clásica",
        ],
      },
    ],
  },
  {
    id: "uni-udelar",
    name: "Universidad de la República",
    shortName: "UdelaR",
    slug: "udelar",
    faculties: [
      {
        id: "fac-udelar-ingenieria",
        name: "Facultad de Ingeniería, Agronomía y Química",
        slug: "udelar-ingenieria",
        subjects: [
          "Cálculo 1",
          "Cálculo 2",
          "Cálculo 3",
          "Geometría y álgebra lineal 1",
          "Geometría y álgebra lineal 2",
          "Matemática discreta y estructuras algebraicas",
          "Probabilidad y estadística",
          "Lógica",
          "Ecuaciones diferenciales",
          "Ecuaciones diferenciales y series de Fourier",
          "Funciones de variable compleja",
          "Cálculo lambda",
          "Álgebra abstracta",
          "Cálculo numérico",
          "Métodos numéricos",
          "Física general 1",
          "Física general 2",
          "Mecánica 1",
          "Mecánica 2",
          "Termodinámica",
          "Electromagnetismo",
          "Química general",
        ],
      },
      {
        id: "fac-udelar-economicas",
        name: "Facultad de Ciencias Económicas y Administración",
        slug: "udelar-economicas",
        subjects: [
          "Cálculo",
          "Cálculo 2",
          "Estadística 1",
          "Álgebra",
          "Introducción a la economía",
          "Teoría de la probabilidad",
          "Microeconomía",
        ],
      },
    ],
  },
  {
    id: "uni-ude",
    name: "Universidad de la Empresa",
    shortName: "UDE",
    slug: "ude",
    faculties: [
      {
        id: "fac-ude-ingenieria",
        name: "Facultad de Ingeniería",
        slug: "ude-ingenieria",
        subjects: [
          "Cálculo numérico",
          "Introducción a la estadística",
          "Matemática discreta 1",
          "Matemática discreta 2",
          "Álgebra lineal",
          "Análisis matemático 1",
          "Análisis matemático 2",
          "Física",
          "Química",
        ],
      },
      {
        id: "fac-ude-empresariales",
        name: "Facultad de Ciencias Empresariales",
        slug: "ude-empresariales",
        subjects: [
          "Matemática 1",
          "Matemática 2",
          "Estadística 1",
          "Microeconomía",
          "Fundamentos de economía",
          "Inglés básico 1",
          "Inglés básico 2",
          "Inglés básico 3",
          "Inglés intermedio",
          "Inglés avanzado",
        ],
      },
      {
        id: "fac-ude-agrarias",
        name: "Facultad de Ciencias Agrarias",
        slug: "ude-agrarias",
        subjects: [
          "Matemática 1",
          "Matemática 2",
          "Química 1",
          "Química 2",
          "Física",
          "Estadística",
          "Teoría económica",
          "Matemática aplicada al agro",
          "Inglés técnico 1",
          "Inglés técnico 2",
        ],
      },
    ],
  },
];
