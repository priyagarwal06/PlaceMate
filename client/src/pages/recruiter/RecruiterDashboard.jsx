import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createJob } from '../../api/recruiterApi';

import JobForm from '../../components/recruiter/JobForm';
import JobsList from '../../components/recruiter/JobsList';
import ApplicantsView from '../../components/recruiter/ApplicantsView';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateJob = async (payload) => {
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await createJob(payload);

      setMessage('Job posted successfully!');
      setActiveTab('jobs');

      // Refresh JobsList
      setRefreshKey((prev) => prev + 1);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Failed to post job'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  // Applicants screen
  if (selectedJob) {
    return (
      <div className="max-w-6xl mx-auto p-6">

        <ApplicantsView
          job={selectedJob}
          onBack={handleBackToJobs}
        />

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-indigo-700">
          Welcome, {user?.name}
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your jobs and applicants from here.
        </p>

      </div>


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


      {/* Tabs */}

      <div className="flex gap-2 mb-6 border-b flex-wrap">

        <button
          onClick={() => {
            setActiveTab('jobs');
            setMessage('');
            setError('');
          }}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'jobs'
              ? 'border-indigo-700 text-indigo-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Jobs
        </button>

        <button
          onClick={() => {
            setActiveTab('post');
            setMessage('');
            setError('');
          }}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'post'
              ? 'border-indigo-700 text-indigo-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Post New Job
        </button>

      </div>


      {/* My Jobs */}

      {activeTab === 'jobs' && (

        <JobsList
          onViewApplicants={handleViewApplicants}
          refreshKey={refreshKey}
        />

      )}


      {/* Post New Job */}

      {activeTab === 'post' && (
        <JobForm
        companyName={user?.companyName}
        onSubmit={handleCreateJob}
         submitting={submitting}
         onCancel={() => {
    setActiveTab('jobs');
    setMessage('');
    setError('');
  }}
/>

        

      )}

    </div>
  );
};

export default RecruiterDashboard;
