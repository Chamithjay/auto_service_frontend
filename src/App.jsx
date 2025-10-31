import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
// Customer pages
import Dashboard from "./pages/customer/Dashboard";
import Profile from "./pages/customer/Profile";
import VehicleList from "./pages/customer/VehicleList";
import VehicleDetails from "./pages/customer/VehicleDetails";
import VehicleForm from "./pages/customer/VehicleForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            
            {/* Customer Routes - Protected */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="vehicles" element={<VehicleList />} />
              <Route path="vehicles/add" element={<VehicleForm />} />
              <Route path="vehicles/edit/:id" element={<VehicleForm />} />
              <Route path="vehicles/:id" element={<VehicleDetails />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
