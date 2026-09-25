import { useState, useEffect } from 'react';
import { getMyJobs, updateJob, deleteJob } from '../../api/recruiterApi';
import JobForm from './JobForm';

const JobsList = ({ onViewApplicants, refreshKey }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyJobs();
      setJobs(res.data.data);
    } catch (err) {
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleUpdate = async (id, payload) => {
    setSavingId(id);
    try {
      await updateJob(id, payload);
      setEditingId(null);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    setSavingId(job._id);
    try {
      await updateJob(job._id, { status: job.status === 'open' ? 'closed' : 'open' });
      fetchJobs();
    } catch (err) {
      setError('Failed to update job status');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job and all its applications? This cannot be undone.')) return;
    setSavingId(id);
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading your jobs...</p>;

  return (
    <div>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
      {jobs.length === 0 ? (
        <p className="text-gray-500">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) =>
            editingId === job._id ? (
              <JobForm
                key={job._id}
                initialData={job}
                submitting={savingId === job._id}
                onSubmit={(payload) => handleUpdate(job._id, payload)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div key={job._id} className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-500 text-sm">{job.company}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mt-3 space-y-1">
                  <p>Min CGPA: {job.minCGPA}</p>
                  <p>Branch: {job.branch.join(', ')}</p>
                  {job.skills.length > 0 && <p>Skills: {job.skills.join(', ')}</p>}
                  <p>
                    {job.applicationCount} application{job.applicationCount === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => onViewApplicants(job)}
                    className="bg-indigo-700 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-800"
                  >
                    View Applicants
                  </button>
                  <button
                    onClick={() => setEditingId(job._id)}
                    className="border px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(job)}
                    disabled={savingId === job._id}
                    className="border px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {job.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={savingId === job._id}
                    className="border border-red-300 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default JobsList;
