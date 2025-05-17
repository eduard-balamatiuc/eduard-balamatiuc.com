import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1m';

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    userId: user._id ? user._id.toString() : '',
    role: user.role as UserRole
  };

  // @ts-ignore - Ignoring type checking for jwt.sign
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    // @ts-ignore - Ignoring type checking for jwt.verify
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const getUserFromToken = (token: string): TokenPayload | null => {
  try {
    if (!token) return null;
    // Remove "Bearer " if present
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
    return verifyToken(tokenWithoutBearer);
  } catch (error) {
    return null;
  }
}; 