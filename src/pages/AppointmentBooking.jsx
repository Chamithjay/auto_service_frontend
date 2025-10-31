import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/Api';
import Navbar from '../components/Navbar';

const AppointmentBooking = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Step state management
    const [currentStep, setCurrentStep] = useState(1); // 1: vehicle selection, 2: service selection & details

    // Vehicle selection state
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Services and modifications state
    const [servicesAndModifications, setServicesAndModifications] = useState({
        services: [],
        modifications: []
    });
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    // Appointment details state
    const [appointmentDate, setAppointmentDate] = useState('');
    const [startTime, setStartTime] = useState('');

    // Calculation result state
    const [calculationResult, setCalculationResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Fetch user vehicles on component mount
    useEffect(() => {
        fetchUserVehicles();
    }, []);

    const fetchUserVehicles = async () => {
        try {
            setLoading(true);
            setError('');

            // Get userId from localStorage or your auth context
            // const userId = localStorage.getItem('userId'); // Adjust according to your auth implementation

            // if (!userId) {
            //     setError('User not authenticated. Please login.');
            //     return;
            // }

            // TEMPORARY: Using hardcoded userId for testing without login
            const userId = '1'; // TODO: Replace with localStorage.getItem('userId') when login is implemented

            const response = await API.get(`/appointments/vehicles?userId=${userId}`);
            setVehicles(response.data);

            if (response.data.length === 0) {
                setError('You have no registered vehicles. Please register a vehicle first.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch vehicles');
            console.error('Error fetching vehicles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleSelect = async (vehicle) => {
        try {
            setLoading(true);
            setError('');
            setSelectedVehicle(vehicle);

            // Fetch services and modifications for the selected vehicle
            const response = await API.post('/appointments/services', {
                vehicleId: vehicle.vehicleId
            });

            setServicesAndModifications(response.data);
            setCurrentStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch services and modifications');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceToggle = (serviceId) => {
        setSelectedServiceIds(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
        // Reset calculation when selection changes
        setCalculationResult(null);
    };

    const handleCalculate = async () => {
        if (!appointmentDate || !startTime) {
            setError('Please select both date and time');
            return;
        }

        if (selectedServiceIds.length === 0) {
            setError('Please select at least one service or modification');
            return;
        }

        try {
            setIsCalculating(true);
            setError('');

            const calculationRequest = {
                vehicleId: selectedVehicle.vehicleId,
                selectedServiceItemIds: selectedServiceIds,
                appointmentDate: appointmentDate,
                startTime: startTime
            };

            const response = await API.post('/appointments/calculate', calculationRequest);
            setCalculationResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to calculate appointment details');
            console.error('Error calculating:', err);
        } finally {
            setIsCalculating(false);
        }
    };

    const handleCreateAppointment = async () => {
        if (!calculationResult) {
            setError('Please calculate the appointment details first');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const createRequest = {
                vehicleId: selectedVehicle.vehicleId,
                selectedServiceItemIds: selectedServiceIds,
                appointmentDate: appointmentDate,
                startTime: startTime
            };

            const response = await API.post('/appointments/create', createRequest);
            setSuccess('Appointment created successfully!');

            // Show success message for 2 seconds then redirect
            setTimeout(() => {
                navigate('/appointments'); // Adjust route as needed
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create appointment');
            console.error('Error creating appointment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setSelectedVehicle(null);
        setServicesAndModifications({ services: [], modifications: [] });
        setSelectedServiceIds([]);
        setAppointmentDate('');
        setStartTime('');
        setCalculationResult(null);
        setError('');
    };

    // Get today's date for min date attribute
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-[#F1F6F9]">
            {/* <Navbar /> */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-3xl font-bold text-[#14274E] mb-2">Book an Appointment</h1>
                        <p className="text-[#394867]">Schedule your vehicle service or modifications</p>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    {/* Step 1: Vehicle Selection */}
                    {currentStep === 1 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-[#14274E] mb-4">Select Your Vehicle</h2>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14274E]"></div>
                                </div>
                            ) : vehicles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicles.map((vehicle) => (
                                        <button
                                            key={vehicle.vehicleId}
                                            onClick={() => handleVehicleSelect(vehicle)}
                                            className="p-6 border-2 border-[#9BA4B4] rounded-lg hover:border-[#14274E] hover:bg-[#F1F6F9] transition-all duration-200 text-left group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#14274E] group-hover:text-[#394867]">
                                                        {vehicle.vehicleName}
                                                    </h3>
                                                    <p className="text-[#9BA4B4] mt-1 capitalize">
                                                        {vehicle.vehicleType?.toLowerCase().replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <svg
                                                    className="w-6 h-6 text-[#14274E] group-hover:translate-x-1 transition-transform"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#9BA4B4] text-center py-8">No vehicles found. Please register a vehicle first.</p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Service Selection and Appointment Details */}
                    {currentStep === 2 && selectedVehicle && (
                        <div className="space-y-6">
                            {/* Selected Vehicle Info */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#394867] mb-1">Selected Vehicle</label>
                                        <input
                                            type="text"
                                            value={selectedVehicle.vehicleName}
                                            disabled
                                            className="w-full px-4 py-2 bg-[#F1F6F9] text-[#14274E] rounded-lg font-semibold cursor-not-allowed"
                                        />
                                    </div>
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 text-[#394867] hover:text-[#14274E] hover:bg-[#F1F6F9] rounded-lg transition-colors"
                                    >
                                        Change Vehicle
                                    </button>
                                </div>
                            </div>

                            {/* Services Selection */}
                            {servicesAndModifications.services.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-[#14274E] mb-4">Select Services</h2>
                                    <div className="space-y-3">
                                        {servicesAndModifications.services.map((service) => (
                                            <label
                                                key={service.id}
                                                className="flex items-center p-4 border-2 border-[#9BA4B4] rounded-lg hover:bg-[#F1F6F9] cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedServiceIds.includes(service.id)}
                                                    onChange={() => handleServiceToggle(service.id)}
                                                    className="w-5 h-5 text-[#14274E] border-[#9BA4B4] rounded focus:ring-[#14274E] focus:ring-2"
                                                />
                                                <span className="ml-3 text-[#14274E] font-semibold">{service.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Modifications Selection */}
                            {servicesAndModifications.modifications.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-[#14274E] mb-4">Select Modifications</h2>
                                    <div className="space-y-3">
                                        {servicesAndModifications.modifications.map((modification) => (
                                            <label
                                                key={modification.id}
                                                className="flex items-center p-4 border-2 border-[#9BA4B4] rounded-lg hover:bg-[#F1F6F9] cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedServiceIds.includes(modification.id)}
                                                    onChange={() => handleServiceToggle(modification.id)}
                                                    className="w-5 h-5 text-[#14274E] border-[#9BA4B4] rounded focus:ring-[#14274E] focus:ring-2"
                                                />
                                                <span className="ml-3 text-[#14274E] font-semibold">{modification.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date and Time Selection */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-[#14274E] mb-4">Select Date & Time</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#394867] mb-2">
                                            Appointment Date
                                        </label>
                                        <input
                                            type="date"
                                            value={appointmentDate}
                                            onChange={(e) => {
                                                setAppointmentDate(e.target.value);
                                                setCalculationResult(null);
                                            }}
                                            min={getTodayDate()}
                                            className="w-full px-4 py-3 border-2 border-[#9BA4B4] rounded-lg focus:border-[#14274E] focus:outline-none text-[#14274E]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#394867] mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => {
                                                setStartTime(e.target.value);
                                                setCalculationResult(null);
                                            }}
                                            className="w-full px-4 py-3 border-2 border-[#9BA4B4] rounded-lg focus:border-[#14274E] focus:outline-none text-[#14274E]"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCalculate}
                                    disabled={isCalculating || selectedServiceIds.length === 0 || !appointmentDate || !startTime}
                                    className="mt-4 w-full bg-[#394867] text-white py-3 rounded-lg font-semibold hover:bg-[#14274E] transition-colors disabled:bg-[#9BA4B4] disabled:cursor-not-allowed"
                                >
                                    {isCalculating ? 'Calculating...' : 'Calculate Cost & Duration'}
                                </button>
                            </div>

                            {/* Calculation Results */}
                            {calculationResult && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-[#14274E] mb-4">Appointment Summary</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-lg">
                                            <span className="text-[#394867] font-semibold">Total Cost</span>
                                            <span className="text-2xl font-bold text-[#14274E]">
                                                ${calculationResult.totalCost.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-lg">
                                            <span className="text-[#394867] font-semibold">Estimated End Time</span>
                                            <span className="text-xl font-bold text-[#14274E]">
                                                {calculationResult.estimatedEndTime}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-lg">
                                            <span className="text-[#394867] font-semibold">Selected Items</span>
                                            <span className="text-lg font-bold text-[#14274E]">
                                                {selectedServiceIds.length} item(s)
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateAppointment}
                                        disabled={loading}
                                        className="mt-6 w-full bg-[#14274E] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#394867] transition-colors disabled:bg-[#9BA4B4] disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Creating Appointment...' : 'Confirm & Book Appointment'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;
