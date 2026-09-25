import { useState, useEffect } from 'react';
import { getAllJobs, removeJob } from '../../api/adminApi';

const JobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      setJobs(res.data.data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this job and its applications? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await removeJob(id);
      fetchJobs();
    } catch (err) {
      setError('Failed to remove job');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading jobs...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (jobs.length === 0) return <p className="text-gray-500">No jobs posted yet.</p>;

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Posted By</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t">
              <td className="px-4 py-3">{job.title}</td>
              <td className="px-4 py-3">{job.company}</td>
              <td className="px-4 py-3">{job.postedBy?.name || '-'}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                    job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(job._id)}
                  disabled={deletingId === job._id}
                  className="text-xs border border-red-300 text-red-600 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTab;
