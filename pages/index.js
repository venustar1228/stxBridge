import { useState, useReducer } from "react";
import Input from "../components/Input";
import NetworkSelector from "../components/NetworkSelector";
import { transferNFT, userSession } from "../utils/stacks";
import { useConnect } from "@stacks/connect-react"

import _ from 'lodash'

export default function Home() {

  const [ignored, reload] = useReducer(x => x + 1, 0);
  
  const [networkFrom, setNetworkFrom] = useState('ethereum');
  const [networkTo, setNetworkTo] = useState('stx');

  const [nftId, setNftId] = useState('');
  const [destAddr, setDestAddr] = useState('');

  const { authData, authenticate } = useConnect();

  const authOptions = {
    appDetails: {
      name: "Connect Hiro Wallet",
      icon: "https://assets-global.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg"
    },
    redirectTo: '/',
    onFinish: () => {
      reload();
    },
    userSession
  };

  let address;
  try {
    address = userSession.loadUserData().profile?.stxAddress?.testnet;
  } catch(e) {}

  console.log(address);

  return (
    <div className='bg-black w-full min-h-screen flex justify-center'>
      <div className='w-[640px]'>
        <div className='pt-[49px] pb-[19px] h-[30px] text-white flex justify-between items-center'>
          <span className='text-[16px] font-bold'>STX-ETH Bridge</span>
          { 
          !address &&
          <button className='text-[13px] bg-[#5493f7] h-[30px] w-[130px] rounded-full outline-none'
            onClick={() => authenticate(authOptions)}
          >
            Connect Wallet
          </button>
          }
          { 
          address &&
          <button className='text-[13px] bg-[#5493f7] h-[30px] w-[130px] rounded-full outline-none'
            onClick={() => { userSession.signUserOut(); reload(); }}
          >
            { _.truncate(address, { length: 10}) + address.substr(address.length - 5)}
          </button>
          }
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
            <Input placeholder='Enter NFT ID' onChange={setNftId} value={nftId} />
            <Input placeholder='Destination Address' onChange={setDestAddr} value={destAddr}/>
          </div>
          <button className="w-full bg-[#5493f7] text-[14px] h-[48px] rounded-full mt-[40px]"
            onClick={() => transferNFT(address, nftId)}>
            Transfer
          </button>
        </div>
      </div>
    </div>
  )
}
