Using Specific Compiler Pragma
Proper Use of Require, Assert and Revert
Use Modifiers Only for Validation
Pull Over Push (Prioritize receiving contract calls over making contract calls)
Checks-Effects-Interactions (Avoiding state changes after external calls)
Proper use of .call and .delegateCall

## From Smart Contract Pitfalls and Attacks

Not everything can be avoided, but you can write if you’re taking protection against:
Re-entrancy
Timestamp Dependence
Forcibly Sending Ether
Tx.Origin Authentication

# My Implementations

## Guarding Against Solidity Risks

-   Using Solidity >= v0.8.0 that has SafeMath integrated to ensure automatic reverts for integer overflows. This feature is applied in the `purchaseItem` function in `Marketplace.sol` when calculating the amount of royalties that goes to the contract, and the remaining that goes to the seller of the item.

-   Use of Require to ensure:

    -   List price of an item is greater than zero
    -   Amount of Ether sent in equals to the item's list price when purchasing
    -   Only the owner of an item is allowed to delist/relist it on the marketplace
    -   Only the owner of the ERC1155 token is allowed to call the setTokenURI function
    -   Only the owner of the ERC1155 token is allowed to burn the token

-   Using `.call` to send Ether instead of `.transfer`

## Guarding Against Smart Contract Risks

-   Reentrancy Guard: nonReentrant modifier used in the `purchaseItem` function in `Marketplace.sol`
