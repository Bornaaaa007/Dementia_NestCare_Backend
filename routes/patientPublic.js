import express from "express";
import Device from "../models/Device.js";
import Patient from "../models/Patient.js";

const router = express.Router();

router.get("/profile", async (req, res) => {
  const deviceToken = req.header("x-device-token");
  if (!deviceToken) return res.status(401).json({ error: "No device token" });

  const device = await Device.findOne({ deviceToken });
  if (!device) return res.status(401).json({ error: "Invalid device" });

  const patient = await Patient.findById(device.patientId);
  res.json({ patient });
});

export default router;