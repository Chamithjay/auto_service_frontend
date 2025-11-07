import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../api/Api';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
  const employeeId = 5;

  const [dashboardData, setDashboardData] = useState({
    todayAssignments: [],
    upcomingAssignments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Statistics calculation
  const stats = useMemo(() => {
    const allAssignments = [
      ...dashboardData.todayAssignments,
      ...dashboardData.upcomingAssignments
    ];
    
    return {
      total: allAssignments.length,
      completed: allAssignments.filter(a => a.jobStatus === 'COMPLETED').length,
      inProgress: allAssignments.filter(a => a.jobStatus === 'ONGOING').length,
      pending: allAssignments.filter(a => a.jobStatus === 'NEW').length,
      today: dashboardData.todayAssignments.length
    };
  }, [dashboardData]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    const assignments = activeTab === 'today' 
      ? dashboardData.todayAssignments 
      : dashboardData.upcomingAssignments;

    return assignments.filter(assignment => {
      const matchesSearch = assignment.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.vehicleInfo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || assignment.jobStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [dashboardData, activeTab, searchTerm, statusFilter]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        
        const [profileResponse, dashboardResponse] = await Promise.all([
          employeeAPI.getProfile(employeeId),
          employeeAPI.getDashboard(employeeId)
        ]);
        
        setEmployee(profileResponse.data);
        setDashboardData(dashboardResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    initializeDashboard();

    // Auto-refresh
    const interval = setInterval(initializeDashboard, refreshInterval);
    return () => clearInterval(interval);
  }, [employeeId, refreshInterval]);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (err) {
      return timeString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: { class: 'new', label: 'New' },
      ONGOING: { class: 'ongoing', label: 'In Progress' },
      COMPLETED: { class: 'completed', label: 'Completed' }
    };
    
    const config = statusConfig[status] || { class: 'default', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getPriorityBadge = (assignment) => {
    // Simple priority calculation based on time and status
    const now = new Date();
    const assignmentDate = new Date(assignment.appointmentDate);
    const isToday = assignmentDate.toDateString() === now.toDateString();
    const isUrgent = isToday && assignment.jobStatus === 'NEW';
    
    if (isUrgent) {
      return <span className="priority-badge urgent">URGENT</span>;
    }
    return null;
  };

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      // Here you would call your API to update the status
      console.log(`Updating assignment ${assignmentId} to ${newStatus}`);
      // await employeeAPI.updateAssignmentStatus(assignmentId, newStatus);
      
      // Optimistic update
      setDashboardData(prev => ({
        ...prev,
        todayAssignments: prev.todayAssignments.map(assignment =>
          assignment.assignmentId === assignmentId
            ? { ...assignment, jobStatus: newStatus }
            : assignment
        ),
        upcomingAssignments: prev.upcomingAssignments.map(assignment =>
          assignment.assignmentId === assignmentId
            ? { ...assignment, jobStatus: newStatus }
            : assignment
        )
      }));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRefresh} className="btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('/employee/profile')} className="btn-secondary">
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-main">
          <div className="header-title">
            <h1>Service Dashboard</h1>
            {employee && (
              <div className="employee-info">
                <span className="welcome-text">Welcome back,</span>
                <span className="employee-name">{employee.username}</span>
                <span className="employee-role">{employee.position}</span>
              </div>
            )}
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/employee/profile')}
              className="btn-profile"
            >
              <span className="icon">👤</span>
              My Profile
            </button>
            <div className="last-updated">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Overview */}
      <section className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Assignments</div>
            </div>
          </div>
          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.today}</div>
              <div className="stat-label">Today's Tasks</div>
            </div>
          </div>
          <div className="stat-card progress">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-header">
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'today' ? 'active' : ''}`}
              onClick={() => setActiveTab('today')}
            >
              Today's Assignments ({dashboardData.todayAssignments.length})
            </button>
            <button 
              className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({dashboardData.upcomingAssignments.length})
            </button>
          </div>
          
          <div className="controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="ONGOING">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="assignments-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No assignments found</h3>
              <p>
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filters'
                  : 'No assignments scheduled for this period'
                }
              </p>
            </div>
          ) : (
            <div className="assignments-grid">
              {filteredAssignments.map(assignment => (
                <div key={assignment.assignmentId} className="assignment-card">
                  <div className="card-header">
                    <div className="assignment-title">
                      <h3>{assignment.serviceName}</h3>
                      {getPriorityBadge(assignment)}
                    </div>
                    <div className="assignment-meta">
                      {getStatusBadge(assignment.jobStatus)}
                      <div className="assignment-time">
                        {formatTime(assignment.startTime)} - {formatTime(assignment.endTime)}
                      </div>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="customer-info">
                      <div className="info-item">
                        <span className="label">Customer:</span>
                        <span className="value">{assignment.customerName}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Vehicle:</span>
                        <span className="value">{assignment.vehicleInfo}</span>
                      </div>
                      {assignment.appointmentDate && (
                        <div className="info-item">
                          <span className="label">Date:</span>
                          <span className="value">
                            {new Date(assignment.appointmentDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {assignment.jobNote && (
                      <div className="notes-section">
                        <span className="notes-label">Notes:</span>
                        <p className="notes-content">{assignment.jobNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-action primary"
                      onClick={() => handleStatusUpdate(assignment.assignmentId, 'ONGOING')}
                      disabled={assignment.jobStatus === 'ONGOING'}
                    >
                      Start Work
                    </button>
                    <button 
                      className="btn-action success"
                      onClick={() => handleStatusUpdate(assignment.assignmentId, 'COMPLETED')}
                      disabled={assignment.jobStatus === 'COMPLETED'}
                    >
                      Mark Complete
                    </button>
                    <button className="btn-action secondary">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Quick Actions Footer */}
      <footer className="dashboard-footer">
        <div className="quick-actions">
          <button className="quick-action-btn">
            <span className="action-icon">📋</span>
            Daily Report
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">🔄</span>
            Refresh Data
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">📧</span>
            Message Team
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;