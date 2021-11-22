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
    let listPrice = ethers.utils.parseUnits('10', 'ether')
    let royalty = 5
    const provider = ethers.provider

    beforeEach(async () => {
        ;[contractOwner, seller1, seller2, buyer1, buyer2] = await ethers.getSigners()

        const Marketplace = await ethers.getContractFactory('Marketplace')
        marketplace = await Marketplace.deploy(royalty)
        await marketplace.deployed()
        marketplaceAddress = marketplace.address

        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(marketplaceAddress)
        await nft.deployed()
        nftAddress = nft.address
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
            await nft.mintToken('https://ipfs.io/ipfs/QmXmNSH2dyp5R6dkW5MVhNc7xqV9v3NHWxNXJfCL6CcYxS', 5, '0x00')
            await nft.mintToken('https://ipfs.io/ipfs/QmQ35DkX8HHjhkJe5MsMAd4X51iP3MHV5d5dZoee32J83k', 10, '0x00')
        })

        it('Should mint the correct quantity of NFTs', async () => {
            const numOfToken0 = await nft.balanceOf(contractOwner.address, 1)
            const numOfToken1 = await nft.balanceOf(contractOwner.address, 2)
            expect(await numOfToken0).to.equal(5)
            expect(await numOfToken1).to.equal(10)
            // console.log('token count: ', numOfToken0, numOfToken1)
        })

        it('Should successfully set the tokenURI of the NFT', async () => {
            const token0URI = await nft.getTokenURI(1)
            const token1URI = await nft.getTokenURI(2)
            expect(await token0URI).to.equal('https://ipfs.io/ipfs/QmXmNSH2dyp5R6dkW5MVhNc7xqV9v3NHWxNXJfCL6CcYxS')
            expect(await token1URI).to.equal('https://ipfs.io/ipfs/QmQ35DkX8HHjhkJe5MsMAd4X51iP3MHV5d5dZoee32J83k')
            // console.log(token0URI, token1URI)
        })
    })

    describe('Marketplace Transactions', async () => {
        beforeEach(async () => {
            await nft.mintToken('https://ipfs.io/ipfs/QmXmNSH2dyp5R6dkW5MVhNc7xqV9v3NHWxNXJfCL6CcYxS', 5, '0x00')
            await nft
                .connect(seller1)
                .mintToken('https://ipfs.io/ipfs/QmSHwbRKSMEebYR8kSEzqm2an9FRJvuL7U9sARxwLS3kYo/', 10, '0x00')
            await nft
                .connect(seller2)
                .mintToken('https://ipfs.io/ipfs/QmdkkCULcRZKQBTRLZGZnFSAwD65uL77AXPvB7rc3QVwnP', 15, '0x00')
            await marketplace.connect(seller1).listItemsForSale(nftAddress, 2, 1, listPrice)
            await marketplace.connect(seller2).listItemsForSale(nftAddress, 3, 1, listPrice)
        })

        it('Should successfully list items for sale', async () => {
            const seller1Item = await marketplace.getItemById(1)
            const seller2Item = await marketplace.getItemById(2)

            expect(await seller1Item.isListed).to.be.true
            expect(await seller2Item.isListed).to.be.true
        })

        it('Should throw an error if listPrice < 0', async () => {
            await expect(marketplace.listItemsForSale(nftAddress, 1, 2, 0)).to.be.revertedWith(
                'Item price must be greater than zero'
            )
        })

        it('Should transfer NFT to buyer when purchase is made', async () => {
            await marketplace.connect(buyer1).purchaseItem(nftAddress, 1, { value: listPrice })
            await marketplace.connect(buyer2).purchaseItem(nftAddress, 2, { value: listPrice })

            const seller1TokenBalance = await nft.balanceOf(seller1.address, 2)
            const seller2TokenBalance = await nft.balanceOf(seller2.address, 3)
            expect(seller1TokenBalance).to.equal(9)
            expect(seller2TokenBalance).to.equal(14)
            // console.log('seller1: ', seller1TokenBalance, 'seller2: ', seller2TokenBalance)

            const buyer1TokenBalance = await nft.balanceOf(buyer1.address, 2)
            const buyer2TokenBalance = await nft.balanceOf(buyer2.address, 3)
            expect(buyer1TokenBalance).to.equal(1)
            expect(buyer2TokenBalance).to.equal(1)
            // console.log('buyer1: ', buyer1TokenBalance, 'buyer2: ', buyer2TokenBalance)
        })

        it('Should transfer royalties to marketplace and remaining cost of NFT to seller when purchase is made', async () => {
            const originalMarketplaceBalance = await provider.getBalance(contractOwner.address)
            const originalSellerBalance = await provider.getBalance(seller1.address)
            const originalBuyerBalance = await provider.getBalance(buyer1.address)

            await marketplace.connect(buyer1).purchaseItem(nftAddress, 1, { value: listPrice })
            await marketplace.connect(buyer1).purchaseItem(nftAddress, 2, { value: listPrice })

            const newMarketplaceBalance = await provider.getBalance(contractOwner.address)
            const newSellerBalance = await provider.getBalance(seller1.address)
            const newBuyerBalance = await provider.getBalance(buyer1.address)

            // console.log('change in seller balance: ', newSellerBalance - originalSellerBalance)
            // console.log('change in buyer balance: ', newBuyerBalance - originalBuyerBalance)
            // console.log('change in Marketplace balance: ', newMarketplaceBalance - originalMarketplaceBalance)
            // console.log('listPrice in wei: ', listPrice.toString())

            expect(newSellerBalance - originalSellerBalance > (listPrice * (1 - royalty)) / 100).to.be.true
            expect(originalBuyerBalance - newBuyerBalance > listPrice * 2).to.be.true
            expect(originalMarketplaceBalance - newMarketplaceBalance < listPrice * (royalty / 100) * 2).to.be.true
        })
    })

    describe('Listing Permissions', async () => {
        beforeEach(async () => {
            await nft.mintToken('https://ipfs.io/ipfs/QmXmNSH2dyp5R6dkW5MVhNc7xqV9v3NHWxNXJfCL6CcYxS', 5, '0x00')
            await nft.mintToken('https://ipfs.io/ipfs/QmQ35DkX8HHjhkJe5MsMAd4X51iP3MHV5d5dZoee32J83k', 10, '0x00')
            await marketplace.listItemsForSale(nftAddress, 1, 1, listPrice)
            await marketplace.listItemsForSale(nftAddress, 2, 1, listPrice)
        })

        it('Should allow owner of NFT to delist item', async () => {
            const originalListedItems = await marketplace.connect(seller1).getListedItems()
            await marketplace.delistItem(1)
            const newListedItems = await marketplace.connect(seller1).getListedItems()
            expect(originalListedItems.length - newListedItems.length).to.equal(1)
        })

        it('Should allow owner of NFT to list an item they have purchased', async () => {
            await marketplace.connect(buyer1).purchaseItem(nftAddress, 1, { value: listPrice })
            const originalListedItems = await marketplace.getListedItems()
            // console.log('originalListedItems: ', originalListedItems)
            await marketplace.connect(buyer1).relistItem(1)
            const newListedItems = await marketplace.getListedItems()
            // console.log('newListedItems: ', newListedItems)
            expect(newListedItems.length - originalListedItems.length).to.equal(1)
        })
    })

    describe('Retrieving Items', async () => {
        beforeEach(async () => {
            await nft
                .connect(seller1)
                .mintToken('https://ipfs.io/ipfs/QmXmNSH2dyp5R6dkW5MVhNc7xqV9v3NHWxNXJfCL6CcYxS', 10, '0x00')
            await nft
                .connect(seller1)
                .mintToken('https://ipfs.io/ipfs/QmQ35DkX8HHjhkJe5MsMAd4X51iP3MHV5d5dZoee32J83k', 5, '0x00')
            await marketplace.connect(seller1).listItemsForSale(nftAddress, 1, 2, listPrice)
            await marketplace.connect(seller1).listItemsForSale(nftAddress, 2, 2, listPrice)
        })

        it('Should fetch the correct quantity of NFTs created', async () => {
            const seller1Tokens = await marketplace.connect(seller1).getItemsCreated()
            expect(seller1Tokens.length).to.equal(4)
        })

        it('Should fetch the correct quantity of NFTs owned', async () => {
            const originalSeller1Tokens = await marketplace.connect(seller1).getItemsOwned()

            await marketplace.connect(buyer1).purchaseItem(nftAddress, 1, { value: listPrice })
            await marketplace.connect(buyer2).purchaseItem(nftAddress, 3, { value: listPrice })

            const newSeller1Tokens = await marketplace.connect(seller1).getItemsOwned()
            const buyer1Owned = await marketplace.connect(buyer1).getItemsOwned()
            const buyer2Owned = await marketplace.connect(buyer2).getItemsOwned()

            const buyer1Tokens = await nft.balanceOf(buyer1.address, 1)
            const buyer2Tokens = await nft.balanceOf(buyer2.address, 2)

            expect(newSeller1Tokens.length - originalSeller1Tokens.length).to.equal(-2)
            expect(buyer1Owned.length).to.equal(1)
            expect(buyer2Owned.length).to.equal(1)
            expect(buyer1Owned.length).to.equal(buyer1Tokens)
            expect(buyer2Owned.length).to.equal(buyer2Tokens)
        })
    })
})
