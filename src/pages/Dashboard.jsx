import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignments: { total: 0, pending: 0 },
    attendance: { subjects: 0, lowAttendance: 0 },
    notes: { total: 0 },
    events: { upcoming: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch assignments stats
        const assignmentsRes = await fetch('http://localhost:5000/api/assignments', { headers });
        const assignments = await assignmentsRes.json();
        
        // Fetch attendance stats
        const attendanceRes = await fetch('http://localhost:5000/api/attendance', { headers });
        const attendance = await attendanceRes.json();
        
        // Fetch notes stats
        const notesRes = await fetch('http://localhost:5000/api/notes', { headers });
        const notes = await notesRes.json();
        
        // Fetch upcoming events
        const eventsRes = await fetch('http://localhost:5000/api/events/upcoming', { headers });
        const events = await eventsRes.json();

        setStats({
          assignments: {
            total: assignments.length,
            pending: assignments.filter(a => a.status === 'pending').length,
          },
          attendance: {
            subjects: attendance.length,
            lowAttendance: attendance.filter(a => a.percentage < 75).length,
          },
          notes: {
            total: notes.length,
          },
          events: {
            upcoming: events.length,
          },
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-gray-600">Here's your academic overview</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Assignments Card */}
        <Link
          to="/assignments"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Assignments
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.assignments.pending}/{stats.assignments.total}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">pending</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Attendance Card */}
        <Link
          to="/attendance"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Attendance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.attendance.lowAttendance}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      subjects below 75%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Notes Card */}
        <Link
          to="/notes"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Notes
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.notes.total}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">total notes</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Events Card */}
        <Link
          to="/events"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Events
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.events.upcoming}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">events</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 