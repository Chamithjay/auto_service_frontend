import { useState } from "react";
// Import from your team's Api.jsx file
import { createServiceItem } from "../api/Api";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import FormSelect from "../components/FormSelect";

const AdminAddService = () => {
  const [formData, setFormData] = useState({
    serviceItemName: "",
    vehicleType: "CAR",
    requiredEmployeeCount: 1,
    serviceItemCost: "",
    serviceItemType: "SERVICE",
    estimatedDuration: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await createServiceItem(formData);
      setMessage(
        `Success! Service "${response.data.serviceItemName}" created.`
      );
      setFormData({
        serviceItemName: "",
        vehicleType: "CAR",
        requiredEmployeeCount: 1,
        serviceItemCost: "",
        serviceItemType: "SERVICE",
        estimatedDuration: "",
      });
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Failed to create service"}`
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-[#14274E] mb-6">
        Create New Service
      </h1>
      <p className="text-[#9BA4B4] mb-8">
        Add a new service or modification to the list of available options.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Service/Modification Name"
          id="serviceItemName"
          name="serviceItemName"
          value={formData.serviceItemName}
          onChange={handleChange}
          placeholder="e.g., Premium Oil Change"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Type"
            id="serviceItemType"
            name="serviceItemType"
            value={formData.serviceItemType}
            onChange={handleChange}
          >
            <option value="SERVICE">Service</option>
            <option value="MODIFICATION">Modification</option>
          </FormSelect>

          <FormSelect
            label="Vehicle Type"
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="CAR">Car</option>
            <option value="VAN">Van</option>
            <option value="BUS">Bus</option>
          </FormSelect>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput
            label="Cost (LKR)"
            id="serviceItemCost"
            name="serviceItemCost"
            type="number"
            step="0.01"
            value={formData.serviceItemCost}
            onChange={handleChange}
            placeholder="e.g., 5000.00"
            required
          />
          <FormInput
            label="Est. Duration (mins)"
            id="estimatedDuration"
            name="estimatedDuration"
            type="number"
            value={formData.estimatedDuration}
            onChange={handleChange}
            placeholder="e.g., 45"
            required
          />
          <FormInput
            label="Req. Employees"
            id="requiredEmployeeCount"
            name="requiredEmployeeCount"
            type="number"
            value={formData.requiredEmployeeCount}
            onChange={handleChange}
            placeholder="e.g., 1"
            required
          />
        </div>

        <div className="pt-4">
          <FormButton type="submit">Create Service</FormButton>
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

export default AdminAddService;
