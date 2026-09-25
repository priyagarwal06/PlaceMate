// Password strength rule:
// min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex = /^[0-9]{10}$/;

export const validateJobInput = (req, res, next) => {
  const { title, company, minCGPA, branch, skills } = req.body;

  const errors = [];

  if (!title || title.trim().length < 2) {
    errors.push('Job title is required');
  }

  if (!company || company.trim().length < 2) {
    errors.push('Company name is required');
  }

  if (minCGPA === undefined || minCGPA < 0 || minCGPA > 10) {
    errors.push('Minimum CGPA must be a number between 0 and 10');
  }

  if (!branch || !Array.isArray(branch) || branch.length === 0) {
    errors.push('At least one eligible branch is required (as an array)');
  }

  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('Skills must be an array of strings');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

export const validateRegisterInput = (req, res, next) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    branch,
    cgpa,
    companyName
  } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!phone || !phoneRegex.test(phone)) {
    errors.push('Phone number must be exactly 10 digits');
  }

  if (!password || !strongPasswordRegex.test(password)) {
    errors.push(
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character'
    );
  }

  if (!role || !['student', 'recruiter'].includes(role)) {
    errors.push('Role must be one of: student, recruiter');
  }

  // Student-specific validation
  if (role === 'student') {
    if (!branch || typeof branch !== 'string' || branch.trim().length === 0) {
      errors.push('Branch is required for student accounts');
    }

    if (
      cgpa === undefined ||
      cgpa === null ||
      cgpa === '' ||
      Number(cgpa) < 0 ||
      Number(cgpa) > 10
    ) {
      errors.push('A valid CGPA between 0 and 10 is required for student accounts');
    }
  }

  // Recruiter-specific validation
  if (role === 'recruiter') {
    if (!companyName || companyName.trim().length < 2) {
      errors.push('Company name is required for recruiter accounts');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};