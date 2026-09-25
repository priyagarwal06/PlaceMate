import api from './axios';

export const createJob = (data) => api.post('/recruiter/jobs', data);
export const getMyJobs = () => api.get('/recruiter/jobs');
export const updateJob = (id, data) => api.put(`/recruiter/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/recruiter/jobs/${id}`);
export const getApplicantsForJob = (id) => api.get(`/recruiter/jobs/${id}/applications`);
export const updateApplicationStatus = (id, status) =>
  api.put(`/recruiter/applications/${id}/status`, { status });
