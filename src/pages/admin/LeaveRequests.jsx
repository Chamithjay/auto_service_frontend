import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Toast from '../../components/Toast';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'leaveDate', direction: 'desc' });

  // Get admin ID from localStorage
  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    filterAndSortLeaves();
  }, [statusFilter, leaves, sortConfig]);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:9091/api/leaves');
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      showToast('Failed to fetch leave requests', 'error');
      setLoading(false);
    }
  };

  const filterAndSortLeaves = () => {
    let filtered = [...leaves];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(leave => leave.leaveStatus === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle dates
      if (sortConfig.key === 'leaveDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredLeaves(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // const handleStatusUpdate = async (leaveId, newStatus) => {
  //   try {
  //     const endpoint = newStatus === 'APPROVED' ? 'approve' : 'reject';
  //     await axios.put(
  //       `http://localhost:9091/api/leaves/${leaveId}/${endpoint}?adminId=${adminId}`
  //     );
  //     fetchLeaves();
  //     showToast(`Leave request ${newStatus.toLowerCase()} successfully`, 'success');
  //   } catch (error) {
  //     console.error('Error updating leave status:', error);
  //     showToast(`Failed to ${newStatus.toLowerCase()} leave request`, 'error');
  //   }
  // };
const handleStatusUpdate = async (leaveId, newStatus) => {
  try {
    const admin = JSON.parse(localStorage.getItem("user")); // get logged-in user
    const adminId = admin ? admin.id : null;

    if (!adminId) {
      console.error("Admin ID not found. Cannot update leave.");
      showToast("You are not logged in as an admin", "error");
      return;
    }

    const endpoint = newStatus === "APPROVED" ? "approve" : "reject";

    await axios.put(
      `http://localhost:9091/api/leaves/${leaveId}/${endpoint}?adminId=${adminId}`
    );

    fetchLeaves(); // refresh the leave list
    showToast(`Leave request ${newStatus.toLowerCase()} successfully`, "success");
  } catch (error) {
    console.error("Error updating leave status:", error);
    showToast(`Failed to ${newStatus.toLowerCase()} leave request`, "error");
  }
};

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLeaveTypeDisplay = (type) => {
    switch (type) {
      case 'HALFDAY_MORNING':
        return 'Half Day (Morning)';
      case 'HALFDAY_EVENING':
        return 'Half Day (Evening)';
      case 'FULLDAY':
        return 'Full Day';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#14274E]">Leave Requests</h1>
        <div className="flex items-center space-x-4">
          <label className="text-gray-600">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Requests</option>
            <option value="NEW">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employe')}
                >
                  Employee
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('leaveType')}
                >
                  Leave Type
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('leaveDate')}
                >
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('leaveStatus')}
                >
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.map((leave) => (
                <tr key={leave.leaveId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getLeaveTypeDisplay(leave.leaveType)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(leave.leaveDate), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{leave.leaveReason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(leave.leaveStatus)}`}>
                      {leave.leaveStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {leave.leaveStatus === 'NEW' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(leave.leaveId, 'APPROVED')}
                          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(leave.leaveId, 'REJECTED')}
                          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeaves.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No leave requests found</p>
        </div>
      )}

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </div>
  );
};

export default LeaveRequests;
