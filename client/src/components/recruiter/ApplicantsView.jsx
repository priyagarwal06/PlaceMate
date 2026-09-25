import { useState, useEffect } from 'react';
import { getApplicantsForJob, updateApplicationStatus } from '../../api/recruiterApi';

const STATUS_OPTIONS = ['Pending', 'Shortlisted', 'Selected', 'Rejected'];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Shortlisted: 'bg-blue-100 text-blue-700',
  Selected: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const ApplicantsView = ({ job, onBack }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await getApplicantsForJob(job._id);
      setApplicants(res.data.data);
    } catch (err) {
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job._id]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    setError('');
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplicants((prev) => prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a)));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="text-indigo-700 text-sm mb-4 hover:underline">
        &larr; Back to My Jobs
      </button>
      <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
      <p className="text-gray-500 text-sm mb-4">{job.company}</p>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      {loading ? (
        <p className="text-gray-500">Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">CGPA</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Resume</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id} className="border-t align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{app.student?.name}</div>
                    <div className="text-gray-500 text-xs">{app.student?.email}</div>
                  </td>
                  <td className="px-4 py-3">{app.studentProfile?.branch || '-'}</td>
                  <td className="px-4 py-3">{app.studentProfile?.cgpa ?? '-'}</td>
                  <td className="px-4 py-3">{app.studentProfile?.skills?.join(', ') || '-'}</td>
                  <td className="px-4 py-3">
                    {app.studentProfile?.resumeUrl ? (
                      <a
                        href={app.studentProfile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-700 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updatingId === app._id}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${statusColors[app.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicantsView;
