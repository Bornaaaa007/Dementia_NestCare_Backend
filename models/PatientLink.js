import mongoose from "mongoose";

const patientLinkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // better-auth user id
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    relation: { type: String, default: "Family" }, // e.g. "Son", "Granddaughter"
    isCreator: { type: Boolean, default: false },
  },
  { timestamps: true }
);

patientLinkSchema.index({ userId: 1, patientId: 1 }, { unique: true });

export default mongoose.model("PatientLink", patientLinkSchema);