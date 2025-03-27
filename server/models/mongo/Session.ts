import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    token: { 
      type: String, 
      required: true, 
      unique: true 
    },
    ipAddress: { 
      type: String, 
      required: true 
    },
    userAgent: { 
      type: String, 
      required: true 
    },
    isValid: { 
      type: Boolean, 
      default: true 
    },
    expiresAt: { 
      type: Date, 
      required: true 
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
sessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Creating and exporting the Session model
export const Session = mongoose.model<ISession>('Session', sessionSchema);