const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFT Marketplace', function () {
    let marketplace
    let nft
    let marketplaceAddress
    let nftAddress
    let contractOwner
    let seller1
    let seller2
    let buyer1
    let buyer2
    let listPrice
    const provider = ethers.provider

    beforeEach(async () => {
        ;[contractOwner, seller1, seller2, buyer1, buyer2] = await ethers.getSigners()

        const Marketplace = await ethers.getContractFactory('Marketplace')
        marketplace = await Marketplace.deploy()
        await marketplace.deployed()
        marketplaceAddress = marketplace.address

        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(marketplaceAddress)
        await nft.deployed()
        nftAddress = nft.address

        listingCost = await marketplace.getListingCost()
        listingCost = listingCost.toString()
    })

    describe('Deployment', async () => {
        it('Should set the owner of both contracts as contractOwner', async () => {
            expect(await marketplace.owner()).to.equal(contractOwner.address)
            expect(await nft.owner()).to.equal(contractOwner.address)
            // console.log(`contractOwner: ${contractOwner.address}, marketplaceOwner: ${await marketplace.owner()}, nftOwner: ${await nft.owner()}`);
        })

        it('Should set the address of the Marketplace contract as the marketAddress in the NFT contract', async () => {
            expect(await marketplaceAddress).to.equal(await nft.getMarketAddress())
            // console.log(`marketplaceAddress: ${await marketplaceAddress}, nftAddress: ${await nft.getMarketAddress()} `);
        })
    })

    describe('Minting Tokens', async () => {
        beforeEach(async () => {
            await nft.mintToken(contractOwner.address, 0, 5, '0x00')
            await nft.mintToken(contractOwner.address, 1, 10, '0x00')
        })

        it('Should mint the correct quantity of NFTs', async () => {
            const numOfToken0 = await nft.balanceOf(contractOwner.address, 0)
            const numOfToken1 = await nft.balanceOf(contractOwner.address, 1)
            expect(await numOfToken0).to.equal(5)
            expect(await numOfToken1).to.equal(10)
            // console.log("token count: ", noOfToken0, noOfToken1);
        })

        it('Should successfully set the tokenURI of the NFT', async () => {
            await nft.connect(contractOwner).setTokenURI(0, 'https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW-1200-80.jpg')
            await nft
                .connect(contractOwner)
                .setTokenURI(1, 'https://www.dccomics.com/sites/default/files/Marquee_DSM_CH_098_558a03cfde9174.78898221.jpg')
            const token0URI = await nft.getTokenURI(0)
            const token1URI = await nft.getTokenURI(1)
            expect(await token0URI).to.equal('https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW-1200-80.jpg')
            expect(await token1URI).to.equal('https://www.dccomics.com/sites/default/files/Marquee_DSM_CH_098_558a03cfde9174.78898221.jpg')
            // console.log(token0URI, token1URI);
        })
    })

    describe('Market Transactions', async () => {
        listPrice = ethers.utils.parseUnits('10', 'ether')

        beforeEach(async () => {
            await nft.mintToken(contractOwner.address, 0, 5, '0x00')
            await nft.mintToken(contractOwner.address, 1, 10, '0x00')
            await nft.setApprovalForAll(marketplaceAddress, true)
        })

        it('Should successfully list an item for sale', async () => {
            await marketplace.listItemForSale(nftAddress, 0, 1, listPrice)

            const item = await marketplace.getItemById(1)
            expect(await item.isListed).to.equal(true)
            expect(await item.isSold).to.equal(false)
        })

        it('Should throw an error if listPrice < 0', async () => {
            try {
                await marketplace.listItemForSale(nftAddress, 0, 2, 0)
            } catch (err) {
                expect(err).to.throw('Item price must be greater than zero')
            }
        })

        it('Should transfer NFT to buyer when purchase is made', async () => {
            await marketplace.connect(buyer1).purchaseItems(nftAddress, 0, 1, { value: listPrice })
            await marketplace.connect(buyer1).purchaseItems(nftAddress, 1, 1, { value: listPrice })

            const ownerToken0Balance = await nft.balanceOf(contractOwner.address, 0)
            const ownerToken1Balance = await nft.balanceOf(contractOwner.address, 1)
            expect(ownerToken0Balance).to.equal(4)
            expect(ownerToken1Balance).to.equal(9)

            const buyer1Token0Balance = await nft.balanceOf(buyer1.address, 0)
            const buyer1Token1Balance = await nft.balanceOf(buyer1.address, 1)
            expect(buyer1Token0Balance).to.equal(1)
            expect(buyer1Token1Balance).to.equal(1)
        })

        it('Should transfer cost of NFT to seller when purchase is made', async () => {
            const originalOwnerBalance = await provider.getBalance(contractOwner.address)
            const originalBuyerBalance = await provider.getBalance(buyer1.address)

            await marketplace.connect(buyer1).purchaseItems(nftAddress, 0, 1, { value: listPrice })
            await marketplace.connect(buyer1).purchaseItems(nftAddress, 1, 1, { value: listPrice })

            const newOwnerBalance = await provider.getBalance(contractOwner.address)
            const newBuyerBalance = await provider.getBalance(buyer1.address)

            expect(newOwnerBalance).to.equal(originalOwnerBalance + 20)
            expect(newBuyerBalance).to.equal(originalBuyerBalance - 20)
        })
    })

    describe('Listing Permissions', async () => {
        beforeEach(async () => {
            await nft.mintToken(contractOwner.address, 0, 5, '0x00')
            await nft.mintToken(contractOwner.address, 1, 10, '0x00')
            await nft.setApprovalForAll(marketplaceAddress, true)
            await marketplace.listItemForSale(nftAddress, 0, 1, listPrice)
            await marketplace.listItemForSale(nftAddress, 1, 1, listPrice)
        })

        it('Should allow owner of NFT to delist item', () => {})

        it('Should allow owner of NFT to list an item they have purchased', () => {})
    })

    describe('Retrieving Items', async () => {
        beforeEach(async () => {})

        it('Should fetch the correct quantity of NFTs created', () => {})

        it('Should fetch the correct quantity of NFTs Listed', () => {})
    })
})
