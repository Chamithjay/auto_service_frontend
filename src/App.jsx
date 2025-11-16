import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// --- Public Pages ---
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetInitialPassword from "./pages/auth/ResetInitialPassword";
import PasswordChanged from "./pages/auth/PasswordChanged";

// --- ProtectedRoute ---
import ProtectedRoute from "./components/ProtectedRoute";

// --- Employee Layout + Pages ---
import EmployeeLayout from "./components/employee/EmployeeLayout";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import EmployeeProfile from "./components/employee/EmployeeProfile";
import RequestLeave from "./pages/Employee/RequestLeave";
import AppointmentJobDetailsPage from "./pages/Employee/AppointmentJobDetails";

// --- Customer Pages ---
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import Vehicles from "./pages/Customer/Vehicles";
import VehicleForm from "./pages/Customer/VehicleForm";
import AppointmentBooking from "./pages/Customer/AppointmentBooking";
import AppointmentHistory from "./pages/Customer/AppointmentHistory";
import AppointmentProgress from "./pages/Customer/AppointmentProgress";
import CustomerLayout from "./components/Customer/CustomerDashboardLayout";

// --- Admin Layout + Pages ---
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import CustomersVehicles from "./pages/admin/CustomersVehicles";
import LeaveRequests from "./pages/admin/LeaveRequests";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminAddService from "./pages/admin/AdminAddService";
import AdminManageServices from "./pages/admin/AdminManageServices";
import AdminEditService from "./pages/admin/AdminEditService";
import AdminManageUsers from "./pages/admin/AdminManageUsers";
import AdminEditUser from "./pages/admin/AdminEditUser";

function App() {
  return (
    <Router>
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

        {/* ================================================================================= */}
        {/* ============================= EMPLOYEE ROUTES ================================== */}
        {/* ================================================================================= */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="leave-requests" element={<RequestLeave />} />
          <Route
            path="appointment-jobs/:assignmentId"
            element={<AppointmentJobDetailsPage />}
          />
        </Route>

        {/* ================================================================================= */}
        {/* =============================== ADMIN ROUTES =================================== */}
        {/* ================================================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<AdminManageServices />} />
          <Route path="add-service" element={<AdminAddService />} />
          <Route path="service/edit/:id" element={<AdminEditService />} />
          <Route path="employees" element={<AdminManageUsers />} />
          <Route path="add-employee" element={<AdminAddUser />} />
          <Route path="employee/edit/:id" element={<AdminEditUser />} />

          <Route path="customers-vehicles" element={<CustomersVehicles />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* ================================================================================= */}
        {/* =============================== CUSTOMER ROUTES ================================ */}
        {/* ================================================================================= */}

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfile />} />

          {/* Vehicles */}
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/add" element={<VehicleForm />} />
          <Route path="vehicles/edit/:id" element={<VehicleForm />} />

          {/* Appointments */}
          <Route path="appointments/book" element={<AppointmentBooking />} />
          <Route path="appointments/history" element={<AppointmentHistory />} />
          <Route path="appointments/:id" element={<AppointmentProgress />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
