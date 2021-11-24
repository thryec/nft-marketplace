// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';

contract NFT is ERC1155, Ownable {
    /// @notice _tokenIds to keep track of the number of NFTs minted
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice address of the Marketplace to list the NFTs on. Initialized in the constructor.
    address public marketplaceAddress;

    mapping(uint => string) private _uris;

    /// @notice initializes marketplace address to be used for setting approvals to allow marketplace to manage tokens.
    constructor(address marketAddress) ERC1155('VastOcean') {
        marketplaceAddress = marketAddress;
    }

    // ------------------ Mutative Functions ---------------------- //

    /**
        @notice Mints ERC1155 tokens to the caller's wallet. 
        @dev Sets approval for the marketplace address to allows listings, and sets the tokenURI in the _uris mapping. 
        @param tokenURI metadata of the NFT to be minted 
        @param quantity number of NFTs to be minted 
        @return _tokenId of the NFT minted 
    */
    function mintToken(
        string memory tokenURI,
        uint quantity,
        bytes memory data
    ) public returns (uint _tokenId) {
        _tokenIds.increment();
        uint currentTokenId = _tokenIds.current();

        _mint(msg.sender, currentTokenId, quantity, data);
        setApprovalForAll(marketplaceAddress, true);
        setTokenURI(currentTokenId, tokenURI);

        return _tokenId;
    }

    /**
        @notice Sets the token URI in the mapping for each NFT when minted.
        @dev Called by the mintToken function. Limits the URI for each token to 1. 
        @param _tokenId token whose URI is to be set 
        @param newURI URI to add for this tokenId 
    */
    function setTokenURI(uint _tokenId, string memory newURI) public {
        bool owner = checkIfOwner(_tokenId);
        require(owner == true, 'Function caller is not the owner of the token');
        require(bytes(_uris[_tokenId]).length == 0, 'Cannot set URI twice.');
        _uris[_tokenId] = newURI;
    }

    /**
        @notice Allows the owner of the NFT to send it to the zero address. To be implemented on frontend in future.  
        @dev Throws an error if the person calling the burn function is not the owner of the NFT. 
        @param _tokenId Id of the token to be burned 
        @param quantity amount of the token to be burned 
    */
    function burnTokens(uint _tokenId, uint quantity) public {
        bool isOwner = checkIfOwner(_tokenId);
        require(isOwner == true, 'Function caller is not the owner of the token');
        _burn(msg.sender, _tokenId, quantity);
    }

    // ------------------ Read Functions ---------------------- //

    function getTokenURI(uint _tokenId) public view returns (string memory) {
        return (_uris[_tokenId]);
    }

    function getMarketAddress() public view returns (address marketAddress) {
        return marketplaceAddress;
    }

    function checkIfOwner(uint _tokenId) public view returns (bool) {
        if (balanceOf(msg.sender, _tokenId) > 0) {
            return true;
        }
        return false;
    }
}
