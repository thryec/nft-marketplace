import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'

const myGallery = () => {
    const [myNFTs, setMyNFTs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    const fetchMyNFTs = async () => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)

        console.log('fetching items')
        const data = await marketplaceContract.getItemsOwned()
        console.log('my items: ', data)

        const items = data.map(async (el) => {
            const tokenURI = await nftContract.getTokenURI(el.tokenId)
            const res = await fetch(tokenURI)
            const data = await res.json()
            console.log(el.itemId, data.image)
        })
    }

    useEffect(() => {
        fetchMyNFTs()
    }, [])

    return isLoaded ? <div style={bodyStyle}>Display NFTs here</div> : <div style={bodyStyle}>No Assets Owned</div>
}
const bodyStyle = {
    margin: 40,
}

export default myGallery
