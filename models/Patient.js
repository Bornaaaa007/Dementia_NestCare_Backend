import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    dob: String,
    photoUrl: String,
    inviteCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);