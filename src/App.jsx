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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/appointment-jobs/1" element={<AppointmentJobDetailsPage />} />
          <Route path="/request-leave"  element={<RequestLeave />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
