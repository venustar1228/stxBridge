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
import Web3 from 'web3'
import mintContractABI from './mintContractABI'

global.Buffer = Buffer;

export const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig })

let web3 = new Web3();
if (Web3.givenProvider) {
  web3 = new Web3(Web3.givenProvider)
}
const mintContractAddress = '0x0924fb450414134aD6D29E2EA6943d925E03b0D2'
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

  const network = new StacksTestnet();
  const contractAddress = 'ST10M9SK9RE5Z919TYVVMTZF9D8E0D6V8GR11BPA5'
  const contractName = 'stx-nft-minting'
  const postConditionCode = NonFungibleConditionCode.DoesNotOwn
  const derivationPath = "m/44'/5757'/0'/0/1"
  //const postConditionMode = PostConditionMode.Allow;
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
      network,
      functionName: 'transfer',
      postConditionMode: PostConditionMode.Allow,
      functionArgs: [
          uintCV(nftId),
          principalCV(address),
          principalCV('ST2DWVJSBJ1KF9VJN9GB6WQBC45PVNPGF66MBWZW3'),
      ],
      senderKey:
        //'df6a1fe51a9a5202f056515ab27d721d5f13f44c96ed1da7fcbaff046af11c7901',
        senderKey,
      validateWithAbi: true,
      contractNonFungiblePostCondition,
      anchorMode: AnchorMode.Any,
  }
  const transaction = await makeContractCall(txOptions)
  const broadcastResponse = await broadcastTransaction(transaction, network)
  const txId = broadcastResponse.txid

  await runSmartContract(mintContract, 'mint', [destAddr]);
}
