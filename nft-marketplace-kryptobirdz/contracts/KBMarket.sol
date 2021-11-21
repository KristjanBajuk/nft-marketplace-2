//SPDX-License-Identifier: MIT
 pragma solidity ^0.8.4;

 import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
 import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
 import '@openzeppelin/contracts/utils/Counters.sol';

 import 'hardhat/console.sol';

 contract KBMarket is ReentrancyGuard {
     using Counters for Counters.Counter;

     Counters.Counter private _tokenIds;
     Counters.Counter private _tokensSold;

     address payable owner;
     uint256 listingPrice = 0.045 ether;

     constructor (){
         owner = payable(msg.sender);
     }
     
     struct MarketToken {
         uint itemId;
         address  nftContract;
         uint256 tokenId;
         address payable seller;
         address payable owner;
         uint256 price;
         bool sold;
     }

    mapping(uint256 => MarketToken) private idToMarketToken;

    event MarketTokenMinted (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );


    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function mintMarketItem(address nftContract, uint tokenId, uint price) public payable nonReentrant {
        require(price > 0, 'Price must be at least 1 wei');
        require(msg.value == listingPrice, 'Price must be equal to listing price');

        _tokenIds.increment();
        uint itemId = _tokenIds.current();

        idToMarketToken[itemId] = MarketToken(
             itemId, 
             nftContract,
             tokenId,
             payable(msg.sender),
             payable(address(0)),
             price,
             false
        );
    }


 }