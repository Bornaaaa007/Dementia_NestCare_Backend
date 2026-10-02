import express from "express";
import crypto from "crypto";
import Patient from "../models/Patient.js";
import PatientLink from "../models/PatientLink.js";
import Device from "../models/Device.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

function generateInviteCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// Create a new patient profile — first family member does this
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, age, dob, photoUrl, relation } = req.body;
    const inviteCode = generateInviteCode();

    const patient = await Patient.create({ name, age, dob, photoUrl, inviteCode });
    await PatientLink.create({
      userId: req.user.id,
      patientId: patient._id,
      relation: relation || "Family",
      isCreator: true,
    });

    res.json({ patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join an existing patient via invite code
router.post("/join", requireAuth, async (req, res) => {
  try {
    const { inviteCode, relation } = req.body;
    const patient = await Patient.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!patient) return res.status(404).json({ error: "Invalid invite code" });

    const existing = await PatientLink.findOne({
      userId: req.user.id,
      patientId: patient._id,
    });
    if (existing) return res.status(400).json({ error: "Already linked to this patient" });

    await PatientLink.create({
      userId: req.user.id,
      patientId: patient._id,
      relation: relation || "Family",
    });

    res.json({ patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List patients linked to the logged-in family member
router.get("/mine", requireAuth, async (req, res) => {
  const links = await PatientLink.find({ userId: req.user.id }).populate("patientId");
  res.json({
    patients: links.map((l) => ({ ...l.patientId.toObject(), relation: l.relation })),
  });
});

// Pair the patient's device — generates the token the patient app will use
router.post("/:id/pair-device", requireAuth, async (req, res) => {
  try {
    const device = await Device.create({ patientId: req.params.id });
    res.json({ deviceToken: device.deviceToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;