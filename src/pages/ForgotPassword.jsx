import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/Api";
import loginSideImage from "../assets/login_side.png";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validateEmail = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/auth/password/forgot", { email: formData.email });
      setStep(2);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          general: error.response.data.error || "Failed to send OTP",
        });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!validateOTP()) {
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/auth/password/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      setStep(3);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.error || "Invalid OTP" });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/auth/password/reset", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      setErrors({});
      // Navigate to login after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          general: error.response.data.error || "Failed to reset password",
        });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout sideImage={loginSideImage} imageAlt="Forgot Password">
      {step === 1 && (
        <>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#14274E] mb-2">
            Forgot Password?
          </h2>
          <p className="text-center text-sm sm:text-base text-[#394867] mb-4 sm:mb-6">
            Enter your email to receive an OTP
          </p>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSendOTP}>
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
                      Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {errors.general}
                    </p>
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
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
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

            {/* Back to Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-[#394867]">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#14274E] hover:text-[#394867] focus:outline-none transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#14274E] mb-2">
            Verify OTP
          </h2>
          <p className="text-center text-sm sm:text-base text-[#394867] mb-4 sm:mb-6">
            Enter the 6-digit code sent to {formData.email}
          </p>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleVerifyOTP}>
            {/* OTP Field */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                OTP Code
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-12 pr-4 py-3 border ${
                    errors.otp ? "border-red-400" : "border-[#9BA4B4]/30"
                  } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest`}
                  placeholder="000000"
                />
                {errors.otp && (
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
                    {errors.otp}
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
                      Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {errors.general}
                    </p>
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
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
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

            {/* Resend OTP */}
            <div className="text-center pt-2">
              <p className="text-sm text-[#394867]">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="font-bold text-[#14274E] hover:text-[#394867] focus:outline-none transition-colors duration-300"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#14274E] mb-2">
            Reset Password
          </h2>
          <p className="text-center text-sm sm:text-base text-[#394867] mb-4 sm:mb-6">
            Enter your new password
          </p>

          <form
            className="space-y-4 sm:space-y-5"
            onSubmit={handleResetPassword}
          >
            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                New Password
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
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-12 pr-12 py-3 border ${
                    errors.newPassword
                      ? "border-red-400"
                      : "border-[#9BA4B4]/30"
                  } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                  placeholder="Enter new password"
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
                {errors.newPassword && (
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
                    {errors.newPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                Confirm Password
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
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-12 pr-12 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-[#9BA4B4]/30"
                  } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9BA4B4] hover:text-[#394867] transition-colors duration-200"
                >
                  {showConfirmPassword ? (
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
                {errors.confirmPassword && (
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
                    {errors.confirmPassword}
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
                      Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {errors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {!errors.general &&
              isLoading === false &&
              formData.newPassword &&
              formData.confirmPassword &&
              !errors.newPassword &&
              !errors.confirmPassword && (
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
                      <p className="text-sm text-green-700 mt-1">
                        Password reset successfully. Redirecting to login...
                      </p>
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
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
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
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
