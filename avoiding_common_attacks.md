# Avoiding Common Attacks

### Guarding Against Solidity Risks

-   Using Solidity >= v0.8.0 that has SafeMath integrated to ensure automatic reverts for integer overflows. This feature is applied in the `purchaseItem` function in `Marketplace.sol` when calculating the amount of royalties that goes to the contract, and the remaining that goes to the seller of the item.

-   Use of Require to ensure:

    -   List price of an item is greater than zero
    -   Amount of Ether sent in equals to the item's list price when purchasing
    -   Only the owner of an item is allowed to delist/relist it on the marketplace
    -   Only the owner of the ERC1155 token is allowed to call the setTokenURI function
    -   Only the owner of the ERC1155 token is allowed to burn the token

-   Using `.call` to send Ether instead of `.transfer`

### Guarding Against Smart Contract Risks

-   Reentrancy Guard: nonReentrant modifier used in the `purchaseItem` function in `Marketplace.sol`
