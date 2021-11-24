# Design Pattern Decisions

### Inheritance and Interfaces

-   Inherited RC1155, ERC1155Holder, Reentrancy Guard, and Counters contracts to maximize use of safe and audited code.

### Inter-Contract Execution

-   Using the safeTransferFrom function in IERC1155.sol to transfer tokens from the seller to the marketplace, and from the marketplace to the buyer.
-   Using functions in Counters.sol to increment and get current value of itemID variable.

### Access Control Design Patterns

-   Inheriting Ownable.sol to access the owner of the marketplace and NFT contracts, and set the necessary approvals for the Marketplace when deploying the NFT contract.
