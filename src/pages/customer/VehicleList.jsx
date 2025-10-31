import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import './VehicleList.css';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await vehicleService.getAll();
      if (result.success) {
        setVehicles(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, vehicleName) => {
    if (window.confirm(`Are you sure you want to delete ${vehicleName}?`)) {
      const result = await vehicleService.delete(id);
      if (result.success) {
        fetchVehicles();
      } else {
        alert(result.message);
      }
    }
  };

  const getVehicleIcon = (type) => {
    const icons = {
      'CAR': '🚗',
      'BIKE': '🏍️',
      'TRUCK': '🚚',
      'VAN': '🚐',
      'SUV': '🚙'
    };
    return icons[type] || '🚗';
  };

  if (loading) {
    return (
      <div className="vehicle-list-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="vehicle-list-container">
      <div className="vehicle-list-header">
        <div>
          <h1>My Vehicles</h1>
          <p>Manage your registered vehicles</p>
        </div>
        <Link to="/vehicles/add" className="btn-add">
          + Add Vehicle
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {vehicles.length === 0 ? (
        <div className="no-vehicles">
          <p>No vehicles registered yet</p>
          <Link to="/vehicles/add" className="btn-primary">
            Add Your First Vehicle
          </Link>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map(vehicle => (
            <div key={vehicle.vehicleId} className="vehicle-card">
              <div className="vehicle-icon">
                {getVehicleIcon(vehicle.vehicleType)}
              </div>
              <div className="vehicle-info">
                <h3>{vehicle.vehicleName}</h3>
                <p className="registration-no">{vehicle.registrationNo}</p>
                <div className="vehicle-details">
                  <span className="vehicle-type">{vehicle.vehicleType}</span>
                  {vehicle.model && <span className="vehicle-model">{vehicle.model}</span>}
                </div>
              </div>
              <div className="vehicle-actions">
                <button
                  onClick={() => navigate(`/vehicles/${vehicle.vehicleId}`)}
                  className="btn-view"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/vehicles/edit/${vehicle.vehicleId}`)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle.vehicleId, vehicle.vehicleName)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
