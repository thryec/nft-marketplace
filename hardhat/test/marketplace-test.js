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
    let listingCost
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
            await nft.mintToken(seller1.address, 0, 5, '0x00')
            await nft.mintToken(seller2.address, 1, 10, '0x00')
        })

        it('Should mint the correct quantity of NFTs', async () => {
            const noOfToken0 = await nft.balanceOf(seller1.address, 0)
            const noOfToken1 = await nft.balanceOf(seller2.address, 1)
            expect(await noOfToken0).to.equal(5)
            expect(await noOfToken1).to.equal(10)
            // console.log("token count: ", noOfToken0, noOfToken1);
        })

        it('Should successfully set the tokenURI of the NFT', async () => {
            await nft.connect(seller1).setTokenURI(0, 'https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW-1200-80.jpg')
            await nft
                .connect(seller2)
                .setTokenURI(1, 'https://www.dccomics.com/sites/default/files/Marquee_DSM_CH_098_558a03cfde9174.78898221.jpg')
            const token0URI = await nft.getTokenURI(0)
            const token1URI = await nft.getTokenURI(1)
            expect(await token0URI).to.equal('https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW-1200-80.jpg')
            expect(await token1URI).to.equal('https://www.dccomics.com/sites/default/files/Marquee_DSM_CH_098_558a03cfde9174.78898221.jpg')
            // console.log(token0URI, token1URI);
        })
    })

    describe('Market Transactions', async () => {
        const listPrice = ethers.utils.parseUnits('10', 'ether')

        beforeEach(async () => {
            await nft.mintToken(seller1.address, 0, 5, '0x00')
            await nft.mintToken(seller2.address, 1, 10, '0x00')
            await nft.setApprovalForAll(marketplaceAddress, true)
        })

        it('Should successfully list an item for sale', async () => {
            const sellerWallet = await provider.getBalance(seller1.address)
            const sellerBalance = sellerWallet.toString()
            console.log('sellerWallet: ', sellerBalance)

            const marketplaceWallet = await provider.getBalance(marketplaceAddress)
            const marketBalance = marketplaceWallet.toString()
            console.log('marketplace wallet', marketBalance)
            // await marketplace.listItemForSale(nftAddress, 0, 2, listPrice, { value: listPrice })
            // const item = await marketplace.getItemById(0)

            // expect(await item.isListed).to.equal(true)
            // expect(await item.isSold).to.equal(false)

            // console.log('Listed Items: ', item)
        })

        it('Should throw an error if listPrice < 0', async () => {
            // const listAttempt = await marketplace.listItemForSale(nftAddress, 0, 2, listPrice, { value: listPrice })
            // expect(listAttempt).to.throw('Price of item must be least 1 wei')
        })

        it('Should transfer NFT to buyer when purchase is made', async () => {
            // await marketplace.connect(buyer1).purchaseItems(nftAddress, 0, 1, { value: listPrice })
            // await marketplace.connect(buyer2).purchaseItems(nftAddress, 1, 2, { value: listPrice * 2 })
            // balance of token0 of seller1 should be 4, buyer1 should be 1
            // balance of token1 of seller2 should be 3, buyer2 should be 2
        })

        it('Should transfer cost of NFT to seller when purchase is made', async () => {
            // await marketplace.connect(buyer1).purchaseItems(nftAddress, 0, 1, { value: listPrice })
            // balance of eth in seller1 wallet should be +10 eth, buyer 1 wallet should be -10eth
        })
    })

    describe('Listing Permissions', async () => {
        it('Should allow owner of NFT to delist item', () => {})
        it('Should allow owner of NFT to list an item they have purchased', () => {})
    })
})
