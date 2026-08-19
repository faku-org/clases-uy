export const typeDefs = /* GraphQL */ `
  type Query {
    me: User
    solicitudes(status: String): [Solicitud!]!
    misSolicitudes: [Solicitud!]!
    solicitud(id: ID!): Solicitud
    dashboard: DashboardData!
    faculties: [Faculty!]!
    subjects(facultyId: ID): [Subject!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    createSolicitud(input: SolicitudInput!): Solicitud!
    approveSolicitud(id: ID!, input: ApproveInput!): Solicitud!
    rejectSolicitud(id: ID!, reason: String): Solicitud!
    sendContactMessage(input: ContactoInput!): Boolean!
  }

  type AuthPayload {
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Solicitud {
    id: ID!
    user: User!
    subject: Subject!
    difficulty: Int!
    urgency: Int!
    hoursPerWeek: Int!
    difficultTopics: String
    preferredDays: String
    preferredTimeSlot: String
    examPrep: String
    status: String!
    rejectionReason: String
    assignedDate: String
    assignedTime: String
    durationMinutes: Int
    googleEventLink: String
    createdAt: String!
  }

  type DashboardData {
    pendingCount: Int!
    approvedTodayCount: Int!
    totalStudents: Int!
    recentSolicitudes: [Solicitud!]!
  }

  type Faculty {
    id: ID!
    name: String!
    subjects: [Subject!]!
  }

  type Subject {
    id: ID!
    name: String!
    faculty: Faculty!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input SolicitudInput {
    subjectId: ID!
    difficulty: Int!
    urgency: Int!
    hoursPerWeek: Int!
    difficultTopics: String
    preferredDays: String
    preferredTimeSlot: String
    examPrep: String
  }

  input ApproveInput {
    assignedDate: String!
    assignedTime: String!
    durationMinutes: Int!
  }

  input ContactoInput {
    name: String!
    email: String!
    subject: String!
    message: String!
  }
`;
