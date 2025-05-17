import { GraphQLError } from 'graphql';
import User, { UserRole, IUser } from '../models/User';
import Article from '../models/Article';
import { generateToken } from '../utils/auth';
import { Context, requireAuth, requireAdmin } from '../middleware/auth';

export default {
  User: {
    // Resolver for User.articles field
    articles: async (parent: IUser) => {
      return await Article.find({ author: parent._id });
    }
  },

  Query: {
    // Get current user
    me: async (_: any, __: any, context: Context) => {
      const user = requireAuth(context);
      return await User.findById(user.userId);
    },

    // Get all users (admin only)
    users: async (_: any, __: any, context: Context) => {
      requireAdmin(context);
      return await User.find({});
    },

    // Get user by ID (admin only)
    user: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context);
      return await User.findById(id);
    }
  },

  Mutation: {
    // Register a new user
    registerUser: async (_: any, args: { username: string; email: string; password: string; role?: string }) => {
      const { username, email, password, role } = args;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new GraphQLError('User already exists with that email or username', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        role: role as UserRole || UserRole.UTILIZATOR
      });

      // Generate token
      const token = generateToken(user);

      return { token, user };
    },

    // Login user
    loginUser: async (_: any, { email, password }: { email: string; password: string }) => {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Generate token
      const token = generateToken(user);

      return { token, user };
    },

    // Delete user (admin only)
    deleteUser: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context);

      // Find and delete user
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Delete all articles by the user
      await Article.deleteMany({ author: id });

      return true;
    }
  }
}; 