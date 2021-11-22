# Design Pattern Decisions

### Inter-Contract Execution

-   Calling the safeTransferFrom function in IERC1155.sol to transfer tokens from the seller to the marketplace, and from the marketplace to the buyer.
-   Calling functions in Counters.sol to increment and get current value of itemID variable.

### Inheritance and Interfaces

-   Inheriting the ERC1155, Ownable, Reentrancy Guard, and Counters contracts to maximize use of safe and audited code.

### Access Control Design Patterns

-   Ownable, onlyOwner modifier
