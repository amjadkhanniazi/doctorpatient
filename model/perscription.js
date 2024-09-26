import mongoose from "mongoose";
import { Schema } from "mongoose";

const PrescriptionSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User schema
    required: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User schema
    required: true
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true  // e.g., 'twice a day'
    },
    duration: {
      type: String,
      required: true  // e.g., '7 days'
    }
  }],
  diagnosis: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  prescribedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prescription', PrescriptionSchema);
