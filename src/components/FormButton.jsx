const FormButton = ({ children, type = "submit", ...props }) => {
  return (
    <button
      type={type}
      className="w-full bg-[#14274E] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#394867] transition duration-300 shadow-lg"
      {...props}
    >
      {children}
    </button>
  );
};
export default FormButton;
