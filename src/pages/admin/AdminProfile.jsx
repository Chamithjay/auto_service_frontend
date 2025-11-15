import { useState, useEffect, useRef } from "react";
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
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
          My Profile
        </h1>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className="flex-shrink-0 px-4 sm:px-6 pb-3">
          <div
            className={`p-3 rounded-xl border text-sm ${
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
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 pb-4 min-h-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Profile Image */}
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#14274E]"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-[#14274E] to-[#394867] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#394867] hover:bg-[#14274E] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-[#14274E] mt-3 mb-1">
                  {user.username}
                </h2>
                <p className="text-sm text-[#9BA4B4] mb-2 truncate">
                  {user.email}
                </p>
                <span className="inline-block px-3 py-1 bg-[#394867] text-white text-xs font-semibold rounded-full">
                  {user.role}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-4">
                {!isEditing && !isChangingPassword && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full px-4 py-2 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full px-4 py-2 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Change Password
                    </button>
                  </>
                )}
                {(isEditing || isChangingPassword) && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setIsChangingPassword(false);
                      handleCancelEdit();
                      handleCancelPasswordChange();
                    }}
                    className="w-full px-4 py-2 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-0">
            {/* Tabs */}
            <div className="flex-shrink-0 flex border-b-2 border-gray-100">
              <label className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 cursor-pointer transition-all duration-200">
                <input
                  type="radio"
                  name="tab"
                  value="personal"
                  checked={activeTab === "personal"}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="hidden peer"
                />
                <span className="text-sm sm:text-base font-semibold text-gray-500 peer-checked:text-[#14274E] peer-checked:border-b-4 peer-checked:border-[#14274E] pb-3 peer-checked:pb-2.5">
                  Personal Information
                </span>
              </label>
              <label className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 cursor-pointer transition-all duration-200">
                <input
                  type="radio"
                  name="tab"
                  value="password"
                  checked={activeTab === "password"}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="hidden peer"
                />
                <span className="text-sm sm:text-base font-semibold text-gray-500 peer-checked:text-[#14274E] peer-checked:border-b-4 peer-checked:border-[#14274E] pb-3 peer-checked:pb-2.5">
                  Password Settings
                </span>
              </label>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div>
                  <h3 className="text-xl font-bold text-[#14274E] mb-4">
                    Profile Details
                  </h3>

                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Username
                        </label>
                        <div className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#14274E] font-medium">
                          {user.username}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Email
                        </label>
                        <div className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#14274E] font-medium">
                          {user.email}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Role
                        </label>
                        <div className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#14274E] font-medium uppercase">
                          {user.role}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                            Created At
                          </label>
                          <div className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#14274E] text-sm">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                            Last Updated
                          </label>
                          <div className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#14274E] text-sm">
                            {user.updated_at
                              ? new Date(user.updated_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border-2 ${
                            errors.username
                              ? "border-red-400"
                              : "border-gray-200"
                          } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent`}
                        />
                        {errors.username && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.username}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border-2 ${
                            errors.email ? "border-red-400" : "border-gray-200"
                          } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`flex-1 px-4 py-2 ${
                            loading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#394867] hover:bg-[#14274E]"
                          } text-white rounded-lg font-semibold transition-all duration-200 text-sm`}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 text-[#394867] hover:bg-gray-50 rounded-lg font-semibold transition-all duration-200 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Password Settings Tab */}
              {activeTab === "password" && (
                <div>
                  <h3 className="text-xl font-bold text-[#14274E] mb-4">
                    Password Management
                  </h3>

                  {!isChangingPassword ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#14274E] to-[#394867] rounded-full mb-4">
                        <svg
                          className="w-10 h-10 text-white"
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
                      </div>
                      <p className="text-lg font-semibold text-[#14274E] mb-2">
                        Your password is secure
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Click the button in the sidebar to update your password
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 border-2 ${
                            errors.currentPassword
                              ? "border-red-400"
                              : "border-gray-200"
                          } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent`}
                          placeholder="Enter current password"
                        />
                        {errors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 border-2 ${
                            errors.newPassword
                              ? "border-red-400"
                              : "border-gray-200"
                          } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent`}
                          placeholder="Enter new password"
                        />
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#9BA4B4] mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 border-2 ${
                            errors.confirmPassword
                              ? "border-red-400"
                              : "border-gray-200"
                          } rounded-lg text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent`}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mt-4">
                        <h4 className="text-sm font-semibold text-[#14274E] mb-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Password Requirements
                        </h4>
                        <ul className="text-sm text-[#394867] space-y-1">
                          <li className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2 text-green-600"
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
                              className="w-4 h-4 mr-2 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Different from current password
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`flex-1 px-4 py-2 ${
                            loading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#394867] hover:bg-[#14274E]"
                          } text-white rounded-lg font-semibold transition-all duration-200 text-sm`}
                        >
                          {loading ? "Changing..." : "Change Password"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelPasswordChange}
                          disabled={loading}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 text-[#394867] hover:bg-gray-50 rounded-lg font-semibold transition-all duration-200 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
