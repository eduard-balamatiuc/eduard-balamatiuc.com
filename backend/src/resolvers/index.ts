import userResolvers from './userResolvers';
import articleResolvers from './articleResolvers';

// Merge resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...articleResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...articleResolvers.Mutation
  },
  User: userResolvers.User,
  Article: articleResolvers.Article
};

export default resolvers; 