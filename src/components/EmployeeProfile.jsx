import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../api/Api';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const employeeId = 5;

  const [profile, setProfile] = useState({
    employeeId: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    department: "",
    phoneNumber: "",
    hireDate: "",
    salary: "",
    address: "",
    bio: "",
    skills: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState('https://img.icons8.com/?size=100&id=20749&format=png&color=000000');
  const [newSkill, setNewSkill] = useState('');

  // Statistics for profile
  const profileStats = {
    completedJobs: 45,
    customerRating: 4.8,
    yearsService: 2,
    ongoingProjects: 3
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getProfile(employeeId);
        const employeeData = response.data;
        
        // Transform backend data to match our frontend structure
        setProfile({
          employeeId: employeeData.employeeId || `EMP${employeeData.id}`,
          username: employeeData.username || '',
          firstName: employeeData.firstName || employeeData.username?.split('_')[0] || '',
          lastName: employeeData.lastName || employeeData.username?.split('_')[1] || '',
          email: employeeData.email || '',
          position: employeeData.position || 'Technician',
          department: employeeData.department || 'Service Department',
          phoneNumber: employeeData.phoneNumber || '',
          hireDate: employeeData.hireDate || '2023-01-15',
          salary: employeeData.salary ? `$${employeeData.salary.toLocaleString()}` : '$65,000',
          address: employeeData.address || '123 Main Street, City, State 12345',
          bio: employeeData.bio || `Experienced ${employeeData.position || 'technician'} with a passion for automotive excellence and customer satisfaction.`,
          skills: employeeData.skills || ['Oil Changes', 'Brake Service', 'Engine Diagnostics', 'Electrical Systems']
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare data for backend (remove formatting from salary)
      const updateData = {
        ...profile,
        phoneNumber: profile.phoneNumber,
        position: profile.position,
        department: profile.department
      };

      const response = await employeeAPI.updateProfile(employeeId, updateData);
      setProfile(response.data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data
    window.location.reload();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    const match = phoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfile(prev => ({ ...prev, phoneNumber: formatted }));
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner large"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="employee-profile">
      {/* Header */}
      <header className="profile-header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/employee/dashboard')}
            className="back-button"
          >
            ← Back to Dashboard
          </button>
          <div className="header-title">
            <h1>Employee Profile</h1>
            <p>Manage your personal and professional information</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          <span className="success-icon">✅</span>
          {successMessage}
        </div>
      )}

      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-section">
              <div className="avatar-container">
                <img 
                  src={profileImage} 
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="profile-avatar"
                />
                <button 
                  onClick={triggerFileInput}
                  className="avatar-edit-btn"
                  disabled={!isEditing}
                >
                  📷
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="avatar-info">
                <h2>{profile.firstName} {profile.lastName}</h2>
                <p className="employee-position">{profile.position}</p>
                <p className="employee-department">{profile.department}</p>
                <div className="employee-id">ID: {profile.employeeId}</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{profileStats.completedJobs}</div>
                <div className="stat-label">Jobs Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{profileStats.customerRating}</div>
                <div className="stat-label">Customer Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{profileStats.yearsService}</div>
                <div className="stat-label">Years Service</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{profileStats.ongoingProjects}</div>
                <div className="stat-label">Ongoing</div>
              </div>
            </div>

            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button 
                  className="action-btn success" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="skills-card">
            <h3>Skills & Expertise</h3>
            <div className="skills-list">
              {profile.skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="skill-remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="skill-input">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill..."
                  className="skill-input-field"
                />
                <button onClick={handleAddSkill} className="skill-add-btn">
                  Add
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          <div className="tabs-navigation">
            <button 
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button 
              className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
              onClick={() => setActiveTab('professional')}
            >
              Professional
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          <div className="tab-content">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handlePhoneChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-textarea"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={profile.position}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input
                      type="text"
                      value={profile.employeeId}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hire Date</label>
                    <input
                      type="text"
                      value={new Date(profile.hireDate).toLocaleDateString()}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input
                      type="text"
                      value={profile.salary}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      disabled
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="metrics-section">
                  <h4>Performance Metrics</h4>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value">{profileStats.completedJobs}</div>
                      <div className="metric-label">Total Jobs</div>
                      <div className="metric-trend positive">+12%</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{profileStats.customerRating}/5</div>
                      <div className="metric-label">Avg Rating</div>
                      <div className="metric-trend positive">+0.2</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">98%</div>
                      <div className="metric-label">On Time</div>
                      <div className="metric-trend positive">+3%</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">24h</div>
                      <div className="metric-label">Avg Completion</div>
                      <div className="metric-trend negative">-2h</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="form-section">
                <h3>Account Settings</h3>
                <div className="settings-grid">
                  <div className="setting-group">
                    <h4>Notification Preferences</h4>
                    <div className="setting-item">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        Email notifications
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        SMS alerts
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="checkbox-label">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        Push notifications
                      </label>
                    </div>
                  </div>

                  <div className="setting-group">
                    <h4>Privacy Settings</h4>
                    <div className="setting-item">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        Show profile to team members
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="checkbox-label">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        Allow contact via phone
                      </label>
                    </div>
                  </div>

                  <div className="setting-group danger-zone">
                    <h4>Danger Zone</h4>
                    <div className="danger-actions">
                      <button className="btn-danger">
                        Reset Password
                      </button>
                      <button className="btn-danger outline">
                        Deactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;