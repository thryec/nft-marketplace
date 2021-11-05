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
        uint tokenId;
        uint itemId;
        uint quantity;
        address creator;
        address payable seller;
        address payable owner;
        uint price;
        bool isListed;
        bool isSold;
    }

    event ItemListed(
        address indexed nftContract,
        uint indexed tokenId,
        uint indexed itemId,
        uint quantity,
        address creator,
        address seller,
        address owner,
        uint price,
        bool isListed,
        bool isSold
    );

    mapping(uint => Item) private itemIdToItem;

    function getTokenPrice(uint _tokenId) public view returns (uint price) {
        return itemIdToItem[_tokenId].price;
    }

    function listItemForSale(
        address nftContract,
        uint _tokenId,
        uint _quantity,
        uint price
    ) public payable nonReentrant {
        require(price > 0, "Price must be least 1 wei");
        require(msg.value == price);

        _itemIds.increment();
        uint itemId = _itemIds.current();

        itemIdToItem[itemId] = Item(
            nftContract,
            _tokenId,
            itemId,
            _quantity,
            msg.sender,
            payable(msg.sender),
            payable(address(0)),
            price,
            false,
            true
        );

        emit ItemListed(
            nftContract,
            _tokenId,
            itemId,
            _quantity,
            msg.sender,
            msg.sender,
            address(0),
            price,
            true,
            false
        );
    }

    function purchaseItem(
        address nftContract,
        uint _itemId,
        uint _quantity
    ) public payable nonReentrant {
        uint price = itemIdToItem[_itemId].price;
        uint _tokenId = itemIdToItem[_itemId].tokenId;
        require(
            msg.value == price * _quantity,
            "Please submit the correct amount of coins for desired quantity and price."
        );

        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, _tokenId, _quantity, "0x00");
    }

    function getListedItems() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemsListedCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (itemIdToItem[i + 1].isListed == true) {
                itemsListedCount++;
            }
        }

        Item[] memory listedItems = new Item[](itemsListedCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (itemIdToItem[i + 1].isListed == true) {
                uint thisItemId = itemIdToItem[i + 1].itemId;
                Item storage thisItem = itemIdToItem[thisItemId];
                listedItems[i] = thisItem;
            }
        }
        return listedItems;
    }

    function getItemsOwned() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint myItemsCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (itemIdToItem[i + 1].owner == msg.sender) {
                myItemsCount++;
            }
        }

        Item[] memory ownedItems = new Item[](myItemsCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (itemIdToItem[i + 1].owner == msg.sender) {
                uint thisItemId = itemIdToItem[i + 1].itemId;
                Item storage thisItem = itemIdToItem[thisItemId];
                ownedItems[i] = thisItem;
            }
        }
        return ownedItems;
    }

    function getItemsCreated() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint creationCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (itemIdToItem[i + 1].creator == msg.sender) {
                creationCount++;
            }
        }

        Item[] memory createdItems = new Item[](creationCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (itemIdToItem[i + 1].creator == msg.sender) {
                uint thisItemId = itemIdToItem[i + 1].itemId;
                Item storage thisItem = itemIdToItem[thisItemId];
                createdItems[i] = thisItem;
            }
        }
        return createdItems;
    }

    function delistItem(uint _itemId) public {
        require(msg.sender == itemIdToItem[_itemId].owner);
        itemIdToItem[_itemId].isListed = false;
    }

    function transferItemToAddress(
        address nftContract,
        address receiver,
        uint _tokenId,
        uint _quantity
    ) public {
        IERC1155(nftContract).safeTransferFrom(msg.sender, receiver, _tokenId, _quantity, "0x00");
    }
}
