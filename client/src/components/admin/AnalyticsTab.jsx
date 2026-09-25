import { useState, useEffect } from 'react';
import { getAnalytics, exportPlacedStudents, exportCompanyReport } from '../../api/adminApi';
import { downloadBlob } from '../../utils/download';

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="text-2xl font-bold text-indigo-700">{value}</p>
  </div>
);

const AnalyticsTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setData(res.data.data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = async (type) => {
    setExporting(type);
    setError('');
    try {
      const res = type === 'students' ? await exportPlacedStudents() : await exportCompanyReport();
      downloadBlob(res.data, type === 'students' ? 'placed_students.csv' : 'company_report.csv');
    } catch (err) {
      setError('Export failed');
    } finally {
      setExporting('');
    }
  };

  if (loading) return <p className="text-gray-500">Loading analytics...</p>;
  if (error && !data) return <p className="text-red-600 text-sm">{error}</p>;
  if (!data) return null;

  return (
    <div>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value={data.totalStudents} />
        <StatCard label="Total Recruiters" value={data.totalRecruiters} />
        <StatCard label="Pending Recruiters" value={data.pendingRecruiters} />
        <StatCard label="Total Jobs" value={data.totalJobs} />
        <StatCard label="Open Jobs" value={data.openJobs} />
        <StatCard label="Total Applications" value={data.totalApplications} />
        <StatCard label="Placed" value={data.placedCount} />
        <StatCard label="Placement %" value={data.placementPercent} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Branch-wise Placement</h3>
          {data.branchWise.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-1">Branch</th>
                  <th className="py-1">Students</th>
                  <th className="py-1">Placed</th>
                </tr>
              </thead>
              <tbody>
                {data.branchWise.map((b) => (
                  <tr key={b.branch} className="border-t">
                    <td className="py-1">{b.branch}</td>
                    <td className="py-1">{b.totalStudents}</td>
                    <td className="py-1">{b.placed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Company-wise Hiring</h3>
          {data.companyWise.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-1">Company</th>
                  <th className="py-1">Hired</th>
                </tr>
              </thead>
              <tbody>
                {data.companyWise.map((c) => (
                  <tr key={c.company} className="border-t">
                    <td className="py-1">{c.company}</td>
                    <td className="py-1">{c.hired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport('students')}
          disabled={exporting === 'students'}
          className="bg-indigo-700 text-white px-4 py-2 rounded text-sm hover:bg-indigo-800 disabled:opacity-50"
        >
          {exporting === 'students' ? 'Exporting...' : 'Export Placed Students (CSV)'}
        </button>
        <button
          onClick={() => handleExport('company')}
          disabled={exporting === 'company'}
          className="border px-4 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {exporting === 'company' ? 'Exporting...' : 'Export Company Report (CSV)'}
        </button>
      </div>
    </div>
  );
};

export default AnalyticsTab;
