import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import API from "../../api/Api";

const RequestLeave = () => {
  const [formData, setFormData] = useState({
    leaveDate: "",
    leaveType: "",
    reason: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate minimum leave request date (3 days from today)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateString = minDate.toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.leaveDate) {
      setError("Please select a leave date");
      return false;
    }

    if (!formData.leaveType) {
      setError("Please select a leave type");
      return false;
    }

    if (!formData.reason.trim()) {
      setError("Please provide a reason for the leave");
      return false;
    }

    if (formData.reason.trim().length < 10) {
      setError("Please provide a more detailed reason (minimum 10 characters)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        employeeId: 3,
        leaveDate: formData.leaveDate,
        leaveType: formData.leaveType,
        leaveReason: formData.reason,
      };
      console.log("submitting", payload);
      const response = await API.post("/leaves/request", payload);

      if (response.status === 201) {
        setShowSuccess(true);
        setFormData({
          leaveDate: "",
          leaveType: "",
          reason: "",
        });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error("Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      setError(
        error.message || "Failed to submit leave request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#14274E] mb-4 sm:mb-6">
            Request Leave
          </h1>

          {showSuccess && (
            <div className="mb-4 sm:mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
              <CheckCircle size={18} />
              Leave request submitted successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 sm:mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 sm:space-y-6 ${
              isSubmitting ? "opacity-75 pointer-events-none" : ""
            }`}
          >
            {/* Leave Date */}
            <div>
              <label className="block text-[#394867] font-medium mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Leave Date
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="leaveDate"
                value={formData.leaveDate}
                onChange={handleInputChange}
                min={minDateString}
                className="w-full px-4 py-2 border border-[#9BA4B4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14274E]"
                required
              />
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-[#394867] font-medium mb-2 flex items-center gap-2">
                <Clock size={18} />
                Leave Type
                <span className="text-red-500">*</span>
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#9BA4B4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14274E]"
                required
              >
                <option value="">Select leave type</option>
                <option value="HALFDAY_MORNING">Halfday - Morning</option>
                <option value="HALFDAY_EVENING">Halfday - Evening</option>
                <option value="FULLDAY">Fullday</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-[#394867] font-medium mb-2 flex items-center gap-2">
                <FileText size={18} />
                Reason for Leave
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Please provide a detailed reason for your leave request..."
                className="w-full px-4 py-2 border border-[#9BA4B4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14274E] h-32 resize-none"
                required
                minLength={10}
              />
              <p className="text-sm text-[#9BA4B4] mt-1">
                Minimum 10 characters required
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#14274E] hover:bg-[#394867]"
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Leave Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestLeave;
