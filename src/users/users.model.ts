import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  registeredAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true,
  },
});

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  try {
    this['updatedAt'] = new Date();
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    console.error(err);
  }
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
  registeredAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  enabled: boolean;
}

export interface UpdateUser extends User {
  newPassword: string;
}

export class UserDTO {
  name: string;
  email: string;
  enabled: boolean;
}
