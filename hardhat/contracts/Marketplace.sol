//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import 'hardhat/console.sol';

contract Marketplace is ReentrancyGuard {
  Counters.Counter private _itemIds;
  Counters.Counter private _collectionIds;

  address payable owner;

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
    uint256 collectionId;
    address owner;
    address nftContract;
    uint256 numberOfItems;
  }

  constructor() {
    owner = payable(msg.sender);
  }

  mapping(uint256 => Item) private itemIdToItem;
  mapping(uint256 => Collection) private collectionIdToCollection;

  function createNewCollection(string memory collectionName) public {}

  function createNewItem(
    address nftContract,
    uint256 _tokenId,
    uint256 price
  ) public {}

  function makeItemSale() public payable nonReentrant {}

  function getAllMarketItems() public view returns (Item[] memory) {}

  function getItemsInCollection(string memory collection)
    public
    view
    returns (Item[] memory)
  {}

  function getAllItemsOwned() public view returns (Item[] memory) {}

  function getAllItemsSold() public view returns (Item[] memory) {}

  function transferToken(uint256 _tokenId, address receiver) public {}
}
