const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");

let nft;
let market;
//container for  nft running tests
describe("NFT", function () {
  beforeEach(async () => {
    //test to receive NFT contract address 
    const NFT = await ethers.getContractFactory("NFT");
    const owner = await ethers.getSigners();
    await nft.deployed();
  });

  it("Should deploy the contract and return the address", async function () {
    expect(nft.address).to.be.ok;
  });
  it("Should be able to mint one token", async () => {
    const owner = await ethers.getSigners();
    await nft.mint(owner[0].address);
    expect(await nft.balanceOf(owner[0].address, 1)).to.equal(
      1,
      "invalid final balance"
    );
  });
});
//container for market plance running tests
describe("NFTMarket", function () {
  beforeEach(async () => {
    const owner = await ethers.getSigners();
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    await market.deployed();
    const NFT = await ethers.getContractFactory("NFT");
    await nft.deployed();
  });
  it("Should deploy the contract and return the address", async function () {
    expect(market.address).to.be.ok;
  });
  it("Should Be able to list my nft", async function () {
    const owner = await ethers.getSigners();
    await nft.mint(owner[0].address);
    await nft.setApprovalForAll(market.address, true);
    await market.ListNFT(nft.address, nft.address, 1, 10);
  });

  it("Should Be able to fetch all nfts", async function () {
    const owner = await ethers.getSigners();
    await nft.mint(owner[0].address);
    await nft.mint(owner[0].address);
    await nft.mint(owner[0].address);
    nft.setApprovalForAll(market.address, true);
    market.ListNFT(nft.address, nft.address, 1, 10);
    market.ListNFT(nft.address, nft.address, 3, 10);
    market.ListNFT(nft.address, nft.address, 2, 10);
    const collection = await market.fetchAllCollection();

    expect(collection.length).to.equal(3, "not all the items were fetched");
  });

  it("Should Be able to Buy one nft", async function () {
    const owner = await ethers.getSigners();
    await nft.mint(owner[0].address);
    await nft.mint(owner[0].address);
    await nft.mint(owner[0].address);
    nft.setApprovalForAll(market.address, true);
    market.ListNFT(nft.address, nft.address, 1, ethers.utils.parseEther("10"));
    market.ListNFT(nft.address, nft.address, 3, ethers.utils.parseEther("10"));
    market.ListNFT(nft.address, nft.address, 2, ethers.utils.parseEther("10"));
    const marketUser = market.connect(owner[1]);
    await marketUser.performATransaction(1, {
      value: ethers.utils.parseEther("10"),
    });
    collection = await market.fetchAllCollection();

    expect(collection.length).to.equal(2, "the item wasnt sold");
  });
});
