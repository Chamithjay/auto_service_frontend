import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  Car,
  AlertCircle,
  Play,
  User,
} from "lucide-react";

import API from "../../api/Api";
import InfoCard from "../../Components/InfoCard";
import EmployeeNavbar from "../../components/employee/EmployeeNavbar";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";

const AppointmentJobDetailsPage = () => {
  const { assignmentId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [showSuccess, setShowSuccess] = useState("");
  const [costAmount, setCostAmount] = useState("");
  const [costNote, setCostNote] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [note, setNote] = useState("");
 
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Get user info from localStorage and decode JWT token
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let employeeId = user.id || user.employeeId || user.userId;
  const currentEmployeeId = employeeId;

  if (!employeeId && user.token) {
    try {
      const payload = JSON.parse(atob(user.token.split(".")[1]));
      employeeId = payload.uid;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Get the current employee's assignment
  const getCurrentEmployeeAssignment = () => {
    if (!jobData?.jobAssignments) return null;
    return jobData.jobAssignments.find(
      (assignment) => assignment.employeeId === currentEmployeeId
    );
  };

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const startWorking = async () => {
    try {
      if (jobData.jobStatus === "COMPLETED") {
        throw new Error("Cannot start work on a completed job");
      }

      const assignment = getCurrentEmployeeAssignment();
      if (!assignment) {
        throw new Error("You are not assigned to this job");
      }

      if (assignment.endTime) {
        throw new Error("You have already completed your work session");
      }

      const payload = {
        status: "ONGOING",
        startTime: formatTimeString(new Date()),
      };

      console.log("Starting work:", payload);

      const response = await API.patch(
        `/job-assignments/log-start-time/${assignmentId}`,
        payload
      );

      if (response.status === 200) {
        setShowSuccess("started");
        setTimeout(() => setShowSuccess(""), 3000);
        await getJobDetails();
      } else {
        throw new Error("Failed to log start time");
      }
    } catch (error) {
      console.error("Error starting work:", error);
      setError(error.message || "Failed to start work. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Format the times to match Java's LocalTime format (HH:mm:ss)
  const formatTimeString = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const finishWorking = async () => {
    try {
      if (jobData.jobStatus === "COMPLETED") {
        throw new Error("Cannot finish work on a completed job");
      }

      const assignment = getCurrentEmployeeAssignment();
      if (!assignment) {
        throw new Error("You are not assigned to this job");
      }

      if (!assignment.startTime) {
        throw new Error("You haven't started working yet");
      }

      if (assignment.endTime) {
        throw new Error("You have already completed your work session");
      }

      const payload = {
        endTime: formatTimeString(new Date()),
      };

      console.log("Finishing work:", payload);

      const response = await API.patch(
        `/job-assignments/log-end-time/${assignmentId}`,
        payload
      );

      if (response.status === 200) {
        setShowSuccess("time");
        setTimeout(() => setShowSuccess(""), 3000);
        await getJobDetails();
      } else {
        throw new Error("Failed to log end time");
      }
    } catch (error) {
      console.error("Error finishing work:", error);
      setError(error.message || "Failed to finish work. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Mark the appointment job as completed.
  const CompleteTheJob = async () => {
    try {
      const payload = {
        jobStatus: "COMPLETED",
      };
      console.log("Completing job with payload:", payload);
      const response = await API.patch(
        `/appointment-jobs/update-job-status/${assignmentId}`,
        payload
      );
      if (response.status === 200) {
        setShowSuccess("Job Completed");
        setTimeout(() => setShowSuccess(""), 3000);
        await getJobDetails();
      } else {
        throw new Error("Failed to complete job");
      }
    } catch (error) {
      console.error("Error completing job:", error);
      setError("Failed to complete job. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Save additional cost.
  const SaveAdditionalCost = async () => {
    try {
      const assignment = getCurrentEmployeeAssignment();
      if (!assignment) {
        throw new Error("You are not assigned to this job");
      }

      if (assignment.additional_cost !== null) {
        throw new Error("You have already added additional cost for this job");
      }

      const payload = {
        additional_cost: costAmount,
        cost_note: costNote,
      };
      console.log("Adding cost:", payload);

      const response = await API.patch(`/job-assignments/add-costs/${assignmentId}`, payload);
      if (response.status === 200) {
        setShowSuccess("cost");
        setCostAmount("");
        setCostNote("");
        setTimeout(() => setShowSuccess(""), 3000);
        await getJobDetails();
      } else {
        throw new Error("Failed to add additional cost");
      }
    } catch (error) {
      console.error("Error adding additional cost:", error);
      setError(
        error.message || "Failed to add additional cost. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    }
  };

  // Save job note.
  const SaveJobNote = async () => {
    try {
      const payload = {
        jobNote: note,
      };
      console.log("Adding note:", payload);

      const response = await API.patch(
        `/appointment-jobs/save-job-note/${assignmentId}`,
        payload
      );
      if (response.status === 200) {
        setShowSuccess("note");
        setNote("");
        setTimeout(() => setShowSuccess(""), 3000);
        await getJobDetails();
      } else {
        throw new Error("Failed to add job note");
      }
    } catch (error) {
      console.error("Error adding job note:", error);
      setError("Failed to add job note. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const getJobDetails = async () => {
    try {
      console.log("Fetching job details for assignmentId:", assignmentId);
      const response = await API.get(`/appointment-jobs/${assignmentId}`);
      if (response.data) {
        setIsLoading(false);
        console.log("Job data received:", response.data);
        setJobData(response.data);
        // Display the total cost as Rs.0.00 if there is no additional cost yet.
        setTotalCost(
          response.data.additional_cost
            ? response.data.additional_cost.toFixed(2)
            : "0.00"
        );
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError(error.message || "Failed to fetch job details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14274E] mx-auto mb-4"></div>
          <p className="text-[#394867]">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error Loading Job</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">No Job Found</h3>
          <p>Could not find the requested job details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeNavbar user={user} />
      <EmployeeSidebar />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:ml-64 mt-16">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#14274E] mb-2">
                Job #{assignmentId}
              </h1>
              <p className="text-[#394867] text-base sm:text-lg">
                {jobData?.serviceItem?.serviceItemName || "N/A"}
              </p>
              <p className="text-[#9BA4B4] mt-1 text-sm sm:text-base">
                Estimated Duration:{" "}
                {jobData?.serviceItem?.estimatedDuration || "Not specified"}
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
              <span
                className={`inline-block px-4 sm:px-6 py-2 rounded-full text-sm font-semibold ${
                  jobData?.jobStatus === "ONGOING"
                    ? "bg-green-100 text-green-700"
                    : jobData?.jobStatus === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : jobData?.jobStatus === "NEW"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-[#14274E] text-white"
                }`}
              >
                {jobData?.jobStatus || "N/A"}
              </span>
              <div className="w-full max-w-xs bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#394867] mb-3">
                  Assigned Employees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.jobAssignments.map((employee, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-[#14274E] text-sm font-medium shadow-sm hover:border-[#14274E] transition-colors"
                    >
                      {employee.employeeName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InfoCard
            title="Vehicle Information"
            icon={Car}
            items={[
              {
                label: "License Plate",
                value: jobData.vehicle.registrationNo,
                bold: true,
              },
              { label: "Model", value: jobData.vehicle.vehicleModel },
              {
                label: "Vehicle Type ",
                value: jobData.vehicle.vehicleType,
                mono: true,
              },
            ]}
          />
          <InfoCard
            title="Customer Information"
            icon={User}
            items={[
              { label: "Name", value: jobData.customer.username, bold: true },
              { label: "Phone", value: jobData.customer.phoneNumber },
              { label: "Email ", value: jobData.customer.email, mono: true },
            ]}
          />
        </div>

        {/* Work time and Time History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Work Tracking */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#14274E] mb-4 flex items-center gap-2">
                <Clock className="text-[#394867]" size={24} />
                Work Tracking
              </h2>

              {showSuccess === "started" && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle size={18} />
                  Work started successfully!
                </div>
              )}
              {showSuccess === "time" && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle size={18} />
                  Work finished successfully!
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="p-6 sm:p-8 bg-[#14274E] rounded-lg text-white">
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Track Your Work Time
                  </h3>
                  {(() => {
                    const assignment = getCurrentEmployeeAssignment();
                    if (jobData.jobStatus === "COMPLETED") {
                      return (
                        <p className="text-gray-300">
                          This job has been marked as completed
                        </p>
                      );
                    }
                    if (assignment?.startTime && !assignment?.endTime) {
                      return (
                        <p className="text-gray-300">
                          You started at: {assignment.startTime}
                        </p>
                      );
                    }

                    return null;
                  })()}
                </div>

                <div className="flex justify-center">
                  {(() => {
                    const assignment = getCurrentEmployeeAssignment();

                    // If job is completed, show completion message
                    if (jobData.jobStatus === "COMPLETED") {
                      return (
                        <div className="text-center text-gray-300">
                          <CheckCircle size={32} className="mx-auto mb-2" />
                          Job has been completed
                        </div>
                      );
                    }

                    // If employee is not assigned
                    if (!assignment) {
                      return (
                        <div className="text-center text-gray-300">
                          <AlertCircle size={32} className="mx-auto mb-2" />
                          You are not assigned to this job
                        </div>
                      );
                    }

                    // If employee has finished their work
                    if (assignment.endTime) {
                      return (
                        <div className="text-center text-gray-300">
                          <CheckCircle size={32} className="mx-auto mb-2" />
                          You have completed your work session
                        </div>
                      );
                    }

                    // If employee hasn't started yet
                    if (!assignment.startTime) {
                      return (
                        <button
                          onClick={startWorking}
                          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
                        >
                          <Play size={20} />
                          Start Working
                        </button>
                      );
                    }

                    // If employee has started but not finished
                    if (assignment.startTime && !assignment.endTime) {
                      return (
                        <button
                          onClick={finishWorking}
                          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2"
                        >
                          <CheckCircle size={20} />
                          Finish Working
                        </button>
                      );
                    }

                    return (
                      <div className="text-center text-gray-300">
                        <CheckCircle size={32} className="mx-auto mb-2" />
                        Work session completed
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Time History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 h-full">
              <h3 className="text-base sm:text-lg font-semibold text-[#394867] mb-4 flex items-center gap-2">
                Time History
              </h3>
              <div className="space-y-3">
                {jobData.jobAssignments &&
                jobData.jobAssignments.filter(
                  (log) => log.startTime && log.endTime
                ).length > 0 ? (
                  jobData.jobAssignments
                    .filter((log) => log.startTime && log.endTime)
                    .map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          log.employeeId === currentEmployeeId
                            ? "bg-gray-50 bg-opacity-5  "
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[#14274E] font-semibold">
                            {log.employeeName}
                          </span>
                          <span className="text-[#14274E] font-bold">
                            {(() => {
                              const start = new Date(
                                `1970-01-01T${log.startTime}`
                              );
                              const end = new Date(`1970-01-01T${log.endTime}`);
                              const diffMs = end - start;
                              const diffMinutes = diffMs / 60000;
                              const hours = Math.floor(diffMinutes / 60);
                              const minutes = Math.floor(diffMinutes % 60);
                              return `${hours}h ${minutes}m`;
                            })()}
                          </span>
                        </div>
                        <div className="text-sm text-[#9BA4B4]">
                          <p>Start: {log.startTime}</p>
                          <p>End: {log.endTime}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#9BA4B4] mb-2">
                      No completed time records available
                    </p>
                    <p className="text-sm text-[#9BA4B4]">
                      Time history will appear here once you complete and save
                      your work session
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#14274E] mb-4 flex items-center gap-2">
            <DollarSign className="text-[#394867]" size={24} />
            Additional Costs
          </h2>

          {/* Add Cost Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[#394867] font-medium mb-2">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  value={costAmount}
                  onChange={(e) => setCostAmount(e.target.value)}
                  disabled={
                    jobData.jobStatus === "COMPLETED" ||
                    getCurrentEmployeeAssignment()?.additional_cost !== null
                  }
                  className="w-full px-4 py-2 border border-[#9BA4B4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14274E] disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-[#394867] font-medium mb-2">
                  Description{" "}
                  {costAmount && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  placeholder="Add details about this cost"
                  value={costNote}
                  onChange={(e) => setCostNote(e.target.value)}
                  disabled={
                    jobData.jobStatus === "COMPLETED" ||
                    getCurrentEmployeeAssignment()?.additional_cost !== null
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14274E] disabled:bg-gray-100 h-32 resize-none ${
                    costAmount && !costNote.trim()
                      ? "border-red-500"
                      : "border-[#9BA4B4]"
                  }`}
                />
              </div>
              {(() => {
                const assignment = getCurrentEmployeeAssignment();
                if (assignment?.additional_cost !== null) {
                  return (
                    <div className="text-center p-3 bg-gray-50 rounded-lg text-gray-600">
                      You have already added additional cost for this job
                    </div>
                  );
                }

                return (
                  <button
                    disabled={
                      jobData.jobStatus === "COMPLETED" ||
                      !costAmount ||
                      (costAmount && !costNote.trim())
                    }
                    title={
                      costAmount && !costNote.trim()
                        ? "Please add a description for the cost"
                        : ""
                    }
                    onClick={SaveAdditionalCost}
                    className="w-full px-6 py-3 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                  >
                    Add Cost
                  </button>
                );
              })()}
            </div>

            {/* Cost History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#394867] mb-2">
                Cost History
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {jobData.jobAssignments &&
                jobData.jobAssignments.some(
                  (assignment) =>
                    assignment.jobNote || assignment.additional_cost
                ) ? (
                  jobData.jobAssignments.map((cost, idx) =>
                    cost.cost_note || cost.additional_cost ? (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[#9BA4B4] text-sm">
                            Added by {cost.employeeName}
                          </span>
                          {cost.additional_cost && (
                            <span className="text-[#14274E] font-bold text-lg">
                              Rs. {cost.additional_cost.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {cost.jobNote && (
                          <p className="text-[#394867] text-sm mt-2">
                            {cost.jobNote}
                          </p>
                        )}
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-center text-[#9BA4B4] py-4">
                    No costs added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Total Costs */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-[#394867] font-semibold text-base sm:text-lg">
              Total Additional Costs
            </span>
            <span className="text-[#14274E] font-bold text-xl sm:text-2xl">
              Rs.{" "}
              {jobData.additional_cost
                ? jobData.additional_cost.toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>

        {/* Job Notes */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#14274E] mb-4 flex items-center gap-2">
            <FileText className="text-[#394867]" size={24} />
            Job Notes
          </h2>

          {showSuccess === "note" && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
              <CheckCircle size={18} />
              Note added successfully!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[#394867] font-medium mb-2">
                Add New Note
              </label>
              <textarea
                placeholder="Add a note about this job..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={jobData.jobStatus === "COMPLETED"}
                className="w-full px-4 py-2 border border-[#9BA4B4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14274E] disabled:bg-gray-100 h-40 resize-none mb-3"
              />
              <button
                disabled={jobData.jobStatus === "COMPLETED" || !note.trim()}
                className="w-full px-6 py-3 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                onClick={SaveJobNote}
              >
                Add Note
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#394867] mb-2">
                Notes History
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {jobData.jonNote ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-[#394867] text-sm">{jobData.jonNote}</p>
                  </div>
                ) : (
                  <p className="text-center text-[#9BA4B4] py-4">
                    No notes added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Job Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {jobData.jobStatus !== "COMPLETED" ? (
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="shrink-0">
                <AlertCircle className="text-[#394867]" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#14274E] mb-3">
                  Complete This Job
                </h3>
                <p className="text-[#9BA4B4] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Marking this job as completed will update the job status for
                  all assigned employees. Make sure all work is finished and
                  your time is saved before proceeding.
                </p>
                <button
                  disabled={isTimerRunning}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title={
                    isTimerRunning
                      ? "Please stop the timer before completing the job"
                      : ""
                  }
                  onClick={CompleteTheJob}
                >
                  <CheckCircle size={20} />
                  {isTimerRunning
                    ? "Stop Timer First"
                    : "Mark Job as COMPLETED"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-blue-50 p-4 sm:p-6 rounded-lg">
              <CheckCircle className="text-[#14274E] shrink-0" size={40} />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#14274E] mb-2">
                  Job Completed
                </h3>
                <p className="text-[#394867] leading-relaxed text-sm sm:text-base">
                  This job has been marked as completed. No further
                  modifications can be made.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentJobDetailsPage;
