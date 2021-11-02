const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Marketplace", function () {
    it("Should list item for sale", async function () {
        const Marketplace = await ethers.getContractFactory("Marketplace");
        const marketplace = await Marketplace.deploy("Hello, world!");
        await marketplace.deployed();

        expect(await marketplace.greet()).to.equal("Hello, world!");

        const setGreetingTx = await marketplace.setGreeting("Hola, mundo!");

        await setGreetingTx.wait();

        expect(await marketplace.greet()).to.equal("Hola, mundo!");
    });
});
