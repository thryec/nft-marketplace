// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";


contract NFT is ERC1155, Ownable {
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds; 
    address nftContractAddress;

    // to store unique URIs for each nft
    mapping(uint256 => string) private _uris;

    constructor(address marketAddress) ERC1155("VastOcean") {
        nftContractAddress = marketAddress;
    }

    // add URIs for our unique tokens into the mapping
    function setTokenURI(uint256 _tokenId, string memory newURI) public onlyOwner {
        require(bytes(_uris[_tokenId]).length == 0, "Cannot set URI twice.");
        _uris[_tokenId] = newURI;
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        return (_uris[_tokenId]);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        _mintBatch(to, ids, amounts, data);
    }
}
