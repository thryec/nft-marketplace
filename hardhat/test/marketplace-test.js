const {expect} = require("chai");
const {ethers} = require("hardhat");
const BN = require("bn.js");

describe("Marketplace", function () {
    let Marketplace;
    let NFT;
    let contractOwner;
    let seller1;
    let seller2;
    let buyer1;
    let buyer2;

    before(async () => {
        [contractOwner, seller1, seller2, buyer1, buyer2] = await ethers.getSigners();
        // deploy Marketplace and NFT contracts
        Marketplace = await ethers.getContractFactory("Marketplace");
        const marketplace = await Marketplace.deploy("Hello, world!");
        await marketplace.deployed();
        const marketplaceAddress = marketplace.address;

        NFT = await ethers.getContractFactory("NFT");
        const nft = await NFT.deploy(marketplaceAddress);
        await nft.deployed();
        const nftAddress = nft.address;

        console.log(`Marketplace deployed at ${marketplaceAddress}, NFT deployed at ${nftaddress}`);
        // mint 2-3 items of various quantities
    });

    describe("Deployment", async () => {
        it("Should set the owner of both contracts as contractOwner", () => {});
        it("Should set the address of the Marketplace contract in the NFT contract correctly", () => {});
        it("Should show a balance of >0 tokens in creator's wallet", () => {});
    });

    describe("Transactions", async () => {
        it("Should transfer NFT to buyer when purchase is made", async function () {});
        it("Should transfer price of NFT to seller when purchase is made", async function () {});
        it("Should allow for transfers of multiple NFTs", async function () {});
    });

    describe("Listing Permissions", async () => {
        it("Should list minted item for sale", () => {});
        it("Should allow owner of NFT to delist item", () => {});
        it("Should allow owner of NFT to list an item they have purchased", () => {});
    });
});
