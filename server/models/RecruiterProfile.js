import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    companyDescription: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('RecruiterProfile', recruiterProfileSchema);
