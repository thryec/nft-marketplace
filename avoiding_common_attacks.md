Below is a list of attack vectors and / or security measures from the course, specifically Solidity Pitfalls and Attacks and Smart Contract Pitfalls and Attacks. It is okay for some of these to overlap with design patterns, but you can list at least two of them in avoiding_common_attacks.md:

## From Solidity Pitfalls and Attacks

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

-   Use of Require to ensure correct parameters are passed in for contract calls
-   Ownable to only allow withdrawal of marketplace funds by the owner of the contract
-   Re-entrancy Guard
