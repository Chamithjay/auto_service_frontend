import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const LeaveRequest = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Assuming we get admin ID from auth context or local storage
  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(leaves.filter(leave => leave.leaveStatus === statusFilter));
    }
  }, [statusFilter, leaves]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9091/api/leaves');
      setLeaves(response.data);
      setFilteredLeaves(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leave requests');
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
      await axios.put(
        `http://localhost:9091/api/leaves/${leaveId}/${endpoint}?adminId=${adminId}`
      );
      fetchLeaves(); // Refresh the list
      setError(null);
    } catch (err) {
      setError(`Failed to ${status.toLowerCase()} leave request`);
      console.error('Error updating leave status:', err);
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

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Leave Requests Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="ALL">All</option>
          <option value="NEW">New</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b">Employee</th>
              <th className="px-6 py-3 border-b">Type</th>
              <th className="px-6 py-3 border-b">Date</th>
              <th className="px-6 py-3 border-b">Reason</th>
              <th className="px-6 py-3 border-b">Status</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave.leaveId} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">
                  {leave.employee?.firstName} {leave.employee?.lastName}
                </td>
                <td className="px-6 py-4 border-b">
                  {getLeaveTypeDisplay(leave.leaveType)}
                </td>
                <td className="px-6 py-4 border-b">
                  {format(new Date(leave.leaveDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 border-b">{leave.leaveReason}</td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`px-2 py-1 rounded ${
                      leave.leaveStatus === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : leave.leaveStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {leave.leaveStatus}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  {leave.leaveStatus === 'NEW' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(leave.leaveId, 'APPROVED')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(leave.leaveId, 'REJECTED')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

        {filteredLeaves.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No leave requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
