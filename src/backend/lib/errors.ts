import { GraphQLError } from "graphql";

/**
 * GraphQL Yoga masks every thrown Error as "Unexpected error." by default.
 * Errors created here are GraphQLErrors, so their message reaches the client
 * intact while genuine internal failures stay masked.
 */
function userError(message: string, code: string): GraphQLError {
  return new GraphQLError(message, { extensions: { code } });
}

export const badInput = (message: string) => userError(message, "BAD_USER_INPUT");
export const unauthenticated = (message: string) => userError(message, "UNAUTHENTICATED");
export const forbidden = (message: string) => userError(message, "FORBIDDEN");
export const notFound = (message: string) => userError(message, "NOT_FOUND");
