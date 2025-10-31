import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import './VehicleDetails.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await vehicleService.getById(id);
      if (result.success) {
        setVehicle(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.vehicleName}?`)) {
      const result = await vehicleService.delete(id);
      if (result.success) {
        navigate('/vehicles');
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
      <div className="vehicle-details-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="vehicle-details-container">
        <div className="error-message">{error || 'Vehicle not found'}</div>
        <Link to="/vehicles" className="btn-back">← Back to Vehicles</Link>
      </div>
    );
  }

  return (
    <div className="vehicle-details-container">
      <div className="details-header">
        <Link to="/vehicles" className="btn-back">← Back to Vehicles</Link>
        <h1>Vehicle Details</h1>
      </div>

      <div className="vehicle-details-card">
        <div className="vehicle-icon-large">
          {getVehicleIcon(vehicle.vehicleType)}
        </div>

        <div className="details-content">
          <div className="detail-row">
            <span className="detail-label">Vehicle Name</span>
            <span className="detail-value">{vehicle.vehicleName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Registration Number</span>
            <span className="detail-value registration-highlight">{vehicle.registrationNo}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Vehicle Type</span>
            <span className="detail-value">
              <span className="type-badge">{vehicle.vehicleType}</span>
            </span>
          </div>

          {vehicle.model && (
            <div className="detail-row">
              <span className="detail-label">Model</span>
              <span className="detail-value">{vehicle.model}</span>
            </div>
          )}

          <div className="detail-actions">
            <button
              onClick={() => navigate(`/vehicles/edit/${vehicle.vehicleId}`)}
              className="btn-edit-large"
            >
              Edit Vehicle
            </button>
            <button
              onClick={handleDelete}
              className="btn-delete-large"
            >
              Delete Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
