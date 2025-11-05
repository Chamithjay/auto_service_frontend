import { useState } from "react";
// Import from your team's Api.jsx file
import { createUser } from "../../api/Api";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // This will now use the token from localStorage automatically
    try {
      const response = await createUser(formData);
      setMessage(`Success! User "${response.data.username}" created.`);
      setFormData({ username: "", email: "", password: "", role: "EMPLOYEE" }); // Clear form
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Failed to create user"}`
      );
    }
  };

  return (
    /* This container mimics the Login/Register card style */
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-[#14274E] mb-6">
        Create New User
      </h1>
      <p className="text-[#9BA4B4] mb-8">
        Create a new Employee or Admin account. The user will be required to
        reset their password on first login.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Username"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="e.g., jsmith"
          required
        />
        <FormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g., john.smith@autoservice.com"
          required
        />
        <FormInput
          label="Temporary Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
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
          <FormButton type="submit">Create User Account</FormButton>
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

export default AdminAddUser;
