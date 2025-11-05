import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById, updateService } from "../../api/Api";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";

const AdminEditService = () => {
  const { id } = useParams(); // Gets the ':id' from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceItemName: "",
    vehicleType: "CAR",
    requiredEmployeeCount: 1,
    serviceItemCost: "",
    serviceItemType: "SERVICE",
    estimatedDuration: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the service data when the page loads
    const fetchService = async () => {
      try {
        const response = await getServiceById(id);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setMessage(`Error: Failed to fetch service data.`);
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateService(id, formData);
      setMessage("Success! Service updated.");
      navigate("/admin/services"); // Go back to the list
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Failed to update"}`
      );
    }
  };

  if (loading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-[#14274E] mb-6">Edit Service</h1>
      <p className="text-primary-light mb-8">
        Update the details for "{formData.serviceItemName}".
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Service/Modification Name"
          id="serviceItemName"
          name="serviceItemName"
          value={formData.serviceItemName}
          onChange={handleChange}
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
            required
          />
          <FormInput
            label="Est. Duration (mins)"
            id="estimatedDuration"
            name="estimatedDuration"
            type="number"
            value={formData.estimatedDuration}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Req. Employees"
            id="requiredEmployeeCount"
            name="requiredEmployeeCount"
            type="number"
            value={formData.requiredEmployeeCount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pt-4">
          <FormButton type="submit">Save Changes</FormButton>
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

export default AdminEditService;
