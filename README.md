# NFT Marketplace

A simple Ethereum-based NFT Marketplace that allows users to mint NFTs, list them on the marketplace, and buy/sell NFTs with other Ethereum accounts.

## Running this project locally

#### Prerequisites

-   Node.js >= v14.0
-   Metamask Wallet installed in the browser
-   Hardhat

#### Local Setup

1. Clone this repository and `cd` into the folder:

```
git clone https://github.com/thryec/nft-marketplace.git
cd nft-marketplace=
```

2. Change into the hardhat folder and install the required dependencies

```
cd hardhat
npm install
```

3. Set up Environment Variables:

    - Create a `.env` file directly under the Hardhat folder using `touch .env`
    - Define your Rinkeby API endpoint and wallet private key in the `.env` file
    - In `hardhat.config.js`, add `require('dotenv').config()` at the top, and make sure the variable names for your API URL and private key correspond to those in `.env`

4. Check that contracts properly compile: `hardhat compile`
5. Run tests on both contracts: `hardhat test`

6. Deploy contracts to the Rinkeby testnet:

    - `hardhat run scripts/deploy.js --network rinkeby`
    - This will return you the address of the deployed NFT and Marketplace contracts on Rinkeby printed in the console
    - Replace these addresses in the `config.js` file found in the root of the repository

7. Start the app:

```
cd client
npm install
npm run dev
```

## Features

1. Mint

Users are able to mint individual digital files from their local machine by uploading it with a name, description and price. These piece will be stored on IPFS using the Infura IPFS endpoint, and displayed in the Marketplace for other users to view and purchase.

2. Buy/Sell

Any item that an account mints will be automatically listed and can be bought by another account at the pre-determined price.

3. View Gallery

Users can view all the NFTs they have minted, bought, and sold on the platform.

4. Royalties

A percentage of the sale price will go to the marketplace contract whenever a sale occurs. The amount of royalties is declared in the constructor when deploying the marketplace contract.

## Dependencies

-   Hardhat
-   ethers.js
-   Chai
-   React.js
-   IPFS
-   Web3Modal
-   dotenv
