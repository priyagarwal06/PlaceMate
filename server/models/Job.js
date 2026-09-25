import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // must have role 'recruiter'
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    minCGPA: {
      type: Number,
      required: [true, 'Minimum CGPA is required'],
      min: 0,
      max: 10,
    },
    branch: {
      // eligible branches, e.g. ["CSE", "IT"]
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    skills: {
      // required skills, e.g. ["Java", "SQL"]
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
