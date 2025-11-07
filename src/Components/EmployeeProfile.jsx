import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { employeeAPI } from "../api/Api";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const employeeId = 5;

  const [profile, setProfile] = useState({
    employeeId: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    department: "",
    phoneNumber: "",
    hireDate: "",
    salary: "",
    address: "",
    bio: "",
    skills: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImage, setProfileImage] = useState(
    "https://img.icons8.com/?size=100&id=20749&format=png&color=000000"
  );
  const [newSkill, setNewSkill] = useState("");

  // Statistics for profile
  const profileStats = {
    completedJobs: 45,
    customerRating: 4.8,
    yearsService: 2,
    ongoingProjects: 3,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getProfile(employeeId);
        const employeeData = response.data;

        // Transform backend data to match our frontend structure
        setProfile({
          employeeId: employeeData.employeeId || `EMP${employeeData.id}`,
          username: employeeData.username || "",
          firstName:
            employeeData.firstName ||
            employeeData.username?.split("_")[0] ||
            "",
          lastName:
            employeeData.lastName || employeeData.username?.split("_")[1] || "",
          email: employeeData.email || "",
          position: employeeData.position || "Technician",
          department: employeeData.department || "Service Department",
          phoneNumber: employeeData.phoneNumber || "",
          hireDate: employeeData.hireDate || "2023-01-15",
          salary: employeeData.salary
            ? `$${employeeData.salary.toLocaleString()}`
            : "$65,000",
          address: employeeData.address || "123 Main Street, City, State 12345",
          bio:
            employeeData.bio ||
            `Experienced ${
              employeeData.position || "technician"
            } with a passion for automotive excellence and customer satisfaction.`,
          skills: employeeData.skills || [
            "Oil Changes",
            "Brake Service",
            "Engine Diagnostics",
            "Electrical Systems",
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare data for backend (remove formatting from salary)
      const updateData = {
        ...profile,
        phoneNumber: profile.phoneNumber,
        position: profile.position,
        department: profile.department,
      };

      const response = await employeeAPI.updateProfile(employeeId, updateData);
      setProfile(response.data);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data
    window.location.reload();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");
    const match = phoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2]
        ? match[1]
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfile((prev) => ({ ...prev, phoneNumber: formatted }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-600">
        <div className="w-16 h-16 border-6 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-800 text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-lg mb-6 px-8 py-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-[#14274E] hover:text-[#14274E] transition-all hover:-translate-x-1"
          >
            ← Back to Dashboard
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#14274E] m-0">
              Employee Profile
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Manage your personal and professional information
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 px-8 py-4 mb-4 rounded-lg font-semibold bg-red-100 text-red-800 border border-red-200">
          <span className="text-xl">⚠️</span>
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 px-8 py-4 mb-4 rounded-lg font-semibold bg-green-100 text-green-800 border border-green-200">
          <span className="text-xl">✅</span>
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <img
                  src={profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-1 right-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-none rounded-full w-9 h-9 cursor-pointer text-base hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-lg font-semibold text-indigo-500 mb-1">
                  {profile.position}
                </p>
                <p className="text-gray-600 mb-2">{profile.department}</p>
                <div className="text-sm text-gray-400 font-medium">
                  ID: {profile.employeeId}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {profileStats.completedJobs}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Jobs Completed
                </div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {profileStats.customerRating}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Customer Rating
                </div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {profileStats.yearsService}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Years Service
                </div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {profileStats.ongoingProjects}
                </div>
                <div className="text-xs text-gray-600 font-medium">Ongoing</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="px-6 py-3 bg-[#14274E] text-white rounded-lg font-semibold hover:bg-[#394867] hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
              {isEditing && (
                <button
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold text-[#14274E] mb-6">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition-all"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="bg-none border-none text-gray-600 cursor-pointer text-lg p-0 w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill..."
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white/90"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-3 bg-[#14274E] text-white rounded-lg font-semibold hover:bg-[#394867] transition-all"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex bg-gray-50 border-b border-gray-200">
            <button
              className={`flex-1 px-8 py-5 border-none font-semibold transition-all border-b-4 ${
                activeTab === "personal"
                  ? "text-[#14274E] border-b-[#14274E] bg-white"
                  : "text-gray-600 border-b-transparent hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Info
            </button>
            <button
              className={`flex-1 px-8 py-5 border-none font-semibold transition-all border-b-4 ${
                activeTab === "professional"
                  ? "text-[#14274E] border-b-[#14274E] bg-white"
                  : "text-gray-600 border-b-transparent hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("professional")}
            >
              Professional
            </button>
            <button
              className={`flex-1 px-8 py-5 border-none font-semibold transition-all border-b-4 ${
                activeTab === "settings"
                  ? "text-[#14274E] border-b-[#14274E] bg-white"
                  : "text-gray-600 border-b-transparent hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          <div className="p-8">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handlePhoneChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-y min-h-[80px]"
                      rows="3"
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-y min-h-[80px]"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === "professional" && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={profile.position}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={profile.employeeId}
                      disabled
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Hire Date
                    </label>
                    <input
                      type="text"
                      value={new Date(profile.hireDate).toLocaleDateString()}
                      disabled
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Salary
                    </label>
                    <input
                      type="text"
                      value={profile.salary}
                      disabled
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 text-sm">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      disabled
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all bg-white focus:outline-none focus:border-[#14274E] focus:shadow-[0_0_0_3px_rgba(20,39,78,0.1)] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-2">
                        {profileStats.completedJobs}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Total Jobs
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 rounded-xl bg-green-100 text-green-800">
                        +12%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-2">
                        {profileStats.customerRating}/5
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Avg Rating
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 rounded-xl bg-green-100 text-green-800">
                        +0.2
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-2">
                        98%
                      </div>
                      <div className="text-xs text-gray-600 mb-2">On Time</div>
                      <div className="text-xs font-semibold px-2 py-1 rounded-xl bg-green-100 text-green-800">
                        +3%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-2">
                        24h
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Avg Completion
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 rounded-xl bg-red-100 text-red-800">
                        -2h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Account Settings
                </h3>
                <div className="flex flex-col gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Notification Preferences
                    </h4>
                    <div className="mb-4">
                      <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="hidden peer"
                        />
                        <span className="w-5 h-5 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-sm after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                        Email notifications
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="hidden peer"
                        />
                        <span className="w-5 h-5 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-sm after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                        SMS alerts
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                        <input type="checkbox" className="hidden peer" />
                        <span className="w-5 h-5 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-sm after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                        Push notifications
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Privacy Settings
                    </h4>
                    <div className="mb-4">
                      <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="hidden peer"
                        />
                        <span className="w-5 h-5 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-sm after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                        Show profile to team members
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                        <input type="checkbox" className="hidden peer" />
                        <span className="w-5 h-5 border-2 border-gray-300 rounded relative transition-all peer-checked:bg-[#14274E] peer-checked:border-[#14274E] after:content-['✓'] after:absolute after:text-white after:text-sm after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:hidden peer-checked:after:block"></span>
                        Allow contact via phone
                      </label>
                    </div>
                  </div>

                  <div className="pt-8 border-t-2 border-red-100">
                    <h4 className="text-lg font-semibold text-red-600 mb-4">
                      Danger Zone
                    </h4>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
                        Reset Password
                      </button>
                      <button className="px-6 py-3 bg-transparent border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all">
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
  );
};

export default EmployeeProfile;
