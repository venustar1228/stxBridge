import Image from "next/image";
import { useState } from "react";
import Input from "../components/Input";
import NetworkSelector from "../components/NetworkSelector";

export default function Home() {

  const [networkFrom, setNetworkFrom] = useState('ethereum');
  const [networkTo, setNetworkTo] = useState('stx');

  const [nftId, setNftId] = useState('');
  const [destAddr, setDestAddr] = useState('');

  return (
    <div className='bg-black w-full min-h-screen flex justify-center'>
      <div className='w-[640px]'>
        <div className='pt-[49px] pb-[19px] h-[30px] text-white flex justify-between items-center'>
          <span className='text-[16px] font-bold'>STX-ETH Bridge</span>
          <button className='text-[13px] bg-[#5493f7] h-[30px] w-[130px] rounded-full'>Connect Wallet</button>
        </div>
        <div className='w-full bg-[#1e1e1e] rounded-[2em] mt-[19px] text-white p-[60px] flex flex-col items-center'>
          <div className="font-bold text-[20px] mb-[42px]">
            Send
          </div>
          <div className="flex justify-between w-[440px] bg-[url(/images/light.gif)] bg-no-repeat bg-center">
            <NetworkSelector network={networkFrom} type='from' 
              onChange={(net) => {setNetworkFrom(net); setNetworkTo(net == 'ethereum' ? 'stx' : 'ethereum')}}
            />
            <NetworkSelector network={networkTo} type='to' 
              onChange={(net) => {setNetworkTo(net); setNetworkFrom(net == 'ethereum' ? 'stx' : 'ethereum')}}
            />
          </div>
          <div className="mt-[50px] w-full flex flex-col space-y-[8px]">
            <Input placeholder='Enter NFT ID' />
            <Input placeholder='Destination Address' />
          </div>
          <button className="w-full bg-[#5493f7] text-[14px] h-[48px] rounded-full mt-[40px]">
            Transfer
          </button>
        </div>
      </div>
    </div>
  )
}
