import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

export const UNIVERSITIES_QUERY = gql`
  query Universities {
    universities {
      id
      name
      shortName
      faculties {
        id
        name
        subjects {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_SOLICITUD_MUTATION = gql`
  mutation CreateSolicitud($input: SolicitudInput!) {
    createSolicitud(input: $input) {
      id
      status
      createdAt
    }
  }
`;

export const MIS_SOLICITUDES_QUERY = gql`
  query MisSolicitudes {
    misSolicitudes {
      id
      subject {
        id
        name
        faculty {
          id
          name
        }
      }
      difficulty
      urgency
      hoursPerWeek
      difficultTopics
      preferredDays
      preferredTimeSlot
      examPrep
      status
      rejectionReason
      assignedDate
      assignedTime
      durationMinutes
      googleEventLink
      createdAt
    }
  }
`;

export const SOLICITUDES_QUERY = gql`
  query Solicitudes($status: String) {
    solicitudes(status: $status) {
      id
      user {
        id
        name
        email
      }
      subject {
        id
        name
        faculty {
          id
          name
        }
      }
      difficulty
      urgency
      hoursPerWeek
      difficultTopics
      preferredDays
      preferredTimeSlot
      examPrep
      status
      rejectionReason
      assignedDate
      assignedTime
      durationMinutes
      createdAt
    }
  }
`;

export const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboard {
      pendingCount
      approvedTodayCount
      totalStudents
      recentSolicitudes {
        id
        user {
          name
        }
        subject {
          name
        }
        status
        createdAt
      }
    }
  }
`;

export const APPROVE_SOLICITUD_MUTATION = gql`
  mutation ApproveSolicitud($id: ID!, $input: ApproveInput!) {
    approveSolicitud(id: $id, input: $input) {
      id
      status
      assignedDate
      assignedTime
      durationMinutes
      googleEventLink
    }
  }
`;

export const REJECT_SOLICITUD_MUTATION = gql`
  mutation RejectSolicitud($id: ID!, $reason: String) {
    rejectSolicitud(id: $id, reason: $reason) {
      id
      status
      rejectionReason
    }
  }
`;
