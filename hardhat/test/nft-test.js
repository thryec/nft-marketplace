const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Marketplace", function () {
    beforeEach(async () => {
        // deploy Marketplace and NFT contracts
        const Marketplace = await ethers.getContractFactory("Marketplace");
        const marketplace = await Marketplace.deploy("Hello, world!");
        await marketplace.deployed();
        const marketplaceAddress = marketplace.address;

        const NFT = await ethers.getContractFactory("NFT");
        const nft = await NFT.deploy(marketplaceAddress);
        await nft.deployed();
        const nftAddress = nft.address;

        // mint 2-3 items of various quantities
    });

    it("Should transfer NFT to buyer when purchase is made", async function () {});

    it("Should transfer price of NFT to seller when purchase is made", async function () {});

    it("Should allow for transfers of multiple NFTs", async function () {});
});
