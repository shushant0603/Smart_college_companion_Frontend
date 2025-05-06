import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import Notes from './pages/Notes';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/timetable" element={<PrivateRoute><Timetable /></PrivateRoute>} />
            <Route path="/assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
