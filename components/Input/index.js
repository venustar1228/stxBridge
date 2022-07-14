export default function Input( {placeholder, onChange, value} ) {
    return (
        <div className="w-full flex border-b border-[#2e2e2e]">
            <input 
            placeholder={ placeholder }
            className="grow bg-transparent pt-[12px] pb-[6px] h-[38px] outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}