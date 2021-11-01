// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address nftContractAddress;

  constructor(address marketAddress) ERC721('myNFT', 'NFTCollection') {
    nftContractAddress = marketAddress;
  }

  function createNFT(string memory tokenURI) public returns (uint256) {
    _tokenIds.increment();
    uint256 itemId = _tokenIds.current();
    _safeMint(msg.sender, itemId);
    _setTokenURI(itemId, tokenURI);
    return itemId;
  }
}
