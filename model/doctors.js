import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    specialty: {
        type:String,
        required:true
    },
    licenseNumber: {
        type:String,
        required:true
    },
    // Other doctor-specific fields
  });

export default mongoose.model('Doctor', DoctorSchema);