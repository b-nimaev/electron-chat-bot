import mongoose, { Schema, Document } from "mongoose";

export interface ActivationKeyModel extends Document {
  key: string;
  isActivated: boolean;
}

const ActivationKeySchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  isActivated: { type: Boolean, default: false },
});

export default mongoose.model<ActivationKeyModel>(
  "ActivationKey",
  ActivationKeySchema
);
