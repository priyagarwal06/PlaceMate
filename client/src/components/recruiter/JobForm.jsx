import { useState } from 'react';

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

const JobForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitting,
  companyName
}) => {

  const [form, setForm] = useState({
    title: initialData?.title || '',
    company: companyName || initialData?.company || '',
    description: initialData?.description || '',
    minCGPA: initialData?.minCGPA ?? '',
    branch: initialData?.branch || [],
    skills: initialData?.skills || [],
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleBranchChange = (branch) => {
    setForm((prev) => {
      const alreadySelected = prev.branch.includes(branch);

      return {
        ...prev,
        branch: alreadySelected
          ? prev.branch.filter((item) => item !== branch)
          : [...prev.branch, branch]
      };
    });
  };

  const handleSkillChange = (skill) => {
    setForm((prev) => {
      const alreadySelected = prev.skills.includes(skill);

      return {
        ...prev,
        skills: alreadySelected
          ? prev.skills.filter((item) => item !== skill)
          : [...prev.skills, skill]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.branch.length === 0) {
      alert('Please select at least one eligible branch.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      company: form.company,
      description: form.description.trim(),
      minCGPA: Number(form.minCGPA),
      branch: form.branch,
      skills: form.skills,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 max-w-2xl"
    >

      {/* Job Title */}

      <label className="block text-sm text-gray-600 mb-1">
        Job Title
      </label>

      <select
  name="title"
  value={form.title}
  onChange={handleChange}
  className="w-full border rounded px-3 py-2 mb-4 bg-white"
  required
>
  <option value="">
    Select Job Title
  </option>

  <option value="Software Developer">
    Software Developer
  </option>

  <option value="Backend Engineer">
    Backend Engineer
  </option>

  <option value="Frontend Developer">
    Frontend Developer
  </option>

  <option value="Full Stack Developer">
    Full Stack Developer
  </option>

  <option value="Data Analyst">
    Data Analyst
  </option>

  <option value="Data Scientist">
    Data Scientist
  </option>

  <option value="Java Developer">
    Java Developer
  </option>

  <option value="Python Developer">
    Python Developer
  </option>

  <option value="Web Developer">
    Web Developer
  </option>

  <option value="AI/ML Engineer">
    AI/ML Engineer
  </option>
</select>


      {/* Company */}

      <label className="block text-sm text-gray-600 mb-1">
        Company
      </label>

      <input
        name="company"
        value={form.company}
        readOnly
        className="w-full border rounded px-3 py-2 mb-4 bg-gray-100 text-gray-600 cursor-not-allowed"
      />

      <p className="text-xs text-gray-500 -mt-3 mb-4">
        Company is automatically taken from your recruiter account.
      </p>


      {/* Description */}

      <label className="block text-sm text-gray-600 mb-1">
        Job Description
      </label>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        placeholder="Enter job description..."
        className="w-full border rounded px-3 py-2 mb-4"
      />


      {/* Minimum CGPA */}

      <label className="block text-sm text-gray-600 mb-1">
        Minimum CGPA
      </label>

      <input
        type="number"
        step="0.01"
        min="0"
        max="10"
        name="minCGPA"
        value={form.minCGPA}
        onChange={handleChange}
        placeholder="e.g. 7.5"
        className="w-full border rounded px-3 py-2 mb-4"
        required
      />


      {/* Branch */}

      <label className="block text-sm text-gray-600 mb-2">
        Eligible Branches
      </label>

      <div className="border rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

          {BRANCH_OPTIONS.map((branch) => (
            <label
              key={branch}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.branch.includes(branch)}
                onChange={() => handleBranchChange(branch)}
              />

              {branch}
            </label>
          ))}

        </div>

      </div>


      {/* Skills */}

      <label className="block text-sm text-gray-600 mb-2">
        Required Skills
      </label>

      <div className="border rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

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

              {skill}
            </label>
          ))}

        </div>

      </div>


      {/* Selected values */}

      <div className="bg-gray-50 rounded p-3 mb-4 text-sm">

        <p className="text-gray-600">
          <strong>Selected Branches:</strong>{' '}
          {form.branch.length > 0
            ? form.branch.join(', ')
            : 'None selected'}
        </p>

        <p className="text-gray-600 mt-1">
          <strong>Required Skills:</strong>{' '}
          {form.skills.length > 0
            ? form.skills.join(', ')
            : 'None selected'}
        </p>

      </div>


      {/* Buttons */}

      <div className="flex gap-2">

        <button
          type="submit"
          disabled={
            submitting ||
            form.branch.length === 0
          }
          className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 disabled:opacity-50"
        >
          {submitting
            ? 'Saving...'
            : initialData
              ? 'Update Job'
              : 'Post Job'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  );
};

export default JobForm;