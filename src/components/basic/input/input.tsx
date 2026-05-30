import "./input.css"

interface InputProps {
  label: string,
  placeholder: string,
  type?: string
  value: string
  onChange: (value: string) => void
}

export default function Input({label, placeholder, value, onChange, type}: InputProps) {
  if (type) {
    console.log("This is type:", type);
  }
  return (
    <>
    <p className="input-label">{label}</p>
    <input 
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    </>
  )
}