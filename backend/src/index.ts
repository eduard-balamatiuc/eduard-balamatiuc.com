import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import schema and resolvers
import typeDefs from './schema/typeDefs';
import resolvers from './resolvers';

// Import database connection
import connectDB from './utils/db';

// Import context creator
import { Context } from './middleware/auth';
import { getUserFromToken } from './utils/auth';

// Configure environment variables
dotenv.config();

// Set port from environment variable or use default
const PORT = process.env.PORT || 4000;

async function startServer() {
  // Create Express app
  const app = express();
  
  // Create HTTP server
  const httpServer = http.createServer(app);
  
  // Create Apollo server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start Apollo server
  await server.start();
  
  // Connect to database
  await connectDB();
  
  // Configure middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware<Context>(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token);
        return { user };
      }
    }),
  );

  // Create token endpoint
  app.post('/token', express.json(), (req, res) => {
    const { role } = req.body;
    
    // Create a simple token for testing
    const token = `test-token-${role || 'UTILIZATOR'}-${Date.now()}`;
    
    res.json({ token });
  });
  
  // Start server
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

// Handle errors
startServer().catch((err) => {
  console.error('Error starting server:', err);
}); 