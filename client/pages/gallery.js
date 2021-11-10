import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'

const myGallery = () => {
  const [myNFTs, setMyNFTs] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  return isLoaded ? <div style={bodyStyle}>Display NFTs here</div> : <div style={bodyStyle}>No Assets Owned</div>
}
const bodyStyle = {
  margin: 40,
}

export default myGallery
