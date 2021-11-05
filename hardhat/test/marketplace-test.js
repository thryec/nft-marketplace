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

    it("Should list item for sale", async function () {
        expect(await marketplace.greet()).to.equal("Hello, world!");
        const setGreetingTx = await marketplace.setGreeting("Hola, mundo!");
        await setGreetingTx.wait();
        expect(await marketplace.greet()).to.equal("Hola, mundo!");
    });

    it("Should allow owner of NFT to delist item", async function () {});

    it("Should allow owner of NFT to list an item they have purchased", async function () {});
});
