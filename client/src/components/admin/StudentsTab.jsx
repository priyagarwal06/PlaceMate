import { useState, useEffect } from 'react';
import {
  getAllStudents,
  deleteStudent,
  setUserActiveStatus,
  getAllApplications,
} from '../../api/adminApi';

const StudentsTab = () => {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [studentsRes, applicationsRes] = await Promise.all([
        getAllStudents(),
        getAllApplications(),
      ]);

      setStudents(studentsRes.data.data || []);
      setApplications(applicationsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleActive = async (student) => {
    setUpdatingId(student._id);

    try {
      await setUserActiveStatus(student._id, !student.isActive);

      setStudents((prev) =>
        prev.map((s) =>
          s._id === student._id
            ? { ...s, isActive: !s.isActive }
            : s
        )
      );
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmDelete) return;

    setDeletingId(student._id);

    try {
      await deleteStudent(student._id);

      setStudents((prev) =>
        prev.filter((s) => s._id !== student._id)
      );

      if (selectedStudent?._id === student._id) {
        setSelectedStudent(null);
      }

      alert('Student deleted successfully');
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          'Failed to delete student'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStudentApplications = (studentId) => {
    return applications.filter(
      (application) =>
        application.student?._id === studentId ||
        application.student === studentId
    );
  };

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading students...
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

  return (
    <div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full text-sm min-w-[1000px]">

          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">CGPA</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No students registered yet.
                </td>
              </tr>
            ) : (
              students.map((student) => {

                const skills =
                  student.profile?.skills || [];

                return (
                  <tr
                    key={student._id}
                    className="border-t"
                  >

                    <td className="px-4 py-3 font-medium">
                      {student.name}
                    </td>

                    <td className="px-4 py-3">
                      {student.email}
                    </td>

                    <td className="px-4 py-3">
                      {student.phone || '-'}
                    </td>

                    <td className="px-4 py-3">
                      {student.profile?.branch || '-'}
                    </td>

                    <td className="px-4 py-3">
                      {student.profile?.cgpa ?? '-'}
                    </td>

                    <td className="px-4 py-3">
                      {skills.length > 0
                        ? skills.join(', ')
                        : '-'}
                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          student.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {student.isActive
                          ? 'Active'
                          : 'Deactivated'}
                      </span>

                    </td>

                    <td className="px-4 py-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            setSelectedStudent(student)
                          }
                          className="text-xs border border-indigo-500 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            toggleActive(student)
                          }
                          disabled={
                            updatingId === student._id
                          }
                          className="text-xs border px-2 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          {student.isActive
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(student)
                          }
                          disabled={
                            deletingId === student._id
                          }
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === student._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

      {/* Student Details */}

      {selectedStudent && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-xl font-semibold text-indigo-700">
              Student Details
            </h3>

            <button
              onClick={() => setSelectedStudent(null)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <p>
              <strong>Name:</strong>{' '}
              {selectedStudent.name}
            </p>

            <p>
              <strong>Email:</strong>{' '}
              {selectedStudent.email}
            </p>

            <p>
              <strong>Phone:</strong>{' '}
              {selectedStudent.phone || '-'}
            </p>

            <p>
              <strong>Branch:</strong>{' '}
              {selectedStudent.profile?.branch || '-'}
            </p>

            <p>
              <strong>CGPA:</strong>{' '}
              {selectedStudent.profile?.cgpa ?? '-'}
            </p>

            <p>
              <strong>Skills:</strong>{' '}
              {selectedStudent.profile?.skills?.length
                ? selectedStudent.profile.skills.join(', ')
                : '-'}
            </p>

          </div>

          {/* Applications */}

          <div className="mt-6">

            <h4 className="text-lg font-semibold mb-3">
              Applications
            </h4>

            {getStudentApplications(
              selectedStudent._id
            ).length === 0 ? (
              <p className="text-gray-500">
                This student has not applied to any job.
              </p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm border">

                  <thead className="bg-gray-50">

                    <tr>
                      <th className="border px-3 py-2 text-left">
                        Company
                      </th>

                      <th className="border px-3 py-2 text-left">
                        Job
                      </th>

                      <th className="border px-3 py-2 text-left">
                        Status
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {getStudentApplications(
                      selectedStudent._id
                    ).map((application) => (

                      <tr key={application._id}>

                        <td className="border px-3 py-2">
                          {application.job?.company ||
                            application.company ||
                            '-'}
                        </td>

                        <td className="border px-3 py-2">
                          {application.job?.title ||
                            application.jobTitle ||
                            '-'}
                        </td>

                        <td className="border px-3 py-2">
                          <span className="font-medium">
                            {application.status || 'Pending'}
                          </span>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default StudentsTab;