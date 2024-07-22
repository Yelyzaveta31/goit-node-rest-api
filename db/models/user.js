import { emailRegex } from "../../constants/user-constants";

const { Schema } = require("mongoose")


const userSchema = new Schema(
{
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRegex,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: { type: String },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongoSaveError);
userSchema.pre("findOneAndUpdate", setMongoUpdateSettings);
userSchema.post("findOneAndUpdate", mongoSaveError);

const User = model("user", userSchema);
export default User;
  
