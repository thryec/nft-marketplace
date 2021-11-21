# NFT Marketplace

A simple Ethereum-based NFT Marketplace that allows users to mint NFTs, list them on the marketplace, and buy/sell NFTs with other Ethereum accounts.

## Running this project locally:

#### Prerequisites

-   Node.js >= v14.0
-   Hardhat

#### Contracts

-   `cd hardhat`

#### Frontend

-   `cd client`

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
