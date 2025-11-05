import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/Api';
import Navbar from '../components/Navbar';

const AppointmentHistory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError('');

            // Read userId from query param, fallback to localStorage or '1' for testing
            const params = new URLSearchParams(window.location.search);
            const queryUserId = params.get('userId');
            const userId = queryUserId || localStorage.getItem('userId') || '1';

            const res = await API.get(`/appointments/my-appointments?userId=${userId}`);
            setAppointments(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) => {
        if (!d) return '-';
        try {
            const date = new Date(d);
            return date.toLocaleDateString();
        } catch {
            return d;
        }
    };

    // (No client-side filtering/sorting — simple listing)

    return (
        <div className="min-h-screen bg-[#F1F6F9] pt-20">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-[#14274E]">Appointment History</h1>
                    <p className="text-[#394867]">Customer appointments and details</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* NOTE: search/sort controls removed per request */}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14274E]"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-[#9BA4B4]">No appointments found for this user.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="px-4 py-2 text-sm text-[#394867]">ID</th>
                                    <th className="px-4 py-2 text-sm text-[#394867]">Date</th>
                                    <th className="px-4 py-2 text-sm text-[#394867]">Vehicle</th>
                                    <th className="px-4 py-2 text-sm text-[#394867]">Selected Services</th>
                                    <th className="px-4 py-2 text-sm text-[#394867]">Session</th>
                                    <th className="px-4 py-2 text-sm text-[#394867]">Status</th>
                                    <th className="px-4 py-2 text-sm text-[#394867]">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((a) => (
                                    <tr key={a.appointmentId} className="border-b hover:bg-[#F1F6F9]">
                                        <td className="px-4 py-3 text-sm text-[#14274E]">{a.appointmentId}</td>
                                        <td className="px-4 py-3 text-sm text-[#14274E]">{formatDate(a.appointmentDate)}</td>
                                        <td className="px-4 py-3 text-sm text-[#14274E]">{a.vehicleName}</td>
                                        <td className="px-4 py-3 text-sm text-[#14274E]">{(a.selectedServices || []).join(', ')}</td>
                                        <td className="px-4 py-3 text-sm text-[#14274E]">{a.sessionType || '-'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${a.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : a.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#14274E]">{a.totalCost ? `$${Number(a.totalCost).toFixed(2)}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#14274E] text-white rounded-lg hover:bg-[#394867]">Back</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentHistory;
