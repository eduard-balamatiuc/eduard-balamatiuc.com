import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'ADMIN',
  UTILIZATOR = 'UTILIZATOR'
}

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.UTILIZATOR
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 