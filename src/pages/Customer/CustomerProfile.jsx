import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomerDashboardLayout from "../../components/Customer/CustomerDashboardLayout";
import { getCustomerProfile, updateCustomerProfile } from "../../api/endpoints";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImage, setProfileImage] = useState(
    "https://img.icons8.com/?size=100&id=20749&format=png&color=000000"
  );

  // Customer statistics
  const customerStats = {
    totalAppointments: 12,
    completedServices: 8,
    activeVehicles: 2,
    pendingAppointments: 1,
  };

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
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

  if (isLoading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex flex-col items-center justify-center p-16 text-gray-600">
          <div className="w-16 h-16 border-6 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-800 text-lg">Loading your profile...</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
            My Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg font-semibold bg-red-100 text-red-800 border border-red-200 mb-4">
            <span className="text-lg">⚠️</span>
            <span className="text-sm">{errors.general}</span>
            <button
              onClick={() => setErrors({})}
              className="ml-auto text-xl cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg font-semibold bg-green-100 text-green-800 border border-green-200 mb-4">
            <span className="text-lg">✅</span>
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 min-h-0">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="relative inline-block mb-3">
                  <img
                    src={profileImage}
                    alt={profile?.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 border-none rounded-full w-8 h-8 cursor-pointer text-sm hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isEditing}
                  >
                    📷
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {profile?.username}
                  </h2>
                  <p className="text-sm font-semibold text-indigo-500 mb-1">
                    Customer
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xl font-bold text-gray-800">
                    {customerStats.totalAppointments}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Bookings
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xl font-bold text-gray-800">
                    {customerStats.completedServices}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Completed
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xl font-bold text-gray-800">
                    {customerStats.activeVehicles}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Vehicles
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xl font-bold text-gray-800">
                    {customerStats.pendingAppointments}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Pending
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="px-4 py-2 bg-[#14274E] text-white rounded-lg text-sm font-semibold hover:bg-[#394867] transition-all shadow-md"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </button>
                {isEditing && (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-0">
            <div className="flex-shrink-0 flex bg-gray-50 border-b border-gray-200">
              <button
                className={`flex-1 px-4 sm:px-6 py-3 border-none text-sm font-semibold transition-all border-b-4 ${
                  activeTab === "personal"
                    ? "text-[#14274E] border-b-[#14274E] bg-white"
                    : "text-gray-600 border-b-transparent hover:text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
              <button
                className={`flex-1 px-4 sm:px-6 py-3 border-none text-sm font-semibold transition-all border-b-4 ${
                  activeTab === "settings"
                    ? "text-[#14274E] border-b-[#14274E] bg-white"
                    : "text-gray-600 border-b-transparent hover:text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold text-gray-700 text-sm">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                      />
                      {errors.username && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold text-gray-700 text-sm">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold text-gray-700 text-sm">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="(555) 123-4567"
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-gray-700 text-sm">
                          Account Created
                        </label>
                        <input
                          type="text"
                          value={profile?.createdAt || "N/A"}
                          disabled
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-gray-700 text-sm">
                          Last Updated
                        </label>
                        <input
                          type="text"
                          value={profile?.updatedAt || "N/A"}
                          disabled
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Settings
                  </h3>
                  <div className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-base font-semibold text-gray-800 mb-3">
                        Notification Preferences
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="hidden peer"
                          />
                          <span className="w-4 h-4 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                          Email notifications
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="hidden peer"
                          />
                          <span className="w-4 h-4 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                          SMS alerts for appointments
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input type="checkbox" className="hidden peer" />
                          <span className="w-4 h-4 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                          Push notifications
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-gray-800 mb-3">
                        Privacy Settings
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="hidden peer"
                          />
                          <span className="w-4 h-4 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                          Share vehicle details with service team
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input type="checkbox" className="hidden peer" />
                          <span className="w-4 h-4 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                          Allow contact via phone
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t-2 border-red-100">
                      <h4 className="text-base font-semibold text-red-600 mb-3">
                        Danger Zone
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all">
                          Reset Password
                        </button>
                        <button className="px-4 py-2 bg-transparent border-2 border-red-600 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-all">
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
    </CustomerDashboardLayout>
  );
};

export default CustomerProfile;
