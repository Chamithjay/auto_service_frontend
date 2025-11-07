import { useState, useEffect } from "react";
import CustomerDashboardLayout from "../../components/Customer/CustomerDashboardLayout";
import { getCustomerProfile, updateCustomerProfile } from "../../api/endpoints";

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await getCustomerProfile();
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setErrors({ general: "Failed to load profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = "Username must be between 3 and 50 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.phoneNumber &&
      (formData.phoneNumber.length < 9 || formData.phoneNumber.length > 20)
    ) {
      newErrors.phoneNumber =
        "Phone number must be between 9 and 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await updateCustomerProfile(formData);
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || "",
      });
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      // Update local storage with new username
      const userData = JSON.parse(localStorage.getItem("user"));
      userData.username = response.data.username;
      localStorage.setItem("user", JSON.stringify(userData));

      // Update token if a new one was provided (username was changed)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else {
        setErrors({ general: "Failed to update profile. Please try again." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: profile.username,
      email: profile.email,
      phoneNumber: profile.phoneNumber || "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  if (isLoading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#14274E]"></div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
            My Profile
          </h1>
          <p className="text-[#9BA4B4] mt-1">Manage your account information</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-800 font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 font-semibold">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#14274E] to-[#394867] p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-full">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.username}</h2>
                <p className="text-[#9BA4B4]">Customer Account</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#9BA4B4] mb-1">Username</p>
                    <p className="font-semibold text-[#14274E] text-lg">
                      {profile?.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#9BA4B4] mb-1">Email</p>
                    <p className="font-semibold text-[#14274E] text-lg">
                      {profile?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#9BA4B4] mb-1">Phone Number</p>
                    <p className="font-semibold text-[#14274E] text-lg">
                      {profile?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#9BA4B4] mb-1">Role</p>
                    <p className="font-semibold text-[#14274E] text-lg">
                      Customer
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#9BA4B4]/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#9BA4B4]">Account Created</p>
                      <p className="font-semibold text-[#14274E]">
                        {profile?.createdAt}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#9BA4B4]">Last Updated</p>
                      <p className="font-semibold text-[#14274E]">
                        {profile?.updatedAt}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#14274E] hover:bg-[#394867] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-[#14274E] mb-2"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 border ${
                      errors.username ? "border-red-400" : "border-[#9BA4B4]/30"
                    } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#14274E] mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 border ${
                      errors.email ? "border-red-400" : "border-[#9BA4B4]/30"
                    } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-[#14274E] mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 border ${
                      errors.phoneNumber
                        ? "border-red-400"
                        : "border-[#9BA4B4]/30"
                    } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-6 py-3 border-2 border-[#9BA4B4] text-[#394867] rounded-lg font-semibold hover:bg-[#F1F6F9] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center ${
                      isSaving
                        ? "bg-[#9BA4B4] cursor-not-allowed"
                        : "bg-gradient-to-r from-[#14274E] to-[#394867] hover:from-[#394867] hover:to-[#14274E] text-white"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
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
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerProfile;
