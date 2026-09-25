import { useState, useEffect } from 'react';
import {
  getProfile,
  updateProfile,
  uploadResume
} from '../../api/studentApi';

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

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    branch: '',
    cgpa: '',
    skills: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const res = await getProfile();

      const p = res.data.data;

      setProfile(p);

      setForm({
        branch: p.branch || '',
        cgpa: p.cgpa ?? '',
        skills: p.skills || []
      });

    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    try {

      const payload = {
        branch: form.branch,
        cgpa: Number(form.cgpa),
        skills: form.skills
      };

      const res = await updateProfile(payload);

      setProfile(res.data.data);

      setMessage('Profile updated successfully');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to update profile'
      );

    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {

    if (!resumeFile) return;

    setUploading(true);
    setError('');
    setMessage('');

    try {

      const formData = new FormData();

      formData.append('resume', resumeFile);

      const res = await uploadResume(formData);

      setProfile((prev) => ({
        ...prev,
        resumeUrl: res.data.data.resumeUrl
      }));

      setMessage('Resume uploaded successfully');

      setResumeFile(null);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to upload resume'
      );

    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading profile...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-red-600 text-sm">
        {error || 'Profile not found'}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">

      {/* Messages */}

      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* Branch */}

        <label className="block text-sm text-gray-600 mb-1">
          Branch
        </label>

        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
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

        <label className="block text-sm text-gray-600 mb-1">
          CGPA
        </label>

        <input
          type="number"
          step="0.01"
          min="0"
          max="10"
          name="cgpa"
          value={form.cgpa}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />


        {/* Skills */}

        <label className="block text-sm text-gray-600 mb-2">
          Skills
        </label>

        <div className="border rounded p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">

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


        {/* Selected Skills */}

        <div className="mb-4">

          <p className="text-sm text-gray-600 mb-2">
            Selected Skills:
          </p>

          {form.skills.length === 0 ? (

            <p className="text-sm text-gray-400">
              No skills selected
            </p>

          ) : (

            <div className="flex flex-wrap gap-2">

              {form.skills.map((skill) => (

                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>

              ))}

            </div>

          )}

        </div>


        {/* Save */}

        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 disabled:opacity-50"
        >
          {saving
            ? 'Saving...'
            : 'Save Profile'}
        </button>

      </form>


      {/* Resume */}

      <hr className="my-6" />

      <h3 className="font-semibold text-gray-700 mb-2">
        Resume
      </h3>

      {profile.resumeUrl ? (

        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-700 text-sm hover:underline block mb-3"
        >
          View current resume
        </a>

      ) : (

        <p className="text-sm text-gray-500 mb-3">
          No resume uploaded yet.
        </p>

      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setResumeFile(e.target.files[0])
        }
        className="text-sm mb-3 block"
      />

      <button
        onClick={handleResumeUpload}
        disabled={!resumeFile || uploading}
        className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {uploading
          ? 'Uploading...'
          : 'Upload Resume (PDF)'}
      </button>

    </div>
  );
};

export default ProfileTab;