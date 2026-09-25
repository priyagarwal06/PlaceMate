import { useState, useEffect } from 'react';
import { getAllRecruiters, approveRecruiter, rejectRecruiter, setUserActiveStatus } from '../../api/adminApi';

const RecruitersTab = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const res = await getAllRecruiters();
      setRecruiters(res.data.data);
    } catch (err) {
      setError('Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleApprove = async (id) => {
    setUpdatingId(id);
    try {
      await approveRecruiter(id);
      fetchRecruiters();
    } catch (err) {
      setError('Failed to approve recruiter');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject and remove this recruiter and their jobs? This cannot be undone.')) return;
    setUpdatingId(id);
    try {
      await rejectRecruiter(id);
      fetchRecruiters();
    } catch (err) {
      setError('Failed to reject recruiter');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleActive = async (recruiter) => {
    setUpdatingId(recruiter._id);
    try {
      await setUserActiveStatus(recruiter._id, !recruiter.isActive);
      fetchRecruiters();
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading recruiters...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (recruiters.length === 0) return <p className="text-gray-500">No recruiters registered yet.</p>;

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm min-w-[780px]">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Approval</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">{r.profile?.companyName || '-'}</td>
              <td className="px-4 py-3">{r.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    r.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {r.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {r.isActive ? 'Active' : 'Deactivated'}
                </span>
              </td>
              <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                {!r.isApproved && (
                  <button
                    onClick={() => handleApprove(r._id)}
                    disabled={updatingId === r._id}
                    className="text-xs bg-indigo-700 text-white px-2 py-1 rounded hover:bg-indigo-800 disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => toggleActive(r)}
                  disabled={updatingId === r._id}
                  className="text-xs border px-2 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {r.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleReject(r._id)}
                  disabled={updatingId === r._id}
                  className="text-xs border border-red-300 text-red-600 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruitersTab;
