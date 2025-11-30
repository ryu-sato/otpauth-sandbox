import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  totpSecret: string;
  createdAt: Date;
  updateProfile(update: Partial<IUser>): Promise<void>;
  validateProfile(update: Partial<IUser>): { success: boolean; error?: string };
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

UserSchema.methods.updateProfile = async function (update: Partial<IUser>) {
  if (update.email) this.email = update.email;
  if (update.password) this.password = update.password;
  await this.save();
};

UserSchema.methods.validateProfile = function (update: Partial<IUser>) {
  if (update.email === "") {
    return { success: false, error: "メールアドレスは必須です" };
  }
  return { success: true };
};

export default mongoose.model<IUser>("User", UserSchema);
