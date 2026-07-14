function Input({ placeholder, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px",
        border: "1px solid #DDD",
        borderRadius: "8px",
      }}
    />
  );
}

export default Input;