import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { vehicleService } from '../../services/vehicleService';
import './Dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch vehicles
      const vehiclesResult = await vehicleService.getAll();
      if (vehiclesResult.success) {
        setVehicles(vehiclesResult.data);
      }

      // Fetch all appointments
      const appointmentsResult = await dashboardService.getAllAppointments();
      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.data);
      } else {
        setError(appointmentsResult.message);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = async (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
    
    if (vehicleId === 'all') {
      const result = await dashboardService.getAllAppointments();
      if (result.success) {
        setAppointments(result.data);
      }
    } else {
      const result = await dashboardService.getDashboardForVehicle(vehicleId);
      if (result.success) {
        setAppointments(result.data);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'PENDING': 'badge-pending',
      'CONFIRMED': 'badge-confirmed',
      'IN_PROGRESS': 'badge-in-progress',
      'COMPLETED': 'badge-completed',
      'CANCELLED': 'badge-cancelled'
    };
    return statusMap[status] || 'badge-default';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Service Dashboard</h1>
        <p>View your service appointments and track progress</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-filters">
        <div className="filter-group">
          <label htmlFor="vehicle-filter">Filter by Vehicle:</label>
          <select 
            id="vehicle-filter"
            value={selectedVehicle} 
            onChange={handleVehicleChange}
            className="vehicle-select"
          >
            <option value="all">All Vehicles</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                {vehicle.vehicleName} ({vehicle.registrationNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Appointments ({appointments.length})</h2>
        
        {appointments.length === 0 ? (
          <div className="no-data">
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.appointmentId}>
                    <td>#{appointment.appointmentId}</td>
                    <td>{appointment.vehicleName}</td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>
                      {appointment.startTime} - {appointment.endTime}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
