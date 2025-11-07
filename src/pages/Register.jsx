import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/Api";
import registerSideImage from "../assets/register_side.png";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      formData.phoneNumber.length < 9 ||
      formData.phoneNumber.length > 20
    ) {
      newErrors.phoneNumber =
        "Phone number must be between 9 and 20 characters";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const response = await API.post("/auth/register", formData);
      setSuccessMessage("Registration successful! Redirecting to login...");
      setFormData({ username: "", email: "", phoneNumber: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          general: error.response.data.message || "Registration failed",
        });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout sideImage={registerSideImage} imageAlt="Register">
      <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#14274E] mb-2">
        Create your account
      </h2>
      <p className="text-center text-sm sm:text-base text-[#394867] mb-4 sm:mb-6">
        Join us today and get started
      </p>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-[#14274E] mb-2"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-[#9BA4B4]"
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
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`appearance-none block w-full pl-12 pr-4 py-3 border ${
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
        </div>

        {/* Email and Phone Number Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#14274E] mb-2"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[#9BA4B4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none block w-full pl-12 pr-4 py-3 border ${
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
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold text-[#14274E] mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[#9BA4B4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`appearance-none block w-full pl-12 pr-4 py-3 border ${
                  errors.phoneNumber ? "border-red-400" : "border-[#9BA4B4]/30"
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
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-[#14274E] mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-[#9BA4B4]"
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
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`appearance-none block w-full pl-12 pr-12 py-3 border ${
                errors.password ? "border-red-400" : "border-[#9BA4B4]/30"
              } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9BA4B4] hover:text-[#394867] transition-colors duration-200"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
            {errors.password && (
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
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-500 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  Registration Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="rounded-xl bg-green-50 p-4 border border-green-200">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-green-800">
                  Success!
                </h3>
                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-bold rounded-xl text-white transition-all duration-300 shadow-lg ${
              isLoading
                ? "bg-[#9BA4B4] cursor-not-allowed"
                : "bg-gradient-to-r from-[#14274E] to-[#394867] hover:from-[#394867] hover:to-[#14274E] hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#394867]"
            }`}
          >
            {isLoading ? (
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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-[#394867]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#14274E] hover:text-[#394867] focus:outline-none transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
