import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Selected', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true } // createdAt doubles as "appliedAt"
);

// A student can only apply to the same job once
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
