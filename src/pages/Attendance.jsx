import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    totalClasses: 0,
    attendedClasses: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAttendance(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance records');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add attendance record');
      }

      await fetchAttendance();
      setShowForm(false);
      setFormData({
        subject: '',
        totalClasses: 0,
        attendedClasses: 0,
      });
      toast.success('Attendance record added successfully');
    } catch (error) {
      console.error('Error adding attendance record:', error);
      toast.error('Failed to add attendance record');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete attendance record');
      }

      await fetchAttendance();
      toast.success('Attendance record deleted successfully');
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast.error('Failed to delete attendance record');
    }
  };

  const updateAttendance = async (id, attended) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/attendance/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attended }),
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      await fetchAttendance();
      toast.success('Attendance updated successfully');
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance');
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Classes</label>
              <input
                type="number"
                min="0"
                value={formData.totalClasses}
                onChange={(e) =>
                  setFormData({ ...formData, totalClasses: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attended Classes
              </label>
              <input
                type="number"
                min="0"
                max={formData.totalClasses}
                value={formData.attendedClasses}
                onChange={(e) =>
                  setFormData({ ...formData, attendedClasses: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Subject
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Attendance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Percentage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((record) => (
                <tr key={record._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.attendedClasses}/{record.totalClasses}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${getAttendanceColor(
                        record.percentage
                      )}`}
                    >
                      {record.percentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateAttendance(record._id, true)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => updateAttendance(record._id, false)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance; 