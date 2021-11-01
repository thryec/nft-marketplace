//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import 'hardhat/console.sol';

contract Marketplace is ReentrancyGuard {
  constructor(address owner) {
    owner = payable(msg.sender);
  }

  struct Item {
    address nftContract;
    uint256 itemId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool isSold;
    bool isListed;
  }

  struct Collection {
    address owner;
    uint256 numberOfItems;
  }

  // mapping between item struct and collection
  mapping(uint256 => Item) private itemIdToItem;

  function createNewCollection(string collectionName) {}

  function createNewItem(
    address nftContract,
    uint256 _tokenId,
    uint256 price
  ) {}

  function makeItemSale() {}

  function getItemsInCollection() public view returns (Item[] memory) {}

  function getAllItemsOwned() public view returns (Item[] memory) {}

  function getAllItemsSold() public view returns (Item[] memory) {}
}
