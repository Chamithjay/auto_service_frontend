import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../api/Api";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import FormSelect from "../components/FormSelect";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "EMPLOYEE",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setMessage(`Error: Failed to fetch user data.`);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Note: This API call should *not* send a password
      await updateUser(id, formData);
      setMessage("Success! User updated.");
      navigate("/admin/users"); // Go back to the list
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Failed to update"}`
      );
    }
  };

  if (loading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-[#14274E] mb-6">Edit User</h1>
      <p className="text-primary-light mb-8">
        Update details for user: {formData.username}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Username"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormSelect
          label="User Role"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="ADMIN">Admin</option>
        </FormSelect>

        <div className="pt-4">
          <FormButton type="submit">Save Changes</FormButton>
        </div>
      </form>

      {message && (
        <p className="mt-6 text-center text-sm font-medium text-[#14274E]">
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminEditUser;
