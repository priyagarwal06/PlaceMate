import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route  POST /api/auth/register
// @desc   Register a student or recruiter
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      branch,
      cgpa,
      skills,
      companyName,
      companyDescription,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role
    });

    if (role === 'student') {

      if (!branch || cgpa === undefined) {
        await User.findByIdAndDelete(user._id);

        return res.status(400).json({
          success: false,
          message: 'Branch and CGPA are required for student accounts'
        });
      }

      await StudentProfile.create({
        user: user._id,
        branch,
        cgpa,
        skills: Array.isArray(skills) ? skills : [],
      });

    } else if (role === 'recruiter') {

      if (!companyName) {
        await User.findByIdAndDelete(user._id);

        return res.status(400).json({
          success: false,
          message: 'Company name is required for recruiter accounts'
        });
      }

      await RecruiterProfile.create({
        user: user._id,
        companyName,
        companyDescription: companyDescription || '',
      });
    }

    res.status(201).json({
      success: true,
      message:
        role === 'recruiter'
          ? 'Registered successfully. Your account is pending admin approval before you can log in.'
          : 'Registered successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id),
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// @route  POST /api/auth/login
// @desc   Login and receive a JWT
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated by an admin'
      });
    }

    if (user.role === 'recruiter' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your recruiter account is still pending admin approval'
      });
    }

    // Get recruiter company
    let recruiterProfile = null;

    if (user.role === 'recruiter') {
      recruiterProfile = await RecruiterProfile.findOne({
        user: user._id
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: recruiterProfile?.companyName || '',
        token: generateToken(user._id),
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// @route  GET /api/auth/me
// @desc   Get the currently logged-in user's basic info
export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};
