import api from './axios';

export const getProfile = () => api.get('/student/profile');
export const updateProfile = (data) => api.put('/student/profile', data);
export const listJobs = (params) => api.get('/jobs', { params });
export const applyToJob = (jobId) => api.post(`/jobs/${jobId}/apply`);
export const getMyApplications = () => api.get('/student/applications');
export const uploadResume = (formData) =>
  api.post('/student/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
