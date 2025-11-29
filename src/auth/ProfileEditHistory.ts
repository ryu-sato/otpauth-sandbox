import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfileEditHistory extends Document {
  userId: string;
  before: Record<string, any>;
  after: Record<string, any>;
  editedAt: Date;
}

const ProfileEditHistorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  before: { type: Object, required: true },
  after: { type: Object, required: true },
  editedAt: { type: Date, default: Date.now },
});

ProfileEditHistorySchema.statics.createHistory = async function ({ userId, before, after }: { userId: string; before: any; after: any }) {
  return await this.create({ userId, before, after });
};

ProfileEditHistorySchema.statics.getHistoryByUser = async function (userId: string) {
  return await this.find({ userId }).sort({ editedAt: -1 });
};

const ProfileEditHistory = mongoose.model<IProfileEditHistory, Model<IProfileEditHistory> & {
  createHistory: (args: { userId: string; before: any; after: any }) => Promise<IProfileEditHistory>;
  getHistoryByUser: (userId: string) => Promise<IProfileEditHistory[]>;
}>("ProfileEditHistory", ProfileEditHistorySchema);

export default ProfileEditHistory;
