//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    Counters.Counter private _itemIds;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Item {
        address nftContract;
        uint256 itemId;
        uint256 quantity;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isSold;
        bool isListed;
    }

    event ItemCreated();
    event ItemSold();

    mapping(uint256 => Item) private itemIdToItem;

    function listItemForSale(
        address nftContract,
        uint256 _tokenId,
        uint256 _quantity,
        uint256 price
    ) public payable nonReentrant {
        itemIdToItem[_tokenId] = Item(nftContract, _tokenId, _quantity, payable(msg.sender), payable(address(0)), price, false, true);
    }

    function getTokenPrice(uint256 _tokenId) public view returns (uint256 price) {
        return itemIdToItem[_tokenId].price;
    }

    function purchaseItem(address nftContract, uint256 itemId) public payable nonReentrant {
        // require msg.value to be a multiple of price
        // transfer item from seller to buyer
        // emit item sold event
    }

    function getAllMarketItems() public view returns (Item[] memory) {}

    function getAllItemsOwned() public view returns (Item[] memory) {}

    function getAllItemsSold() public view returns (Item[] memory) {}

    function transferToken(uint256 _tokenId, address receiver) public {
        // use transferFrom function
    }
}
