import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// --- Public Pages (Common to both files) ---
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetInitialPassword from "./pages/ResetInitialPassword";
import PasswordChanged from "./pages/PasswordChanged";

// --- Employee Pages (From File 1) ---
// Note: I'm assuming the paths based on File 1's structure
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AppointmentBooking from "./pages/Employee/AppointmentBooking";
import AppointmentHistory from "./pages/Employee/AppointmentHistory";
import AppointmentJobDetailsPage from "./pages/Employee/AppointmentJobDetails";
import RequestLeave from "./pages/Employee/RequestLeave";

// --- Admin Layout (From File 2) ---
import AdminLayout from "./components/admin/AdminLayout";

// --- Admin Pages (Combined from both files) ---
// Note: I've assumed all admin pages live in './pages/admin/' for consistency
import AdminDashboard from "./pages/admin/AdminDashboard";

// (File 1's routes, now added to the layout)
import CustomersVehicles from "./pages/admin/CustomersVehicles";
import LeaveRequests from "./pages/admin/LeaveRequests";
import AdminProfile from "./pages/admin/AdminProfile";

// (File 2's routes)
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminAddService from "./pages/admin/AdminAddService";
import AdminManageServices from "./pages/admin/AdminManageServices";
import AdminEditService from "./pages/admin/AdminEditService";
import AdminManageUsers from "./pages/admin/AdminManageUsers";
import AdminEditUser from "./pages/admin/AdminEditUser";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-initial-password" element={<ResetInitialPassword />} />
          <Route path="/password-changed" element={<PasswordChanged />} />

          
          {/* === Admin Routes with Layout === */}
          
          <Route
            path="/reset-initial-password"
            element={<ResetInitialPassword />}
          />
          <Route path="/password-changed" element={<PasswordChanged />} />

          {/* === Employee Routes === */}
          {/* These are from File 1. They remain separate for now. */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
