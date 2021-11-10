# NFT Marketplace

A simple Ethereum-based NFT Marketplace that allows users to mint ERC1155 tokens, view items in the marketplace, and buy/sell NFTs with other Ethereum accounts.

## Functionality

1. Mint

Users are able to mint individual digital files from their local machine by uploading it with a name, description and price. These piece will be stored on IPFS using the Infura IPFS endpoint, and displayed in the Marketplace for other users to view and purchase.

2. Buy/Sell

Any item that an account mints will be automatically listed and can be bought by another account at the pre-determined price.

3. View Gallery

Users can view all the NFTs they have minted, bought, and sold on the platform.

## Technologies Used

- Hardhat as the Solidity development framework
- ethers.js for interacting with the Ethereum Blockchain and its ecosystem
- Waffle/Chai for testing smart contracts
- React.js to organize and display values on the frontend
- IPFS to store NFT metadata

### Potential Add-Ons

- Implementing royalties to transfer a certain portion of the transaction price to the owner of the marketplace
- Give user option to mint ERC1155 or ERC721
- Allow users to view all NFTs in their wallet (includes other NFT contracts)

### Dependencies to install

- ethers
- Web3Modal
- ipfs-http-client
