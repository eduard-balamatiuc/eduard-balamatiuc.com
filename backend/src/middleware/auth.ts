import { GraphQLError } from 'graphql';
import { getUserFromToken, TokenPayload } from '../utils/auth';
import { UserRole } from '../models/User';

export interface Context {
  user: TokenPayload | null;
}

export const createContext = async ({ req }: { req: any }): Promise<Context> => {
  // Get the user token from the headers
  const token = req.headers.authorization || '';
  // Try to retrieve a user with the token
  const user = getUserFromToken(token);
  // Add the user to the context
  return { user };
};

export const requireAuth = (context: Context): TokenPayload => {
  if (!context.user) {
    throw new GraphQLError('Not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
  return context.user;
};

export const requireAdmin = (context: Context): TokenPayload => {
  const user = requireAuth(context);
  
  if (user.role !== UserRole.ADMIN) {
    throw new GraphQLError('Not authorized. Admin role required.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  
  return user;
}; 