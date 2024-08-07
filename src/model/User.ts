import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;

  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "User name is required"],
    unique: true,
  },

  email: {
    type: String,
    required: [true, "User emal is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "User Password is required"],
    unique: true,
  },
  verifyCode: {
    type: String,
    required: [true, "User VerifyCode is required"],
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "User VerifyCodeExpiry is required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },

  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
