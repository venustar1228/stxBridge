import { AppConfig, UserSession } from "@stacks/connect";
import { Buffer } from '@stacks/common'
import { StacksTestnet } from "@stacks/network";
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV'
import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    NonFungibleConditionCode,
    createAssetInfo,
    makeContractNonFungiblePostCondition,
    uintCV,
    PostConditionMode,
  } from '@stacks/transactions'
import { openContractCall } from "@stacks/connect";
import { useConnect } from "@stacks/connect-react";
import Web3 from 'web3'
import mintContractABI from './mintContractABI'

global.Buffer = Buffer;

export const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig })

let web3 = new Web3();
if (Web3.givenProvider) {
  web3 = new Web3(Web3.givenProvider)
}
const mintContractAddress = '0x065B26A0AF0dED0Bd5cb5C75B432C81Acf54517d'
let mintContract = new web3.eth.Contract(
  mintContractABI,
  mintContractAddress
)

export const runSmartContract = async (
  contract,
  func,
  args = [],
  options
) => {
  
  let accounts = await web3.eth.requestAccounts()
  if (accounts.length === 0) {
    alert('accounts.length = 0')
    return false
  }

  if (!contract) return false
  if (!contract.methods[func]) return false
  const promiEvent = await contract.methods[func](...args).send(
    Object.assign({ from: accounts[0] }, options)
  ) //this doesn't work now.
  console.log('result', promiEvent)
  return promiEvent
}

export const transferNFT = async (address, nftId, destAddr, senderKey) => {
  //const { doContractCall } = useConnect();
  const network = new StacksTestnet();
  const contractAddress = 'ST10M9SK9RE5Z919TYVVMTZF9D8E0D6V8GR11BPA5'
  const contractName = 'stx-nft-minting'
  const postConditionCode = NonFungibleConditionCode.DoesNotOwn
  const derivationPath = "m/44'/5757'/0'/0/1"
  const postConditionMode = PostConditionMode.Allow;
  // const assetAddress = 'ST10M9SK9RE5Z919TYVVMTZF9D8E0D6V8GR11BPA5'
  // const assetContractname = 'stx-nft-minting'
  // const assetName = 'arties'
  const tokenAssetName = uintCV(nftId);
  const nonFungibleAssetInfo = createAssetInfo(
      address,
      'stx-nft-minting',
      'arties'
  )

  const contractNonFungiblePostCondition = [
      makeContractNonFungiblePostCondition(
        contractAddress,
        contractName,
        postConditionCode,
        nonFungibleAssetInfo,
        tokenAssetName
      ),
    ]
    
  const txOptions = {
      contractAddress: 'ST10M9SK9RE5Z919TYVVMTZF9D8E0D6V8GR11BPA5',
      contractName: 'stx-nft-minting',
      functionName: 'transfer',
      network: network,      
      postConditionMode: PostConditionMode.Allow,
      functionArgs: [
          uintCV(nftId),
          principalCV(address),
          principalCV('ST2DWVJSBJ1KF9VJN9GB6WQBC45PVNPGF66MBWZW3'),
      ],
      appDetails: {
        name: "Connect Hiro Wallet",
        icon: "https://assets-global.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg"
      },
      // senderKey:
      //   //'df6a1fe51a9a5202f056515ab27d721d5f13f44c96ed1da7fcbaff046af11c7901',
      //   senderKey,
      // senderAddress: address,
      // validateWithAbi: true,
      //contractNonFungiblePostCondition: contractNonFungiblePostCondition,
      // anchorMode: AnchorMode.Any,
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
  }

  await openContractCall(txOptions);

  // console.log("senderKey", senderKey);
  // const transaction = await makeContractCall(txOptions)
  // const broadcastResponse = await broadcastTransaction(transaction, network)
  // const txId = broadcastResponse.txid

  await runSmartContract(mintContract, 'mint', [destAddr, nftId]);
}
