import { useState, useEffect } from 'react';
import { listJobs, applyToJob } from '../../api/studentApi';

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

const JobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    company: '',
    branch: '',
    skill: '',
    eligibleOnly: true
  });

  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      if (filters.company) {
        params.company = filters.company;
      }

      if (filters.branch) {
        params.branch = filters.branch;
      }

      if (filters.skill) {
        params.skill = filters.skill;
      }

      if (filters.eligibleOnly) {
        params.eligibleOnly = 'true';
      }

      const res = await listJobs(params);

      const jobData = res.data.data || [];

      setJobs(jobData);

      // Create company options from actual database jobs
      const uniqueCompanies = [
        ...new Set(
          jobData
            .map((job) => job.company)
            .filter(Boolean)
        )
      ];

      setCompanies(uniqueCompanies);

    } catch (err) {
      console.error(err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEligibleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      eligibleOnly: e.target.checked
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setMessage('');
    fetchJobs();
  };

  const handleApply = async (job) => {
    const confirmApply = window.confirm(
      `Apply for ${job.title} at ${job.company}?`
    );

    if (!confirmApply) return;

    setApplyingId(job._id);
    setMessage('');
    setError('');

    try {
      await applyToJob(job._id);

      setMessage(
        `Application submitted successfully for ${job.title} at ${job.company}.`
      );

      fetchJobs();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to apply'
      );
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div>

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


      {/* Filters */}

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-lg shadow p-4 mb-6"
      >

        <h3 className="font-semibold text-gray-700 mb-3">
          Find Jobs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          {/* Company */}

          <select
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 text-sm"
          >

            <option value="">
              All Companies
            </option>

            {companies.map((company) => (
              <option
                key={company}
                value={company}
              >
                {company}
              </option>
            ))}

          </select>


          {/* Branch */}

          <select
            name="branch"
            value={filters.branch}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 text-sm"
          >

            <option value="">
              All Branches
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


          {/* Skill */}

          <select
            name="skill"
            value={filters.skill}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 text-sm"
          >

            <option value="">
              All Skills
            </option>

            {SKILL_OPTIONS.map((skill) => (
              <option
                key={skill}
                value={skill}
              >
                {skill}
              </option>
            ))}

          </select>


          {/* Eligible */}

          <label className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              checked={filters.eligibleOnly}
              onChange={handleEligibleChange}
            />

            Show eligible jobs only

          </label>

        </div>


        <button
          type="submit"
          className="mt-4 bg-indigo-700 text-white px-5 py-2 rounded text-sm hover:bg-indigo-800"
        >
          Search Jobs
        </button>

      </form>


      {/* Jobs */}

      {loading ? (

        <p className="text-gray-500">
          Loading jobs...
        </p>

      ) : jobs.length === 0 ? (

        <p className="text-gray-500">
          No jobs found.
        </p>

      ) : (

        <div className="grid gap-4">

          {jobs.map((job) => (

            <div
              key={job._id}
              className="bg-white rounded-lg shadow p-5"
            >

              {/* Job Header */}

              <div className="flex justify-between items-start gap-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    {job.title}
                  </h3>

                  <p className="text-indigo-700 font-medium text-sm">
                    {job.company}
                  </p>

                </div>


                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                    job.eligibility?.eligible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >

                  {job.eligibility?.eligible
                    ? 'Eligible'
                    : 'Not Eligible'}

                </span>

              </div>


              {/* Job Information */}

              <div className="text-sm text-gray-600 mt-3 space-y-1">

                <p>
                  <strong>Minimum CGPA:</strong>{' '}
                  {job.minCGPA}
                </p>

                <p>
                  <strong>Eligible Branches:</strong>{' '}
                  {Array.isArray(job.branch)
                    ? job.branch.join(', ')
                    : job.branch || '-'}
                </p>

                <p>
                  <strong>Required Skills:</strong>{' '}

                  {Array.isArray(job.skills) &&
                  job.skills.length > 0
                    ? job.skills.join(', ')
                    : 'Not specified'}

                </p>

              </div>


              {/* Eligibility Reasons */}

              {!job.eligibility?.eligible &&
                job.eligibility?.reasons?.length > 0 && (

                <div className="mt-3">

                  <p className="text-xs font-medium text-red-600">
                    Why you are not eligible:
                  </p>

                  <ul className="text-xs text-red-600 mt-1 list-disc list-inside">

                    {job.eligibility.reasons.map(
                      (reason, index) => (
                        <li key={index}>
                          {reason}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              )}


              {/* Apply */}

              <button
                onClick={() => handleApply(job)}
                disabled={
                  !job.eligibility?.eligible ||
                  applyingId === job._id
                }
                className="mt-4 bg-indigo-700 text-white px-4 py-2 rounded text-sm hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                {applyingId === job._id
                  ? 'Applying...'
                  : 'Apply'}

              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default JobsTab;