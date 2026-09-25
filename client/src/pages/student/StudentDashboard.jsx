import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileTab from '../../components/student/ProfileTab';
import JobsTab from '../../components/student/JobsTab';
import ApplicationsTab from '../../components/student/ApplicationsTab';

const TABS = ['Profile', 'Jobs', 'Applications'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-1">Welcome, {user.name}</h1>
      <p className="text-gray-500 mb-6">Manage your profile, browse jobs, and track applications.</p>

      <div className="flex gap-2 mb-6 border-b">
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

      {activeTab === 'Profile' && <ProfileTab />}
      {activeTab === 'Jobs' && <JobsTab />}
      {activeTab === 'Applications' && <ApplicationsTab />}
    </div>
  );
};

export default StudentDashboard;
