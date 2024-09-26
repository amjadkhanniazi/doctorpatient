import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dateOfBirth: Date,
    medicalHistory: String,
    // Other patient-specific fields
  });

export default mongoose.model('Patient', PatientSchema);