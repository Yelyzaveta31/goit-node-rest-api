import { Schema, model } from "mongoose";
import { mongoSaveError, setMongoUpdateSettings } from "./hooks.js";
import { phoneRegex } from "../../constants/contact-constants.js";
import { emailRegex } from "../../constants/user-constants.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailRegex,
    },
    phone: {
      type: String,
      match: phoneRegex,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

contactSchema.post("save", mongoSaveError);
contactSchema.pre("findOneAndUpdate", setMongoUpdateSettings);

const Contact = model("contact", contactSchema);

export default Contact;