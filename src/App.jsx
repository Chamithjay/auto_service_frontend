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
import AppointmentJobDetailsPage from "./pages/Employee/AppointmentJobDetails";
import RequestLeave from "./pages/Employee/RequestLeave";

// --- Admin Layout (From File 2) ---
import AdminLayout from "./components/admin/AdminLayout";

// --- Admin Pages (Combined from both files) ---
// Note: I've assumed all admin pages live in './pages/admin/' for consistency
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";

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
          <Route
            path="/reset-initial-password"
            element={<ResetInitialPassword />}
          />
          <Route path="/password-changed" element={<PasswordChanged />} />

          {/* === Employee Routes === */}
          {/* These are from File 1. They remain separate for now. */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route
            path="/appointment-jobs/:id"
            element={<AppointmentJobDetailsPage />}
          />
          <Route path="/request-leave" element={<RequestLeave />} />

          {/* === Admin Routes (Using File 2's Nested Layout) === */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Routes from File 2 */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminManageServices />} />
            <Route path="add-service" element={<AdminAddService />} />
            <Route path="service/edit/:id" element={<AdminEditService />} />
            <Route path="employees" element={<AdminManageUsers />} />
            <Route path="add-employee" element={<AdminAddUser />} />
            <Route path="employee/edit/:id" element={<AdminEditUser />} />

            {/* Routes from File 1 (now nested) */}
            <Route path="customers-vehicles" element={<CustomersVehicles />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="profile" element={<AdminProfile />} />

            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
