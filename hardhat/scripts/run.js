const hre = require('hardhat')
const { ethers } = require('hardhat')

let marketplace
let nft

const main = async () => {
    const Marketplace = await hre.ethers.getContractFactory('Marketplace')
    marketplace = await Marketplace.deploy(5)
    await marketplace.deployed()
    console.log('Marketplace deployed to:', marketplace.address)

    const NFT = await hre.ethers.getContractFactory('NFT')
    nft = await NFT.deploy(marketplace.address)
    await nft.deployed()
    console.log('NFT contract deployed to: ', nft.address)
}

const testMint = async () => {
    const [owner, buyer] = await ethers.getSigners()
    const listPrice = ethers.utils.parseUnits('10', 'ether')
    console.log('owner in testMint: ', owner.address)

    // Mint NFT
    await nft.mintToken('https://ipfs.io/ipfs/QmXmNSH2dyp5R6dkW5MVhNc7xqV9v3NHWxNXJfCL6CcYxS', 0, 1, '0x00')

    // List NFT to Marketplace
    await marketplace.listItemForSale(nft.address, 0, 1, listPrice)
    const item = await marketplace.getItemById(0)
    console.log('listed item: ', item)

    // Purchase NFT
}

const runMain = async () => {
    try {
        await main()
        await testMint()
        process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

runMain()
