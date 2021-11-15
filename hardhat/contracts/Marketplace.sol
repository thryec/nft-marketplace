//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';

contract Marketplace is ERC1155Holder, Ownable, ReentrancyGuard {
    // ------------------ Variable Declarations ---------------------- //
    // itemId to keep track of the number of items listed for sale on the marketplace.
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    // royalties will be charged as a percentage of an item's sale price. This value is defined in the constructor upon deployment and will accept integers between 0 - 100.
    uint royalties;
    address payable marketplaceOwner;
    mapping(uint => Item) private itemsMapping;

    /// Sets the owner of the Marketplace contract as the contract deployer
    constructor(uint royalty) {
        marketplaceOwner = payable(msg.sender);
        royalties = royalty;
    }

    /// Initialize a struct to contain the information required for items listed on the Marketplace
    struct Item {
        address nftAddress;
        uint tokenId;
        uint itemId;
        // uint editions; 
        uint quantityListed;
        address creator;
        address payable seller;
        address payable owner;
        uint price;
        bool isListed;
    }

    // ------------------ Events ---------------------- //

    event ItemListed(
        address indexed nftAddress,
        uint indexed tokenId,
        uint indexed itemId,
        // uint editions, 
        uint quantityListed,
        address creator,
        address seller,
        address owner,
        uint price,
        bool isListed
    );

    // ------------------ Mutative Functions ---------------------- //

    function listItemForSale(
        address nftAddress,
        uint _tokenId,
        uint _quantity,
        uint price
    ) public payable nonReentrant {
        require(price > 0, 'Item price must be greater than zero');

        _itemIds.increment();
        uint itemId = _itemIds.current();
        itemsMapping[itemId] = Item(
            nftAddress,
            _tokenId,
            itemId,
            _quantity,
            msg.sender,
            payable(msg.sender),
            payable(msg.sender),
            price,
            true
        );

        IERC1155(nftAddress).safeTransferFrom(msg.sender, address(this), _tokenId, _quantity, '0x00');

        emit ItemListed(nftAddress, _tokenId, itemId, _quantity, msg.sender, msg.sender, address(0), price, true);
    }

    function purchaseItems(
        address nftAddress,
        uint _itemId,
        uint _quantity
    ) public payable nonReentrant {
        uint price = itemsMapping[_itemId].price;
        uint _tokenId = itemsMapping[_itemId].tokenId;
        bool isForSale = itemsMapping[_itemId].isListed;

        require(isForSale == true, 'Item requested is not for sale.');
        require(msg.value == price, 'Please submit the correct amount of coins for desired quantity and price.');

        uint royaltiesToMarketplace = (royalties * msg.value / 100);
        uint etherToSeller = msg.value - royaltiesToMarketplace;

        // console.log('msgvalue: ', msg.value); 
        // console.log('royalty %: ', royalties * msg.value); 
        // console.log('royalties: ', royaltiesToMarketplace, 'to seller: ', etherToSeller); 

        IERC1155(nftAddress).safeTransferFrom(address(this), msg.sender, _tokenId, _quantity, '0x00');
        payable(marketplaceOwner).transfer(royaltiesToMarketplace);
        itemsMapping[_itemId].seller.transfer(etherToSeller);
        itemsMapping[_itemId].owner = payable(msg.sender);
        itemsMapping[_itemId].quantityListed = itemsMapping[_itemId].quantityListed - _quantity;
        itemsMapping[_itemId].isListed = false;
    }

    function delistItem(uint _itemId) public {
        address itemOwner = itemsMapping[_itemId].owner;
        // console.log('msg.sender: ', msg.sender, 'owner: ', itemOwner);
        require(msg.sender == itemOwner, 'msg sender is not owner of item');
        itemsMapping[_itemId].isListed = false;
    }

    function relistItem(uint _itemId) public {
        require(msg.sender == itemsMapping[_itemId].owner, 'msg sender is not owner of item');
        itemsMapping[_itemId].isListed = true;
    }

    function transferItemToAddress(
        address nftAddress,
        address receiver,
        uint _tokenId,
        uint _quantity
    ) public {
        IERC1155(nftAddress).safeTransferFrom(msg.sender, receiver, _tokenId, _quantity, '0x00');
    }

    // ------------------ Read Functions ---------------------- //

    function getItemPrice(uint _itemId) public view returns (uint price) {
        return itemsMapping[_itemId].price;
    }

    function getItemById(uint _itemId) public view returns (Item memory) {
        return itemsMapping[_itemId];
    }

    function getListedItems() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemsListedCount = 0;
        uint resultItemId = 0;

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
                listedItems[resultItemId] = thisItem;
                resultItemId++;
            }
        }
        return listedItems;
    }

    function getItemsOwned() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint myItemsCount = 0;
        uint resultItemId = 0;

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
                ownedItems[resultItemId] = thisItem;
                resultItemId++;
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
