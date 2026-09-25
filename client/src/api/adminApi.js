import api from './axios';

export const getAllStudents = () => api.get('/admin/students');
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);
export const getAllRecruiters = () => api.get('/admin/recruiters');
export const approveRecruiter = (id) => api.put(`/admin/recruiters/${id}/approve`);
export const rejectRecruiter = (id) => api.delete(`/admin/recruiters/${id}`);
export const setUserActiveStatus = (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive });
export const getAllJobs = () => api.get('/admin/jobs');
export const removeJob = (id) => api.delete(`/admin/jobs/${id}`);
export const getAllApplications = () => api.get('/admin/applications');
export const getAnalytics = () => api.get('/admin/analytics');
export const exportPlacedStudents = () => api.get('/admin/export/placed-students', { responseType: 'blob' });
export const exportCompanyReport = () => api.get('/admin/export/company-report', { responseType: 'blob' });
