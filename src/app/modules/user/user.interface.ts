import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  fistName: string;
  lastName: string;
  role: 'admin' | 'user' | 'service_provider' | 'employer';
  contact: string;
  email: string;
  type?: string;
  appId?: string;
  password: string;
  location: {
    type: string;
    coordinates: number[];
  };
  profile?: string;
  status: 'active' | 'delete';
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
