import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroBackground from "../assets/hero_backgorund.png";
import Navbar from "../components/Navbar";
import { serviceAPI } from "../api/Api";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceAPI.getAllServices();
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (serviceType) => {
    const icons = {
      MAINTENANCE: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
      ),
      REPAIR: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      ),
      INSPECTION: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
      default: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
      ),
    };
    return icons[serviceType] || icons.default;
  };

  const getGradientColors = (index) => {
    const gradients = [
      "from-[#14274E] to-[#394867]",
      "from-[#394867] to-[#9BA4B4]",
      "from-[#14274E] to-[#394867]",
      "from-[#394867] to-[#9BA4B4]",
      "from-[#14274E] to-[#394867]",
      "from-[#394867] to-[#9BA4B4]",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      <Navbar />

      <section
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block px-4 py-2 bg-[#394867] rounded-full text-[#9BA4B4] text-sm font-semibold mb-6">
                TRUSTED AUTO SERVICE SINCE 2020
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                Your Vehicle Deserves The Best Care
              </h1>
              <p className="text-xl text-[#9BA4B4] mb-8 leading-relaxed">
                Professional auto repair and maintenance services with certified
                technicians. Quality service, transparent pricing, and customer
                satisfaction guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-[#394867] hover:bg-[#9BA4B4] text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-xl text-center"
                >
                  Get Started
                </Link>
                <a
                  href="#services"
                  className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#14274E] rounded-lg font-bold text-lg transition-all duration-200 text-center"
                >
                  Our Services
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Stat Card 1 - Happy Customers */}
                <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/30 hover:border-[#9BA4B4] transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_60px_rgba(155,164,180,0.4)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#394867]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="inline-block p-3 bg-white/20 rounded-full mb-3 group-hover:bg-[#9BA4B4]/30 transition-all duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-5xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      500+
                    </h3>
                    <p className="text-[#9BA4B4] font-semibold text-lg group-hover:text-white transition-colors duration-300">
                      Happy Customers
                    </p>
                  </div>
                </div>

                {/* Stat Card 2 - Expert Technicians */}
                <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/30 hover:border-[#9BA4B4] transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_60px_rgba(155,164,180,0.4)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#394867]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="inline-block p-3 bg-white/20 rounded-full mb-3 group-hover:bg-[#9BA4B4]/30 transition-all duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-5xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      15+
                    </h3>
                    <p className="text-[#9BA4B4] font-semibold text-lg group-hover:text-white transition-colors duration-300">
                      Expert Technicians
                    </p>
                  </div>
                </div>

                {/* Stat Card 3 - Services Completed */}
                <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/30 hover:border-[#9BA4B4] transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_60px_rgba(155,164,180,0.4)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#394867]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="inline-block p-3 bg-white/20 rounded-full mb-3 group-hover:bg-[#9BA4B4]/30 transition-all duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-5xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      1000+
                    </h3>
                    <p className="text-[#9BA4B4] font-semibold text-lg group-hover:text-white transition-colors duration-300">
                      Services Completed
                    </p>
                  </div>
                </div>

                {/* Stat Card 4 - Emergency Support */}
                <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/30 hover:border-[#9BA4B4] transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_60px_rgba(155,164,180,0.4)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#394867]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="inline-block p-3 bg-white/20 rounded-full mb-3 group-hover:bg-[#9BA4B4]/30 transition-all duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-5xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      24/7
                    </h3>
                    <p className="text-[#9BA4B4] font-semibold text-lg group-hover:text-white transition-colors duration-300">
                      Emergency Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F1F6F9]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#14274E] mb-4">
              Our Services
            </h2>
            <p className="text-xl text-[#394867] max-w-2xl mx-auto">
              Comprehensive automotive solutions tailored to your vehicle's
              needs
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#394867]"></div>
              <p className="text-[#394867] mt-4">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.serviceItemId}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div
                    className={`bg-gradient-to-br ${getGradientColors(
                      index
                    )} p-6`}
                  >
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className={`w-8 h-8 ${
                          index % 2 === 0 ? "text-[#14274E]" : "text-[#394867]"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {getServiceIcon(service.serviceItemType)}
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {service.serviceItemName}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#394867]">
                          Vehicle Type:
                        </span>
                        <span className="text-sm text-[#14274E] font-medium">
                          {service.vehicleType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#394867]">
                          Service Type:
                        </span>
                        <span className="text-sm text-[#14274E] font-medium">
                          {service.serviceItemType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#394867]">
                          Cost:
                        </span>
                        <span className="text-lg text-[#14274E] font-bold">
                          ${service.serviceItemCost}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#394867]">
                          Duration:
                        </span>
                        <span className="text-sm text-[#14274E] font-medium">
                          {service.estimatedDuration} hours
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#F1F6F9]">
                      <div className="flex items-center text-sm text-[#394867]">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>
                          Requires {service.requiredEmployeeCount}{" "}
                          {service.requiredEmployeeCount === 1
                            ? "technician"
                            : "technicians"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-[#394867]">
                No services available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#14274E] to-[#394867]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Why Choose AutoService?
            </h2>
            <p className="text-xl text-[#9BA4B4] max-w-2xl mx-auto">
              We're committed to providing exceptional service and building
              lasting relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#394867] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Certified Technicians
              </h3>
              <p className="text-[#9BA4B4]">
                ASE-certified mechanics with years of experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#394867] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Fair Pricing
              </h3>
              <p className="text-[#9BA4B4]">
                Transparent, competitive rates with no hidden fees
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#394867] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Fast Service
              </h3>
              <p className="text-[#9BA4B4]">
                Quick turnaround times without compromising quality
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#394867] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Warranty Protected
              </h3>
              <p className="text-[#9BA4B4]">
                All repairs backed by our comprehensive warranty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F1F6F9]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#14274E] mb-6">
                Get In Touch
              </h2>
              <p className="text-xl text-[#394867] mb-8">
                Have questions or need to schedule a service? We're here to
                help!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-[#394867] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14274E] mb-1">
                    Address
                  </h3>
                  <p className="text-[#394867]">
                    123 Auto Street, Service City, ST 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-[#394867] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h3 className="text-lg font-bold text-[#14274E] mb-1">
                    Phone
                  </h3>
                  <p className="text-[#394867]">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-[#394867] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h3 className="text-lg font-bold text-[#14274E] mb-1">
                    Email
                  </h3>
                  <p className="text-[#394867]">info@autoservice.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-[#394867] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14274E] mb-1">
                    Business Hours
                  </h3>
                  <p className="text-[#394867]">
                    Monday - Friday: 8:00 AM - 6:00 PM
                  </p>
                  <p className="text-[#394867]">Saturday: 9:00 AM - 4:00 PM</p>
                  <p className="text-[#394867]">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14274E] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">AutoService</h3>
              <p className="text-[#9BA4B4]">
                Your trusted partner for all automotive service needs.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#services"
                    className="text-[#9BA4B4] hover:text-white transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-[#9BA4B4] hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-[#9BA4B4] hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-[#9BA4B4]">General Maintenance</span>
                </li>
                <li>
                  <span className="text-[#9BA4B4]">Brake Services</span>
                </li>
                <li>
                  <span className="text-[#9BA4B4]">Engine Diagnostics</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-[#394867] rounded-lg flex items-center justify-center hover:bg-[#9BA4B4] transition-colors"
                >
                  <span className="text-white">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#394867] rounded-lg flex items-center justify-center hover:bg-[#9BA4B4] transition-colors"
                >
                  <span className="text-white">t</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#394867] rounded-lg flex items-center justify-center hover:bg-[#9BA4B4] transition-colors"
                >
                  <span className="text-white">in</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#394867] pt-8 text-center">
            <p className="text-[#9BA4B4]">
              &copy; 2025 AutoService. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
