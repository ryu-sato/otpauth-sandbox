import mongoose, { Schema, Document } from "mongoose";

export interface IUserRegistrationRequest extends Document {
  sessionId: string;
  username: string;
  email: string;
  password: string;
  totpSecret: string;
  createdAt: Date;
}

const UserRegistrationRequestSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  totpSecret: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUserRegistrationRequest>("UserRegistrationRequest", UserRegistrationRequestSchema);
