# Design Pattern Decisions

### Inter-Contract Execution

-   Using the safeTransferFrom function in IERC1155.sol to transfer tokens from the seller to the marketplace, and from the marketplace to the buyer.
-   Using functions in Counters.sol to increment and get current value of itemID variable.

### Inheritance and Interfaces

-   Inheriting the ERC1155, ERC1155Holder, Reentrancy Guard, and Counters contracts to maximize use of safe and audited code.

### Access Control Design Patterns

-   Ownable, onlyOwner modifier
