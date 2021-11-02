// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts@4.3.2/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable {
    // to store unique URIs for each nft
    mapping(uint256 => string) private _uris;
    address private owner; 
    address nftContractAddress;

    constructor(address marketAddress) ERC1155("VastOcean") {
        nftContractAddress = marketAddress;
    }

    // add URIs for our unique tokens into the mapping 
    function setTokenURI(uint256 _tokenId, string memory newURI) public onlyOwner {
        _uris[_tokenId] = newURI; 
    }

    // replace original URI function to return URIs that exist in our mapping
    function getTokenURI(uint256 _tokenId) public view override returns (string memory) {
        return (_uris[_tokenId]);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
}
