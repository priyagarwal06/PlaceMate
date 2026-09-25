import { useState, useEffect } from 'react';
import { getMyApplications } from '../../api/studentApi';

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

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyApplications();

      setApplications(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading applications...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm">
        {error}
      </p>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">
          You haven't applied to any jobs yet.
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* Summary */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Pending
          </p>
          <p className="text-2xl font-bold text-yellow-700">
            {applications.filter(
              (app) => app.status === 'Pending'
            ).length}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Shortlisted
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {applications.filter(
              (app) => app.status === 'Shortlisted'
            ).length}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Selected
          </p>
          <p className="text-2xl font-bold text-green-700">
            {applications.filter(
              (app) => app.status === 'Selected'
            ).length}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Rejected
          </p>
          <p className="text-2xl font-bold text-red-700">
            {applications.filter(
              (app) => app.status === 'Rejected'
            ).length}
          </p>
        </div>

      </div>


      {/* Applications Table */}

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full text-sm min-w-[650px]">

          <thead className="bg-gray-50 text-gray-600 text-left">

            <tr>
              <th className="px-4 py-3">
                Job
              </th>

              <th className="px-4 py-3">
                Company
              </th>

              <th className="px-4 py-3">
                Applied On
              </th>

              <th className="px-4 py-3">
                Status
              </th>
            </tr>

          </thead>

          <tbody>

            {applications.map((app) => {

              const status =
                app.status || 'Pending';

              return (
                <tr
                  key={app._id}
                  className="border-t"
                >

                  <td className="px-4 py-3 font-medium">
                    {app.job?.title || 'N/A'}
                  </td>

                  <td className="px-4 py-3">
                    {app.job?.company || 'N/A'}
                  </td>

                  <td className="px-4 py-3">
                    {app.createdAt
                      ? new Date(
                          app.createdAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  <td className="px-4 py-3">

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        statusColors[status] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {status}
                    </span>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ApplicationsTab;