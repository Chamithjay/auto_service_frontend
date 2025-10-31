import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import './VehicleForm.css';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    vehicleName: '',
    registrationNo: '',
    vehicleType: 'CAR',
    model: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await vehicleService.getById(id);
      if (result.success) {
        setFormData({
          vehicleName: result.data.vehicleName,
          registrationNo: result.data.registrationNo,
          vehicleType: result.data.vehicleType,
          model: result.data.model || ''
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let result;
      if (isEditMode) {
        result = await vehicleService.update(id, formData);
      } else {
        result = await vehicleService.create(formData);
      }

      if (result.success) {
        navigate('/vehicles');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} vehicle`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="vehicle-form-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="vehicle-form-container">
      <div className="form-header">
        <Link to="/vehicles" className="btn-back">← Back to Vehicles</Link>
        <h1>{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vehicleName">
              Vehicle Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="vehicleName"
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleChange}
              placeholder="e.g., Toyota Camry"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationNo">
              Registration Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="registrationNo"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              placeholder="e.g., ABC-1234"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleType">
              Vehicle Type <span className="required">*</span>
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="TRUCK">Truck</option>
              <option value="VAN">Van</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="model">Model (Optional)</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., 2020"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={saving}
              className="btn-submit"
            >
              {saving ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Add Vehicle')}
            </button>
            <Link to="/vehicles" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
