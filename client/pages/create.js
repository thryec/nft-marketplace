import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/dist/client/router'
import Web3Modal from 'web3modal'
import { create } from 'ipfs-http-client'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

const client = create('https://ipfs.infura.io:5001/api/v0')

const Create = () => {
  const [fileUrl, setFileUrl] = useState('')
  const [tokenId, setTokenId] = useState(5)
  const [itemInfo, setItemInfo] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  })
  const [listedItems, setListedItems] = useState([])
  // const router = useRouter()

  const onFileUpload = async (e) => {
    const file = e.target.files[0]
    try {
      const addedFile = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
      setFileUrl(url)
    } catch (e) {
      console.log('Error uploading file: ', e)
    }
  }

  const createSaleItem = async () => {
    const { name, description, price, quantity } = itemInfo
    if (!name || !description || !price || !quantity || !fileUrl) {
      alert('Please do not leave any fields blank.')
      return
    }
    setListedItems([...listedItems, { tokenId: tokenId, url: fileUrl }])
    const data = JSON.stringify({ name, description, image: fileUrl })
    try {
      const addedFile = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
      console.log('image successfully uploaded to IPFS at url: ', url)
      mintNFT(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const mintNFT = async (url) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const myAddress = await signer.getAddress()

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    console.log('starting mint.....')
    const mintTxn = await nftContract.mintToken(myAddress, tokenId, itemInfo.quantity.toString(), '0x00')
    const txn = await mintTxn.wait()
    console.log('mintTxn: ', txn)

    await nftContract.setTokenURI(tokenId, url)
    console.log('tokenURI set')
    // const img = await nftContract.getTokenURI(3)
    // console.log('token URI: ', img)
  }

  const listOnMarketplace = async (url) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)
    const price = ethers.utils.parseUnits(itemInfo.price, 'ether')
    console.log('price: ', price)

    // approve user to transfer token from NFT contract to Marketplace contract
    await nftContract.connect(signer).setApprovalForAll(marketplaceContract.address, true)
    console.log('signer approved')

    // list on marketplace
    const listTxn = await marketplaceContract.listItemForSale(nftaddress, tokenId, 1, price)
    await listTxn.wait()
    console.log('tokenId minted: ', tokenId)
    console.log('listing txn: ', listTxn)
    setFileUrl('')
    setTokenId(tokenId + 1)
  }

  const fetchTokenURI = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const img = await nftContract.getTokenURI(5)
    console.log('token URI: ', img)
  }

  return (
    <div style={bodyStyle}>
      <h2>Upload Your Creation Here</h2>
      <div style={inputStyle}>
        <input placeholder="Item Name" onChange={(e) => setItemInfo({ ...itemInfo, name: e.target.value })} style={inputFields} value={itemInfo.name} />
        <textarea
          placeholder="Item Description"
          onChange={(e) => setItemInfo({ ...itemInfo, description: e.target.value })}
          style={inputFields}
          value={itemInfo.description}
        />
        <input placeholder="List Price" onChange={(e) => setItemInfo({ ...itemInfo, price: e.target.value })} style={inputFields} value={itemInfo.price} />
        <input
          placeholder="List Quantity"
          onChange={(e) => setItemInfo({ ...itemInfo, quantity: e.target.value })}
          style={inputFields}
          value={itemInfo.quantity}
        />
        <input type="file" onChange={onFileUpload} style={inputFields} />
        <Stack spacing={2} direction="row">
          <Button
            onClick={() => {
              createSaleItem()
            }}
            style={inputFields}
            variant="contained"
          >
            Mint NFT
          </Button>
          <Button
            onClick={() => {
              listOnMarketplace()
            }}
            style={inputFields}
            variant="contained"
          >
            List NFT
          </Button>
        </Stack>
        <div>
          <button onClick={fetchTokenURI}>Fetch Token URI</button>
        </div>
        <hr />
        {fileUrl && <img src={fileUrl} width="800px" />}
      </div>
    </div>
  )
}

const bodyStyle = {
  margin: 40,
}
const inputStyle = {
  display: 'flexbox',
}

const inputFields = {
  width: '750px',
  marginTop: 10,
  marginBottom: 10,
}

export default Create
