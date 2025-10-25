import Navbar from "./Navbar";

const AuthLayout = ({ children, sideImage, imageAlt }) => {
  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      <Navbar />

      <div className="min-h-screen bg-[#F1F6F9] flex items-center justify-center p-4 pt-24 pb-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#9BA4B4] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#9BA4B4] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        {/* Centered Card Container */}
        <div className="w-full max-w-5xl relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px] lg:min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left Side - Image */}
              <div className="relative overflow-hidden min-h-[250px] lg:min-h-[600px] order-1 lg:order-none">
                <img
                  src={sideImage}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side - Form Content */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center min-h-[400px] lg:min-h-[600px] order-2 lg:order-none">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
