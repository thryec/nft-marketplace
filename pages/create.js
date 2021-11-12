import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/dist/client/router'
import Web3Modal from 'web3modal'
import { create } from 'ipfs-http-client'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'

const client = create('https://ipfs.infura.io:5001/api/v0')

const Create = () => {
  const [fileUrl, setFileUrl] = useState('')
  const [tokenId, setTokenId] = useState(0)
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
    setTokenId(tokenId + 1)
    const data = JSON.stringify({ name, description, image: fileUrl })
    try {
      const addedFile = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
      console.log('image successfully uploaded to IPFS at url: ', url)
      listOnMarketplace(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const listOnMarketplace = async (url) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const myAddress = await signer.getAddress()

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    console.log('starting mint.....')
    const mintTxn = await nftContract.mintToken(myAddress, tokenId, itemInfo.quantity.toString(), '0x00')
    const txn = await mintTxn.wait()
    console.log('txn: ', txn)

    console.log('setting tokenURI...')
    // await nftContract.setTokenURI(1, url)

    const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)
    const price = ethers.utils.parseUnits(itemInfo.price, 'ether')
    console.log('price: ', price)
    // approve user to transfer token from NFT contract to Marketplace contract
    await nftContract.connect(signer).setApprovalForAll(marketplaceContract.address, true)
    console.log('signer approved')
    // const listTxn = await marketplaceContract.listItemForSale(nftaddress, tokenId, 1, price)
    // await listTxn.wait()
    // console.log('listTxn: ', listTxn)

    setFileUrl('')
  }

  const fetchExistingTokens = async () => {}

  const fetchTokenURI = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const myAddress = await signer.getAddress()

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const img = await nftContract.getTokenURI(0)
    console.log('token URI: ', img)
  }

  return (
    <div style={bodyStyle}>
      <h2>Upload Your Creation Here</h2>
      <div style={inputStyle}>
        <input
          placeholder="Item Name"
          onChange={(e) => setItemInfo({ ...itemInfo, name: e.target.value })}
          style={inputFields}
        />
        <textarea
          placeholder="Item Description"
          onChange={(e) => setItemInfo({ ...itemInfo, description: e.target.value })}
          style={inputFields}
        />
        <input
          placeholder="List Price"
          onChange={(e) => setItemInfo({ ...itemInfo, price: e.target.value })}
          style={inputFields}
        />
        <input
          placeholder="List Quantity"
          onChange={(e) => setItemInfo({ ...itemInfo, quantity: e.target.value })}
          style={inputFields}
        />
        <input type="file" onChange={onFileUpload} style={inputFields} />
        <button
          onClick={() => {
            createSaleItem()
          }}
          style={inputFields}
        >
          List Item
        </button>
        <div>
          <button onClick={fetchTokenURI}>Fetch Token URI</button>
          {/* {JSON.stringify(listedItems)} */}
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
