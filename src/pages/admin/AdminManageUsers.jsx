import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../api/Api";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#14274E] mb-8">
        Employee Management
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#14274E]">All Employees</h2>
          <Link
            to="/admin/add-employee"
            className="px-6 py-2.5 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add Employee</span>
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F1F6F9]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#14274E]">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${user.role === "ADMIN" ? "bg-red-100 text-red-800" : ""}
                    ${
                      user.role === "EMPLOYEE"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                    ${
                      user.role === "CUSTOMER"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  `}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link
                      to={`/admin/employee/edit/${user.id}`}
                      className="text-[#394867] hover:text-[#14274E]"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;
