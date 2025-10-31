import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

// --- ADD YOUR NEW IMPORTS ---
import AdminLayout from "./components/AdminLayout";
import AdminAddUser from "./pages/AdminAddUser";
import AdminAddService from "./pages/AdminAddService";
import AdminManageServices from "./pages/AdminManageServices"; // New
import AdminEditService from "./pages/AdminEditService"; // New
import AdminManageUsers from "./pages/AdminManageUsers"; // New
import AdminEditUser from "./pages/AdminEditUser"; // New
// import AdminReports from "./pages/AdminReports";      // For later

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Employee Route */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

          {/* --- YOUR ADMIN ROUTES (NESTED) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Service Routes */}
            <Route path="services" element={<AdminManageServices />} />
            <Route path="add-service" element={<AdminAddService />} />
            <Route path="service/edit/:id" element={<AdminEditService />} />

            {/* User Routes */}
            <Route path="users" element={<AdminManageUsers />} />
            <Route path="add-user" element={<AdminAddUser />} />
            <Route path="user/edit/:id" element={<AdminEditUser />} />

            {/* <Route path="reports" element={<AdminReports />} /> */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
