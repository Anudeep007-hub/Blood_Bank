const mongoose = require('mongoose');

const PatientBloodRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  hospitalName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  requiredUnits: { type: Number, required: true },
  urgencyLevel: { type: String, required: true },
  dateNeeded: { type: Date, required: true },
  additionalInfo: { type: String },
  doctor: {type: String, required: true}
});

const PatientBloodRequest = mongoose.model('PatientDetails', PatientBloodRequestSchema);

module.exports = PatientBloodRequest;
