import React, {useCallback} from 'react'
import { ethers, providers } from "ethers"
import { useState } from "react"
import Web3Modal from 'web3modal'
import {create as ipfsHttpClient} from 'ipfs-http-client'

import { nftaddress, nftmarketaddress } from "../config"

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'
import { useRouter } from "next/router"

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {useDropzone} from 'react-dropzone'
import Button from '@mui/material/Button';


import AccountCircle from '@mui/icons-material/AccountCircle';
// in this component we set IPFS up to host out nft data of file storage

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const MintItem = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});

    const router = useRouter();

    const onDrop = useCallback( async acceptedFiles => {
        const file = acceptedFiles[0];
        debugger;
        try {
            const added = await client.add(
                file, {
                    progress: (prog) => console.log(`recieved: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
      }, [])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})



    //set up a function  to fireoff when we update files in our form - we can add our NFT images - IPFS

    const onChange = async(e) => {
            const file = e.target.files[0];
            try {
                const added = await client.add(
                    file, {
                        progress: (prog) => console.log(`recieved: ${prog}`)
                    }
                )
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                setFileUrl(url);
            } catch (error) {
                console.log("Error uploading file: ", error);
            }
    }

    const createMarket = async() => {
        const {name, description, price} = formInput;
        if(!name || !description || !price || !fileUrl) return;

        //upload to IPFS
        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //run a function that creates sale and passes in the url
            createSale(url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    const createSale = async(url) => {
        // create the items and list them on the marketplace
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = await new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        // we want to create a token
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.mintToken(url);
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();
        const price = ethers.utils.parseUnits(formInput.price, 'ether'); 

        // list the item for sale on the marketplace
        contract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer);
        let listingPrice = await contract.getListingPrice();

        listingPrice = listingPrice.toString();
        transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {value: listingPrice});

        await transaction.wait();
        router.push('./');
    }


    return (
      <Paper elevation={1}>
        <Box p={5}>
          <Box mt={2}>
            <TextField
              fullWidth
              placeholder="Asset Name"
              id="asset-name"
              label="Asset Name"
              variant="outlined"
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              rows={5}
              multiline
              placeholder="Asset Description"
              id="asset-name"
              label="Asset Description"
              variant="outlined"
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">ETH</InputAdornment>
                ),
              }}
              placeholder="Asset Price"
              id="asset-name"
              label="Asset Price"
              variant="outlined"
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
          </Box>
          <Box mt={2} sx={{height: "400px", border: "3px dotted lightgray"}}>
            <Box {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                <p style={{height: "400px"}}>Drop the files here ...</p>
                ) : (
                <p style={{height: "400px"}}>Drag 'n' drop some files here, or click to select files</p>
                )}
            </Box>
          { fileUrl && <img className='rounded mt-4' width='350px' src={fileUrl} />}
          </Box>
          {/* <input type='file' name='Asset' placeholder='Asset Price in ETH' className='mt-4 border rounded p-4' onChange={onChange}/>
                {
                    fileUrl && <img className='rounded mt-4' width='350px' src={fileUrl} />
                } */}

                <Box mt={2}>

                <Button  onClick={createMarket} variant="contained"> Mint NFT</Button>
                </Box>
        </Box>
      </Paper>
    );
}

export default MintItem;