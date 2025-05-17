import { GraphQLError } from 'graphql';
import Article, { IArticle } from '../models/Article';
import User from '../models/User';
import { Context, requireAuth, requireAdmin } from '../middleware/auth';

export default {
  Article: {
    // Resolver for Article.author field
    author: async (parent: IArticle) => {
      return await User.findById(parent.author);
    }
  },

  Query: {
    // Get all articles with pagination
    articles: async (_: any, args: { offset?: number; limit?: number }) => {
      const { offset = 0, limit = 10 } = args;
      return await Article.find({})
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    },

    // Get article by ID
    article: async (_: any, { id }: { id: string }) => {
      return await Article.findById(id);
    },

    // Get articles by user ID with pagination
    userArticles: async (_: any, args: { userId: string; offset?: number; limit?: number }) => {
      const { userId, offset = 0, limit = 10 } = args;
      return await Article.find({ author: userId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    }
  },

  Mutation: {
    // Create new article (authenticated users only)
    createArticle: async (_: any, { title, description }: { title: string; description: string }, context: Context) => {
      const user = requireAuth(context);

      const newArticle = await Article.create({
        title,
        description,
        author: user.userId
      });

      return newArticle;
    },

    // Update article (owner only)
    updateArticle: async (
      _: any,
      { id, title, description }: { id: string; title?: string; description?: string },
      context: Context
    ) => {
      const user = requireAuth(context);

      // Find article
      const article = await Article.findById(id);
      if (!article) {
        throw new GraphQLError('Article not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Check if user is the author or admin
      if (article.author.toString() !== user.userId && user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized to update this article', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      // Update article fields if provided
      if (title) article.title = title;
      if (description) article.description = description;

      await article.save();
      return article;
    },

    // Delete article (owner or admin only)
    deleteArticle: async (_: any, { id }: { id: string }, context: Context) => {
      const user = requireAuth(context);

      // Find article
      const article = await Article.findById(id);
      if (!article) {
        throw new GraphQLError('Article not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Check if user is the author or admin
      if (article.author.toString() !== user.userId && user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized to delete this article', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      // Delete article
      await Article.findByIdAndDelete(id);
      return true;
    }
  }
}; 