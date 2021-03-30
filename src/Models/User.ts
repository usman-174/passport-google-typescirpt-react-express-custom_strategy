import { Schema,model,Document } from "mongoose"

export interface IUSER extends Document {
  id: string
  username: string
  email?: string,
  password:string,
  provider: "google" | "github" | "local"
}

const UserSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String,required:false },
  provider: { type: String, required: true, default: "local" },
})

export const User = model<IUSER>("user", UserSchema)
