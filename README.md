# NFT Marketplace

A simple Ethereum-based NFT Marketplace that allows users to mint ERC721, view items in the marketplace, and buy/sell NFTs with other Ethereum accounts.

## Functionality

Site will prompt the users to connect via the wallet of their choice, typically Metamask. After connecting, the site will display on separate pages, the NFTs that the user has minted, and those they have collected.

1. Mint

Users are able to mint individual digital files from their local machine by uploading it with a name, description and price. These piece will be stored on IPFS using the Infura IPFS endpoint, and displayed in the Marketplace for other users to peruse and purchase.

2. Buy/Sell

Any item that an account mints will be automatically listed and can be bought by another account at the pre-determined price.

3. View Gallery

Users can view all the NFTs they have minted, bought, and sold on the platform.

## Technologies Used

- Hardhat as the Solidity development framework
- ethers.js for interacting with the Ethereum Blockchain and its ecosystem
- Waffle/Chai for testing smart contracts
- React.js to organize and display values on the frontend
- IPFS to store tokenURIs of the user's NFTs

### Potential Add-Ons

- Pull data from wallet to view all NFTs in users' wallets
- Allow users to toggle between Listing/De-Listing their minted NFTs.
- Transfer function that allows user to transfer existing NFTs to other users' wallets.
