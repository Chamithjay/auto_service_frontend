import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeProfile from './components/EmployeeProfile';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Direct routes to employee pages - no login */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          
          {/* Default route goes straight to dashboard */}
          <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
          
          {/* Catch all other routes and redirect to dashboard */}
          <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;