import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from "../config"

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'

const AccountDashboard = () => {npx 
  // array of NFTs
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(()=>{
    loadNFTs()
  }, []);

  const loadNFTs = async() => {
    //we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer);

    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(data.map( async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      // we want to get the token metadata - json
      const meta = await axios.get(tokenUri);

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }

      return item;
    }));

    const soldItems = items.filter(i => i.sold);
    setSold(soldItems);
    setNfts(items);
    setLoadingState('loaded');
  } 

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-7 text-4x1'>You have not minted any NFTs</h1>
  )


  return (
    <div className='p-4'>
    <h1 style={{fontSize: '30px', color: 'white'}}>Tokens Minted</h1>
      <div className='px-4' style={{maxWidth: '1600px'}}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft, i)=> <div key={i} className='border shadow rounded-x1 overflow-hidden'>
              <img src={nft.image} style={{height: '400px', margin: '0 auto'}}/>
              <div className='p-4 bg-black'>
                <p style={{height: '64px'}} className=' text-white text-3x1 font-semibold'>{nft.name}</p>
                <div style={{height: '72px', overflow: 'hidden'}}>
                  <p className='text-white'> {nft.description}</p>
                </div>
              </div> 
              <div className='p-4 bg-black'>
                <p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
                <button className='w-full bg-red-500 text-white font-bold py-3 px-12 rounded' onClick={()=>buyNFT(nft)}>
                  Buy
                </button>
              </div>
            </div>)
          }
        </div>
      </div>
    </div>
  )
}

export default AccountDashboard;