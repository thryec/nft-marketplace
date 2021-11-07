//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';

contract Marketplace is ERC1155Holder, Ownable, ReentrancyGuard {
    // ------------------ Variable Declarations ---------------------- //
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    uint listingCost = 0.025 ether;
    address payable marketplaceOwner;
    mapping(uint => Item) private itemsMapping;

    /// Sets the owner of the Marketplace contract as the contract deployer
    constructor() {
        marketplaceOwner = payable(msg.sender);
    }

    /// Initialize a struct to contain the information required for items listed on the Marketplace
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

    // ------------------ Events ---------------------- //

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

    // ------------------ Mutative Functions ---------------------- //

    function listItemForSale(
        address nftContract,
        uint _tokenId,
        uint _quantity,
        uint price
    ) public payable nonReentrant {
        // require(msg.value == listingCost, 'ETH sent must equal to listing cost');
        require(price > 0, 'Item price must be greater than zero');

        _itemIds.increment();
        uint itemId = _itemIds.current();
        itemsMapping[itemId] = Item(
            nftContract,
            _tokenId,
            itemId,
            _quantity,
            msg.sender,
            payable(msg.sender),
            payable(address(0)),
            price,
            true,
            false 
        );
        // console.log('listItemForSale msg.sender: ', msg.sender); 
        IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), _tokenId, _quantity, '0x00');

        emit ItemListed(nftContract, _tokenId, itemId, _quantity, msg.sender, msg.sender, address(0), price, true, false);
    }

    function purchaseItems(
        address nftContract,
        uint _itemId,
        uint _quantity
    ) public payable nonReentrant {
        uint price = itemsMapping[_itemId].price;
        uint _tokenId = itemsMapping[_itemId].tokenId;
        require(msg.value == price, 'Please submit the correct amount of coins for desired quantity and price.');

        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, _tokenId, _quantity, '0x00');
    }

    function delistItem(uint _itemId) public {
        require(msg.sender == itemsMapping[_itemId].owner);
        itemsMapping[_itemId].isListed = false;
    }

    function relistItem(uint _itemId) public {
        require(msg.sender == itemsMapping[_itemId].owner);
        itemsMapping[_itemId].isListed = true;
    }

    function transferItemToAddress(
        address nftContract,
        address receiver,
        uint _tokenId,
        uint _quantity
    ) public {
        IERC1155(nftContract).safeTransferFrom(msg.sender, receiver, _tokenId, _quantity, '0x00');
    }

    // ------------------ Read Functions ---------------------- //

    function getListingCost() public view returns (uint) {
        return listingCost;
    }

    function getTokenPrice(uint _tokenId) public view returns (uint price) {
        return itemsMapping[_tokenId].price;
    }

    function getItemById(uint _tokenId) public view returns (Item memory) {
        return itemsMapping[_tokenId];
    }

    function getListedItems() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemsListedCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (itemsMapping[i + 1].isListed == true) {
                itemsListedCount++;
            }
        }

        Item[] memory listedItems = new Item[](itemsListedCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (itemsMapping[i + 1].isListed == true) {
                uint thisItemId = itemsMapping[i + 1].itemId;
                Item storage thisItem = itemsMapping[thisItemId];
                listedItems[i] = thisItem;
            }
        }
        return listedItems;
    }

    function getItemsOwned() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint myItemsCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (itemsMapping[i + 1].owner == msg.sender) {
                myItemsCount++;
            }
        }

        Item[] memory ownedItems = new Item[](myItemsCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (itemsMapping[i + 1].owner == msg.sender) {
                uint thisItemId = itemsMapping[i + 1].itemId;
                Item storage thisItem = itemsMapping[thisItemId];
                ownedItems[i] = thisItem;
            }
        }
        return ownedItems;
    }

    function getItemsCreated() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint creationCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (itemsMapping[i + 1].creator == msg.sender) {
                creationCount++;
            }
        }

        Item[] memory createdItems = new Item[](creationCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (itemsMapping[i + 1].creator == msg.sender) {
                uint thisItemId = itemsMapping[i + 1].itemId;
                Item storage thisItem = itemsMapping[thisItemId];
                createdItems[i] = thisItem;
            }
        }
        return createdItems;
    }
}
