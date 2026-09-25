import { useState, useEffect } from 'react';
import { getAllApplications } from '../../api/adminApi';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Shortlisted: 'bg-blue-100 text-blue-700',
  Selected: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const ApplicationsTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getAllApplications();
        setApplications(res.data.data);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p className="text-gray-500">Loading applications...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (applications.length === 0) return <p className="text-gray-500">No applications yet.</p>;

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-t">
              <td className="px-4 py-3">{app.student?.name}</td>
              <td className="px-4 py-3">{app.job?.title}</td>
              <td className="px-4 py-3">{app.job?.company}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTab;
