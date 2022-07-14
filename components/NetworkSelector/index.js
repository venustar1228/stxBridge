import Image from "next/image";
import cn from 'classnames';
import { useState } from "react";

export default function NetworkSelector( {network, type, networks = ['ethereum', 'stx'], onChange} ) {
    const [isDropdown, openDropdown] = useState(false);
    console.log('isDropdown', isDropdown);
    return (
        <div className='w-[142px] h-[142px] rounded-full border border-[#4abcf0] shadow-[#4abcf0_0px_0px_6px] flex flex-col items-center bg-[#202020]'>
            <div className="pt-[28px]">
            <Image src={`/images/${network}.svg`} width={54} height={54} />
            </div>
            <div className="text-[#a3a3a3] text-[12px] pt-[12px] font-bold pb-[2px]">
                { type.toUpperCase() }
            </div>
            <div>
            <button className='relative bg-[#2e2e2e] text-[16px] font-bold w-[160px] h-[50px] rounded-[10px] flex items-center justify-between py-[12px] pl-[15px] pr-[12px] capitalize'
                onClick={() => openDropdown(true)}
            >
                <Image src={`/images/${network}.svg`} width={18} height={18} />
                <div className="flex grow pl-[10px]">
                    {network == 'stx' ? 'Stacks' : network}
                </div>
                <div>
                <Image src='/images/arrow.svg' width={8} height={8} />
                </div>
                {
                    isDropdown && 
                    <div className="absolute top-0 left-0 w-full bg-[#2e2e2e] rounded-[10px] flex flex-col">
                        {networks.map((net,key) => (
                            <button key={key} 
                                className='capitalize p-[12px] flex items-center'
                                disabled={net == network}
                                onClick={(e) => { e.stopPropagation(); openDropdown(false); onChange(net)}}
                            >
                                <Image src={`/images/${net}.svg`} width={18} height={18} />
                                <span className={cn("pl-[4px]", net == network && "text-[#474d57]")}>
                                    {net == 'stx' ? 'Stacks' : net}
                                </span>
                            </button>
                        ))}
                    </div>
                }
            </button>
            </div>
      </div>
    )
}