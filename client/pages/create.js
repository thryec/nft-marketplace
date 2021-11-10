import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/dist/client/router'
import Web3Modal from 'web3modal'
import { create as ipfsClient } from 'ipfs-http-client'
import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'

const client = ipfsClient('https://ipfs.infura.io:5001/api/v0')

const Create = () => {
  const [itemUrl, setItemUrl] = useState('')
  const [itemInfo, setItemInfo] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  })

  const uploadToIpfs = () => {}

  const listOnMarketplace = () => {}

  return (
    <div style={bodyStyle}>
      <h2>Upload Your Creation Here</h2>
      <div style={inputStyle}>
        <input
          onChange={(e) => setItemInfo({ ...itemInfo, name: e.target.value })}
          placeholder="Item Name"
          style={inputFields}
        />
        <textarea
          onChange={(e) => setItemInfo({ ...itemInfo, description: e.target.value })}
          placeholder="Item Description"
          style={inputFields}
        />
        <input
          onChange={(e) => setItemInfo({ ...itemInfo, price: e.target.value })}
          placeholder="List Price"
          style={inputFields}
        />
        <input
          onChange={(e) => setItemInfo({ ...itemInfo, quantity: e.target.value })}
          placeholder="List Quantity"
          style={inputFields}
        />
        <input type="file" style={inputFields} />
        <button
          onClick={() => {
            uploadToIpfs()
            listOnMarketplace()
          }}
          style={inputFields}
        >
          List Item
        </button>
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
  marginTop: 20,
}

export default Create
