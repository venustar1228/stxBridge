export default function Input( {placeholder} ) {
    return (
        <div className="w-full flex border-b border-[#2e2e2e]">
            <input 
            placeholder={ placeholder }
            className="grow bg-transparent pt-[12px] pb-[6px] h-[38px] outline-none"
            />
        </div>
    )
}