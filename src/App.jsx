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
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import Services from "./pages/admin/Services";
import CustomersVehicles from "./pages/admin/CustomersVehicles";
import LeaveRequests from "./pages/admin/LeaveRequests";
import AdminProfile from "./pages/admin/AdminProfile";

// Employee Pages (placeholder for now)
import EmployeeDashboard from "./pages/EmployeeDashboard";

// Customer Pages
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import Vehicles from "./pages/Customer/Vehicles";
import VehicleForm from "./pages/Customer/VehicleForm";
import AppointmentProgress from "./pages/Customer/AppointmentProgress";

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

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Employees /></ProtectedRoute>} />
                    <Route path="/admin/services" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Services /></ProtectedRoute>} />
                    <Route path="/admin/customers-vehicles" element={<ProtectedRoute allowedRoles={["ADMIN"]}><CustomersVehicles /></ProtectedRoute>} />
                    <Route path="/admin/leave-requests" element={<ProtectedRoute allowedRoles={["ADMIN"]}><LeaveRequests /></ProtectedRoute>} />
                    <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminProfile /></ProtectedRoute>} />

                    {/* Employee Routes */}
                    <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}><EmployeeDashboard /></ProtectedRoute>} />

                    {/* Customer Routes */}
                    <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><CustomerDashboard /></ProtectedRoute>} />
                    <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><CustomerProfile /></ProtectedRoute>} />
                    <Route path="/customer/vehicles" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><Vehicles /></ProtectedRoute>} />
                    <Route path="/customer/vehicles/add" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><VehicleForm /></ProtectedRoute>} />
                    <Route path="/customer/vehicles/edit/:id" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><VehicleForm /></ProtectedRoute>} />
                    <Route path="/customer/appointments/:id" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><AppointmentProgress /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;