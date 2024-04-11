import mongoose, { Document, Schema } from "mongoose";

interface ISubscription extends Document {
  status: "active" | "expired";
  expiresAt: Date;
  freeUse: number
}

interface IDialog extends Document {
  messages: string[];
}

interface IUser extends Document {
  machineId: string;
  dialogs: IDialog[];
  subscription: ISubscription;
}

const SubscriptionSchema: Schema = new Schema({
  status: { type: String, enum: ["active", "expired"], default: "active" },
  expiresAt: { type: Date, required: true },
  freeUse: { type: Number, required: true } 
});

const DialogSchema: Schema = new Schema({
  messages: [{ type: String }],
});

const UserSchema: Schema = new Schema({
  machineId: { type: String, required: true, unique: true },
  dialogs: [DialogSchema],
  subscription: { type: SubscriptionSchema, required: true },
});

UserSchema.pre<IUser>("save", function (next) {
  if (this.subscription.expiresAt < new Date()) {
    this.subscription.status = "expired";
  }
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
