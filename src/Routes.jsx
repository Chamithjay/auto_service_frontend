// App.jsx - Route Configuration Example
// Add these routes to your existing routing setup

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import existing components
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

// Import customer module components
import CustomerDashboard from './pages/CustomerDashboard';
import AppointmentProgress from './pages/AppointmentProgress';
import Vehicles from './pages/Vehicles';
import VehicleForm from './pages/VehicleForm';
import CustomerProfile from './pages/CustomerProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

        {/* Customer module routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/appointments/:id" element={<AppointmentProgress />} />
        <Route path="/customer/vehicles" element={<Vehicles />} />
        <Route path="/customer/vehicles/add" element={<VehicleForm />} />
        <Route path="/customer/vehicles/edit/:id" element={<VehicleForm />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        {/* Default redirect */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;