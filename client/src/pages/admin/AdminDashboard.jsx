import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import StudentsTab from '../../components/admin/StudentsTab';
import RecruitersTab from '../../components/admin/RecruitersTab';
import JobsTab from '../../components/admin/JobsTab';
import ApplicationsTab from '../../components/admin/ApplicationsTab';
import AnalyticsTab from '../../components/admin/AnalyticsTab';

const TABS = [
  'Analytics',
  'Students',
  'Recruiters',
  'Jobs',
  'Applications'
];

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Analytics');

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold text-indigo-700 mb-1">
        Welcome, {user?.name}
      </h1>

      <p className="text-gray-500 mb-6">
        Manage students, recruiters, jobs, applications and placement analytics.
      </p>

      {/* Admin Navigation */}
      <div className="flex gap-2 mb-6 border-b flex-wrap">

        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === tab
                ? 'border-indigo-700 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* Tab Content */}

      {activeTab === 'Analytics' && <AnalyticsTab />}

      {activeTab === 'Students' && <StudentsTab />}

      {activeTab === 'Recruiters' && <RecruitersTab />}

      {activeTab === 'Jobs' && <JobsTab />}

      {activeTab === 'Applications' && <ApplicationsTab />}

    </div>
  );
};

export default AdminDashboard;