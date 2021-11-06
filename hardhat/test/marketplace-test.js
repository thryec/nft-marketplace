const {expect} = require("chai");
const {ethers} = require("hardhat");
const BN = require("bn.js");

describe("NFT Marketplace", function () {
    let marketplace;
    let nft;
    let marketplaceAddress;
    let nftAddress;
    let contractOwner;
    let seller1;
    let seller2;
    let buyer1;
    let buyer2;

    beforeEach(async () => {
        [contractOwner, seller1, seller2, buyer1, buyer2] = await ethers.getSigners();

        const Marketplace = await ethers.getContractFactory("Marketplace");
        marketplace = await Marketplace.deploy();
        await marketplace.deployed();
        marketplaceAddress = marketplace.address;

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(marketplaceAddress);
        await nft.deployed();
        nftAddress = nft.address;
    });

    describe("Deployment", async () => {
        it("Should set the owner of both contracts as contractOwner", async () => {
            expect(await marketplace.owner()).to.equal(contractOwner.address);
            expect(await nft.owner()).to.equal(contractOwner.address);
            // console.log(`contractOwner: ${contractOwner.address}, marketplaceOwner: ${await marketplace.owner()}, nftOwner: ${await nft.owner()}`);
        });

        it("Should set the address of the Marketplace contract as the marketAddress in the NFT contract", async () => {
            expect(await marketplaceAddress).to.equal(await nft.getMarketAddress());
            // console.log(`marketplaceAddress: ${await marketplaceAddress}, nftAddress: ${await nft.getMarketAddress()} `);
        });
    });

    describe("Minting Tokens", async () => {
        beforeEach(async () => {
            await nft.mintToken(seller1.address, 0, 5, "0x00");
            await nft.mintToken(seller2.address, 1, 10, "0x00");
        });

        it("Should mint the correct quantity of NFTs", async () => {
            const noOfToken0 = await nft.balanceOf(seller1.address, 0);
            const noOfToken1 = await nft.balanceOf(seller2.address, 1);
            expect(await noOfToken0).to.equal(5);
            expect(await noOfToken1).to.equal(10);
            // console.log("token count: ", noOfToken0, noOfToken1);
        });

        it("Should successfully set the tokenURI of the NFT", async () => {
            await nft.connect(seller1).setTokenURI(0, "https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW-1200-80.jpg");
            await nft
                .connect(seller2)
                .setTokenURI(1, "https://www.dccomics.com/sites/default/files/Marquee_DSM_CH_098_558a03cfde9174.78898221.jpg");
            const token0URI = await nft.getTokenURI(0);
            const token1URI = await nft.getTokenURI(1);
            expect(await token0URI).to.equal("https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW-1200-80.jpg");
            expect(await token1URI).to.equal("https://www.dccomics.com/sites/default/files/Marquee_DSM_CH_098_558a03cfde9174.78898221.jpg");
            // console.log(token0URI, token1URI);
        });
    });

    describe("Market Transactions", async () => {
        it("Should successfully list an item for sale", async () => {});
        it("Should transfer NFT to buyer when purchase is made", async () => {});
        it("Should transfer price of NFT to seller when purchase is made", async () => {});
        it("Should allow for transfers of multiple NFTs", async () => {});
    });

    describe("Listing Permissions", async () => {
        it("Should list minted item for sale", () => {});
        it("Should allow owner of NFT to delist item", () => {});
        it("Should allow owner of NFT to list an item they have purchased", () => {});
    });
});
