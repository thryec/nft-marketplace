//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Item {
        address nftContract;
        uint256 tokenId;
        uint256 itemId;
        uint256 quantity;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isListed;
        bool isSold;
    }

    event ItemStatusChange(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 indexed itemId,
        uint256 quantity,
        address seller,
        address owner,
        uint256 price,
        bool isListed,
        bool isSold
    );

    mapping(uint256 => Item) private itemIdToItem;

    function getTokenPrice(uint256 _tokenId) public view returns (uint256 price) {
        return itemIdToItem[_tokenId].price;
    }

    function listItemForSale(
        address nftContract,
        uint256 _tokenId,
        uint256 _quantity,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be least 1 wei");
        require(msg.value == price);

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        itemIdToItem[itemId] = Item(
            nftContract,
            _tokenId,
            itemId,
            _quantity,
            payable(msg.sender),
            payable(address(0)),
            price,
            false,
            true
        );

        emit ItemStatusChange(nftContract, _tokenId, itemId, _quantity, address(0), msg.sender, price, true, false);
    }

    function purchaseItem(
        address nftContract,
        uint256 _itemId,
        uint256 _quantity
    ) public payable nonReentrant {
        uint price = itemIdToItem[_itemId].price;
        uint tokenId = itemIdToItem[_itemId].tokenId;
        require(
            msg.value == price * _quantity,
            "Please submit the correct amount of coins for desired quantity and price."
        );

        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, _quantity, "0x00");

        emit ItemStatusChange(nftContract, tokenId, _itemId, _quantity, address(this), msg.sender, price, true, true);
    }

    function getListedItems() public view returns (Item[] memory) {}

    function getItemsOwned() public view returns (Item[] memory) {}

    function getItemsSold() public view returns (Item[] memory) {}

}
