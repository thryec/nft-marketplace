require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: "0.8.3",
    defaultNetwork: "hardhat",
    networks: {
        rinkeby: {
            url: process.env.STAGING_ALCHEMY_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
        mainnet: {
            chainId: 1,
            url: process.env.PROD_ALCHEMY_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};
