import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: 0,
      max: 10,
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String, // populated later when resume upload (Phase 5) is added
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('StudentProfile', studentProfileSchema);
