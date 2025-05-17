const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
    articles: [Article!]
  }

  type Article {
    id: ID!
    title: String!
    description: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # User queries
    me: User
    users: [User!]!
    user(id: ID!): User
    
    # Article queries
    articles(offset: Int, limit: Int): [Article!]!
    article(id: ID!): Article
    userArticles(userId: ID!, offset: Int, limit: Int): [Article!]!
  }

  type Mutation {
    # User mutations
    registerUser(username: String!, email: String!, password: String!, role: String): AuthPayload!
    loginUser(email: String!, password: String!): AuthPayload!
    deleteUser(id: ID!): Boolean!
    
    # Article mutations
    createArticle(title: String!, description: String!): Article!
    updateArticle(id: ID!, title: String, description: String): Article!
    deleteArticle(id: ID!): Boolean!
  }
`;

export default typeDefs; 