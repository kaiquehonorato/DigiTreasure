//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


//Our Nft contract is inheriting the ERC1155 and Ownable Format
//We’ll use ERC1155  to track multiple items in our MarketPlace
contract NFT is ERC1155 , Ownable {
    uint public fee;
    // the counters allow us to keep track of tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
     // address of marketplace for NFTs to interact
    address creator;

    constructor(string memory tokenURI,address marketAddress, uint _fee, address _owner) ERC1155(tokenURI){
       setApprovalForAll(marketAddress,true);
       // setApprovalForAll allow us to transact between parts
       fee = _fee;
       creator = _owner;
    }
    function mint( address  receiver ) public onlyOwner {
        _tokenIds.increment();
        _mint(receiver, _tokenIds.current(), 1, "");
    }
    function burn( uint id ) public onlyOwner {
        _burn(msg.sender, id, 1);
    }

    function currentId() public view returns( uint[2] memory) {
        return [_tokenIds.current(),fee] ;
    }
    //to get royalts fee
    function getFee() public view returns( uint) {
        return fee;
    }
    function getCreator() public view returns(address) {
        return creator;
    }


}
