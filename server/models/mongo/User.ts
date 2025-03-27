import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '@shared/schema';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string | null;
  profileImageUrl: string | null;
  role: 'user' | 'creator' | 'admin';
  provider: 'email' | 'google' | 'twitter' | 'tiktok';
  providerId: string | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  tiktokHandle: string | null;
  country: string | null;
  dateOfBirth: Date | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  accountLocked: boolean;
  failedLoginAttempts: number;
  lastFailedLogin: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    contentLanguages: string[];
    timezone: string;
  };
  socialProfiles: {
    instagram: string | null;
    youtube: string | null;
    twitter: string | null;
    facebook: string | null;
  };
  contentCreatorInfo: {
    niche: string | null;
    targetAudience: string | null;
    contentTypes: string[];
    monetizationMethods: string[];
    brandDeals: boolean;
  };
}

const userSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: { 
    type: String, 
    default: null,
    maxlength: 500
  },
  profileImageUrl: { 
    type: String, 
    default: null 
  },
  role: { 
    type: String, 
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  provider: { 
    type: String, 
    enum: ['email', 'google', 'twitter', 'tiktok'],
    default: 'email'
  },
  providerId: { 
    type: String, 
    default: null 
  },
  twoFactorEnabled: { 
    type: Boolean, 
    default: false 
  },
  twoFactorSecret: { 
    type: String, 
    default: null 
  },
  tiktokHandle: { 
    type: String, 
    default: null 
  },
  country: { 
    type: String, 
    default: null 
  },
  dateOfBirth: { 
    type: Date, 
    default: null 
  },
  phoneNumber: { 
    type: String, 
    default: null 
  },
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  emailVerificationToken: { 
    type: String, 
    default: null 
  },
  passwordResetToken: { 
    type: String, 
    default: null 
  },
  passwordResetExpires: { 
    type: Date, 
    default: null 
  },
  accountLocked: { 
    type: Boolean, 
    default: false 
  },
  failedLoginAttempts: { 
    type: Number, 
    default: 0 
  },
  lastFailedLogin: { 
    type: Date, 
    default: null 
  },
  lastLoginAt: { 
    type: Date, 
    default: null 
  },
  lastLoginIp: { 
    type: String, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  preferences: {
    theme: { 
      type: String, 
      default: 'light' 
    },
    notifications: {
      email: { 
        type: Boolean, 
        default: true 
      },
      push: { 
        type: Boolean, 
        default: true 
      },
      sms: { 
        type: Boolean, 
        default: false 
      }
    },
    contentLanguages: { 
      type: [String], 
      default: ['en'] 
    },
    timezone: { 
      type: String, 
      default: 'UTC' 
    }
  },
  socialProfiles: {
    instagram: { 
      type: String, 
      default: null 
    },
    youtube: { 
      type: String, 
      default: null 
    },
    twitter: { 
      type: String, 
      default: null 
    },
    facebook: { 
      type: String, 
      default: null 
    }
  },
  contentCreatorInfo: {
    niche: { 
      type: String, 
      default: null 
    },
    targetAudience: { 
      type: String, 
      default: null 
    },
    contentTypes: { 
      type: [String], 
      default: [] 
    },
    monetizationMethods: { 
      type: [String], 
      default: [] 
    },
    brandDeals: { 
      type: Boolean, 
      default: false 
    }
  }
}, { 
  timestamps: { 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt' 
  } 
});

// Creating and exporting the User model
export const User = mongoose.model<IUser>('User', userSchema);

// Utility function to convert MongoDB user to our app's User type
export const convertToUserType = (mongoUser: IUser): UserType => {
  // Safely convert MongoDB ObjectId to a number ID
  const idString = mongoUser._id ? mongoUser._id.toString() : '';
  const convertedId = idString ? parseInt(idString.substring(0, 8), 16) : 0;
  
  // Cast to UserType to satisfy TypeScript
  const userObj: UserType = {
    id: convertedId,
    username: mongoUser.username,
    password: mongoUser.password, // Note: This should be handled securely in a real app
    email: mongoUser.email,
    displayName: mongoUser.displayName,
    bio: mongoUser.bio || null,
    profileImageUrl: mongoUser.profileImageUrl || null,
    role: mongoUser.role,
    provider: mongoUser.provider,
    providerId: mongoUser.providerId || null,
    twoFactorEnabled: mongoUser.twoFactorEnabled,
    twoFactorSecret: mongoUser.twoFactorSecret || null,
    tiktokHandle: mongoUser.tiktokHandle || null,
    country: mongoUser.country || null,
    dateOfBirth: mongoUser.dateOfBirth || null,
    phoneNumber: mongoUser.phoneNumber || null,
    emailVerified: mongoUser.emailVerified,
    createdAt: mongoUser.createdAt,
    updatedAt: mongoUser.updatedAt,
    lastLoginAt: mongoUser.lastLoginAt || null,
    preferences: mongoUser.preferences as any,
    socialProfiles: mongoUser.socialProfiles as any,
    contentCreatorInfo: mongoUser.contentCreatorInfo as any
  } as unknown as UserType;
  
  return userObj;
};