import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'

export default function Home() {
  return (
    <div style={bodyStyle}>
      <h1>Welcome to Creators' Corner</h1>
    </div>
  )
}

const bodyStyle = {
  margin: 40,
}
