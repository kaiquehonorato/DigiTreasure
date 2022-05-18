//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //security against mutiple transactions
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract NFTMarket is ERC1155Holder, ReentrancyGuard {
    using Counters for Counters.Counter;
    /* Number of items minting, number of transactions, tokens that have not been sold,
    keep track of tokens total number -*/
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    //Our  Reward token(DGT) gets ERC20 format instead of ERC1155
    ERC20 private rewardToken;
    /* in solidity we have to use 'struct', it kind of works like objects.
     We use it to keep track of our minting and track of total numberIds
    with mapping and struct */
    struct MarketItem {
        uint256 itemId;
        address nftAddress;
        address collectionAddress;
        uint256 tokenId;
        address payable owner;
        uint256 price;
        bool sold;
    }
    
    constructor(address _rewardToken) {
        rewardToken = ERC20(_rewardToken);
    }
    //listen to events from the front end application
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        address collectionAddress,
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        bool sold
    );
    // (mapping through) - tokenId return which MarketToken. it also fetch which one it is
    mapping(uint256 => MarketItem) private idToMarketItem;
    
    // 1: Create a market item to put it for sale
    // 2: Create a market sale for buying and selling between parties
    function ListNFT(
        address NFTaddress,
        address collectionAddress,
        uint256 id,
        uint256 price

    // nonReentrant is a modifier to prevent reentry attack
    ) public nonReentrant {
        ERC1155 nft = ERC1155(NFTaddress);
        require(
            nft.balanceOf(msg.sender, id) > 0,
            "You can only list your own nfts"
        );
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        //putting the item for sale 
        idToMarketItem[itemId] = MarketItem(
            itemId,
            NFTaddress,
            collectionAddress,
            id,
            payable(msg.sender),
            price,
            false
        );
        // NFT transaction
        nft.safeTransferFrom(msg.sender, address(this), id, 1, "");
        emit MarketItemCreated(
            itemId,
            NFTaddress,
            collectionAddress,
            id,
            msg.sender,
            price,
            false
        );
    }
    // Function to fetchAllCollection - minting, buying and selling
    //return the number of remaining items on the market
    function fetchAllCollection() public view returns (MarketItem[] memory) { //because its a struct we have to set up (memory)
        //to keep track of our index and how many unsold items
        uint256 totalItems = _itemIds.current();
        uint256 leftItems = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](leftItems);
        //looping over the number of items created ( if number has not been sold, populate the array)
        for (uint256 i = 0; i < totalItems; i++) {
            if (!idToMarketItem[i + 1].sold) {
                items[currentIndex] = idToMarketItem[i + 1];
                currentIndex += 1;
            }
        }
        return items;
    }
    // Function to conduct transactions, market sales and reward token
    function performATransaction(uint256 itemId) public payable nonReentrant {
        MarketItem storage item = idToMarketItem[itemId];
        require(
            item.sold == false,
            "The item has already been sold, try another item."
        );
        require(msg.value == item.price, "Please send the correct amount.");
        ERC1155 nft = ERC1155(item.nftAddress);
        nft.safeTransferFrom(address(this), msg.sender, item.tokenId, 1, "");
        _NFT _nft = _NFT(item.nftAddress);
        uint256 collectionFee = _nft.getFee();
        //Collection Royalts
        uint256 fee = (item.price * collectionFee) / 1000;
        address creator = _nft.getCreator();
        payable(item.owner).transfer(item.price - fee);
        payable(creator).transfer(fee);
        //amount of reward token transfered fro the market to the buyer
        rewardToken.transfer(msg.sender, item.price * 100);
        item.owner = payable(msg.sender);
        item.sold = true;
        _itemsSold.increment();
    }
}

abstract contract _NFT {
    function getFee() public view virtual returns (uint256);

    function getCreator() public view virtual returns (address);
}
