import AdminLayout from "../../components/admin/AdminLayout";

const Services = () => {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-bold text-[#14274E] mb-8">Service Management</h1>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[#14274E]">View Services</h2>
                        <button className="px-6 py-2.5 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Add Services</span>
                        </button>
                    </div>

                    <p className="text-[#9BA4B4] text-center py-8">
                        Service management functionality will be implemented here.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Services;