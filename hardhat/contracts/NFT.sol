// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';

contract NFT is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketplaceAddress;

    // to store unique URIs for each nft
    mapping(uint => string) private _uris;

    constructor(address marketAddress) ERC1155('VastOcean') {
        marketplaceAddress = marketAddress;
    }

    // ------------------ Mutative Functions ---------------------- //

    function mintToken(
        string memory tokenURI,
        uint quantity,
        bytes memory data
    ) public returns (uint _tokenId) {
        _tokenIds.increment();
        uint currentTokenId = _tokenIds.current();

        _mint(msg.sender, currentTokenId, quantity, data);
        console.log('done minting token');
        setApprovalForAll(marketplaceAddress, true);
        console.log('done setting approval');
        setTokenURI(currentTokenId, tokenURI);
        console.log('done setting URI');

        return _tokenId;
    }

    function setTokenURI(uint _tokenId, string memory newURI) public {
        bool owner = checkIfOwner(msg.sender, _tokenId);
        require(owner == true);
        require(bytes(_uris[_tokenId]).length == 0, 'Cannot set URI twice.');
        _uris[_tokenId] = newURI;
    }

    function burnTokens(
        address from,
        uint _tokenId,
        uint quantity
    ) public {
        _burn(from, _tokenId, quantity);
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
