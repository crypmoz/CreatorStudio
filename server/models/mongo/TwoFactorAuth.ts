import mongoose, { Document, Schema } from 'mongoose';

export interface ITwoFactorAuth extends Document {
  userId: mongoose.Types.ObjectId;
  secret: string;
  backupCodes: string[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const twoFactorAuthSchema = new Schema<ITwoFactorAuth>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true 
    },
    secret: { 
      type: String, 
      required: true 
    },
    backupCodes: [{ 
      type: String 
    }],
    verified: { 
      type: Boolean, 
      default: false 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

// Pre-save middleware to update the updatedAt field
twoFactorAuthSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Creating and exporting the TwoFactorAuth model
export const TwoFactorAuth = mongoose.model<ITwoFactorAuth>('TwoFactorAuth', twoFactorAuthSchema);