const FormSelect = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#394867] mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full px-4 py-3 bg-white border border-[#9BA4B4]/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14274E]"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
export default FormSelect;
