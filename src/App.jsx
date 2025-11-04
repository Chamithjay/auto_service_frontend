import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AppointmentJobDetailsPage from "./pages/Employee/AppointmentJobDetails";
import RequestLeave from "./pages/Employee/RequestLeave";
import ForgotPassword from "./pages/ForgotPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import Services from "./pages/admin/Services";
import CustomersVehicles from "./pages/admin/CustomersVehicles";
import LeaveRequests from "./pages/admin/LeaveRequests";
import AdminProfile from "./pages/admin/AdminProfile";

// Employee Pages (placeholder for now)
import EmployeeDashboard from "./pages/EmployeeDashboard";

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
                      
                    
                    <Route path="/appointment-jobs/1" element={<AppointmentJobDetailsPage />} />
                    <Route path="/request-leave"  element={<RequestLeave />} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/employees" element={<Employees />} />
                    <Route path="/admin/services" element={<Services />} />
                    <Route path="/admin/customers-vehicles" element={<CustomersVehicles />} />
                    <Route path="/admin/leave-requests" element={<LeaveRequests />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />

                    {/* Employee Routes */}
                    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;