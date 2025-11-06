import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Layout provided by route-level AdminLayout in App.jsx
import API from "../../api/Api";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("profile");
      setUser(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        type: "error",
        text: "Failed to load profile data",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await API.put("profile", formData);

      // Check if username was changed
      const usernameChanged = user.username !== response.data.username;

      setUser(response.data);

      // Update localStorage with new user data
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...storedUser,
        username: response.data.username,
        email: response.data.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);

      if (usernameChanged) {
        // If username changed, force re-login
        setMessage({
          type: "success",
          text: "Profile updated successfully! Please login again with your new username.",
        });

        // Wait 2 seconds then logout
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 2000);
      } else {
        // Only email changed, no need to logout
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });

        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage({
          type: "error",
          text: error.response.data.error || "Failed to update profile",
        });
      } else {
        setMessage({
          type: "error",
          text: "Network error. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.put("profile/change-password", passwordData);

      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage({
          type: "error",
          text: error.response.data.error || "Failed to change password",
        });
      } else {
        setMessage({
          type: "error",
          text: "Network error. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: user.username,
      email: user.email,
    });
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#14274E] mb-8">My Profile</h1>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-semibold">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#14274E] to-[#394867] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#14274E] mb-2">
              {user.username}
            </h2>
            <p className="text-[#9BA4B4] mb-1">{user.email}</p>
            <span className="inline-block px-3 py-1 bg-[#394867] text-white text-sm font-semibold rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#14274E]">
                Profile Information
              </h2>
              {!isEditing && !isChangingPassword && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Username
                  </label>
                  <div className="w-full px-4 py-3 border border-[#9BA4B4]/30 rounded-lg bg-[#F1F6F9] text-[#14274E] font-medium">
                    {user.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Email
                  </label>
                  <div className="w-full px-4 py-3 border border-[#9BA4B4]/30 rounded-lg bg-[#F1F6F9] text-[#14274E] font-medium">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Role
                  </label>
                  <div className="w-full px-4 py-3 border border-[#9BA4B4]/30 rounded-lg bg-[#F1F6F9] text-[#14274E] font-medium">
                    {user.role}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      errors.username ? "border-red-400" : "border-[#9BA4B4]/30"
                    } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867]`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-400" : "border-[#9BA4B4]/30"
                    } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867]`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-6 py-3 ${
                      loading
                        ? "bg-[#9BA4B4] cursor-not-allowed"
                        : "bg-[#394867] hover:bg-[#14274E]"
                    } text-white rounded-lg font-semibold transition-all duration-200`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border-2 border-[#9BA4B4] text-[#394867] hover:bg-[#F1F6F9] rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#14274E]">
                Password Settings
              </h2>
              {!isChangingPassword && !isEditing && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  <span>Change Password</span>
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <div className="text-center py-8 text-[#9BA4B4]">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-[#9BA4B4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="font-semibold">Your password is secure</p>
                <p className="text-sm mt-2">
                  Click "Change Password" to update your password
                </p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${
                      errors.currentPassword
                        ? "border-red-400"
                        : "border-[#9BA4B4]/30"
                    } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867]`}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${
                      errors.newPassword
                        ? "border-red-400"
                        : "border-[#9BA4B4]/30"
                    } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867]`}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#9BA4B4] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-400"
                        : "border-[#9BA4B4]/30"
                    } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867]`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="bg-[#F1F6F9] border border-[#9BA4B4]/30 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-semibold text-[#14274E] mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-sm text-[#394867] space-y-1">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      At least 6 characters long
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Must be different from current password
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-6 py-3 ${
                      loading
                        ? "bg-[#9BA4B4] cursor-not-allowed"
                        : "bg-[#394867] hover:bg-[#14274E]"
                    } text-white rounded-lg font-semibold transition-all duration-200`}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border-2 border-[#9BA4B4] text-[#394867] hover:bg-[#F1F6F9] rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
