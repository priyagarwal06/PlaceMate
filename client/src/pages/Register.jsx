import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BRANCH_OPTIONS = [
  'IT',
  'CSE',
  'ECE',
  'EE',
  'ME',
  'CE'
];

const SKILL_OPTIONS = [
  'Java',
  'C++',
  'Python',
  'JavaScript',
  'HTML',
  'CSS',
  'React',
  'Node.js',
  'SQL',
  'MongoDB',
  'Git/GitHub',
  'DSA',
  'OOP',
  'DBMS',
  'Operating Systems',
  'Computer Networks'
];

const dashboardPathForRole = (role) => {
  if (role === 'student') return '/student/dashboard';
  if (role === 'recruiter') return '/recruiter/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    branch: '',
    cgpa: '',
    skills: [],
    companyName: '',
    companyDescription: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillChange = (skill) => {
    setForm((prev) => {
      const alreadySelected = prev.skills.includes(skill);

      return {
        ...prev,
        skills: alreadySelected
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
      };

      if (role === 'student') {
        payload.branch = form.branch;
        payload.cgpa = Number(form.cgpa);
        payload.skills = form.skills;
      }

      if (role === 'recruiter') {
        payload.companyName = form.companyName;
        payload.companyDescription = form.companyDescription;
      }

      const data = await register(payload);

      if (role === 'recruiter') {
        navigate('/login', {
          state: {
            message:
              'Registered! Your account needs admin approval before you can log in.'
          },
        });

        return;
      }

      navigate(dashboardPathForRole(data.role));

    } catch (err) {

      const errs = err.response?.data?.errors;

      setError(
        errs
          ? errs.join(', ')
          : err.response?.data?.message ||
            'Registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >

        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Role */}

        <div className="flex gap-2 mb-4">

          {['student', 'recruiter'].map((r) => (

            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded border text-sm capitalize transition ${
                role === r
                  ? 'bg-indigo-700 text-white border-indigo-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {r}
            </button>

          ))}

        </div>

        {/* Name */}

        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        {/* Email */}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        {/* Phone */}

        <input
          name="phone"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        {/* Password */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-1"
          required
        />

        <p className="text-xs text-gray-500 mb-3">
          Min 8 characters, with uppercase, lowercase, a number, and a special character.
        </p>

        {/* STUDENT */}

        {role === 'student' && (
          <>

            {/* Branch */}

            <label className="block text-sm text-gray-600 mb-1">
              Branch
            </label>

            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-3"
              required
            >

              <option value="">
                Select your branch
              </option>

              {BRANCH_OPTIONS.map((branch) => (
                <option
                  key={branch}
                  value={branch}
                >
                  {branch}
                </option>
              ))}

            </select>

            {/* CGPA */}

            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              placeholder="CGPA"
              value={form.cgpa}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-4"
              required
            />

            {/* Skills */}

            <label className="block text-sm text-gray-600 mb-2">
              Skills
            </label>

            <div className="border rounded p-3 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">

              {SKILL_OPTIONS.map((skill) => (

                <label
                  key={skill}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >

                  <input
                    type="checkbox"
                    checked={form.skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                  />

                  <span>{skill}</span>

                </label>

              ))}

            </div>

            <p className="text-xs text-gray-500 mb-3">
              Select all skills you know.
            </p>

          </>
        )}

        {/* RECRUITER */}

        {role === 'recruiter' && (
          <>

            <input
              name="companyName"
              placeholder="Company name"
              value={form.companyName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-3"
              required
            />

            <textarea
              name="companyDescription"
              placeholder="Brief company description (optional)"
              value={form.companyDescription}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-3"
              rows={2}
            />

            <p className="text-xs text-amber-600 mb-3">
              Recruiter accounts require admin approval before you can log in.
            </p>

          </>
        )}

        {/* Register */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 transition disabled:opacity-50 mt-2"
        >
          {loading
            ? 'Creating account...'
            : 'Register'}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">

          Already have an account?{' '}

          <Link
            to="/login"
            className="text-indigo-700 font-medium hover:underline"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Register;
