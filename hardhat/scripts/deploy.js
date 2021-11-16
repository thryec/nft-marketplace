const hre = require('hardhat')

const main = async () => {
    const Marketplace = await hre.ethers.getContractFactory('Marketplace')
    const marketplace = await Marketplace.deploy(5)
    await marketplace.deployed()
    console.log('Marketplace deployed to:', marketplace.address)

    const NFT = await hre.ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketplace.address)
    await nft.deployed()
    console.log('NFT contract deployed to: ', nft.address)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

runMain()
