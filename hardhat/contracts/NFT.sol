// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketplaceAddress;

    // to store unique URIs for each nft
    mapping(uint => string) private _uris;

    constructor(address marketAddress) ERC1155("VastOcean") {
        marketplaceAddress = marketAddress;
    }

    // ------------------ Mutative Functions ---------------------- //

    function mintToken(
        address account,
        uint amount,
        bytes memory data
    ) public returns (uint _tokenId) {
        uint tokenId = _tokenIds.current(); 
        _mint(account, tokenId, amount, data);
        _tokenIds.increment(); 
        return _tokenId; 
    }

    function setTokenURI(uint _tokenId, string memory newURI) public {
        bool owner = checkIfOwner(msg.sender, _tokenId);
        require(owner == true);
        require(bytes(_uris[_tokenId]).length == 0, "Cannot set URI twice.");
        _uris[_tokenId] = newURI;
    }

    function burnTokens(
        address from,
        uint _tokenId,
        uint amount
    ) public {
        _burn(from, _tokenId, amount);
    }

    // ------------------ Read Functions ---------------------- //

    function getTokenURI(uint _tokenId) public view returns (string memory) {
        return (_uris[_tokenId]);
    }

    function getMarketAddress() public view returns (address marketAddress) {
        return marketplaceAddress;
    }

    function checkIfOwner(address caller, uint _tokenId) public view returns (bool) {
        if (balanceOf(caller, _tokenId) > 0) {
            return true;
        }
        return false;
    }
}
