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

global.Buffer = Buffer;

export const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig })

export const transferNFT = async (address, nftId) => {

  const network = new StacksTestnet();
  const contractAddress = 'ST10M9SK9RE5Z919TYVVMTZF9D8E0D6V8GR11BPA5'
  const contractName = 'stx-nft-minting'
  const postConditionCode = NonFungibleConditionCode.DoesNotOwn
  //const derivationPath = "m/44'/5757'/0'/0/1"
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
        'df6a1fe51a9a5202f056515ab27d721d5f13f44c96ed1da7fcbaff046af11c7901',
      validateWithAbi: true,
      contractNonFungiblePostCondition,
      anchorMode: AnchorMode.Any,
  }
  console.log("txOptions", txOptions);
  console.log("nftId, address", nftId, address);
  const transaction = await makeContractCall(txOptions)
  console.log('/////////////////////////////////////////////////')

  const broadcastResponse = await broadcastTransaction(transaction, network)
  const txId = broadcastResponse.txid
}
