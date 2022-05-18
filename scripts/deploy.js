const hre = require('hardhat')
const fs = require('fs')
async function main() {
  //deploying the NFTmarket place contract
  const NFTMarket = await hre.ethers.getContractFactory('NFTMarket')
  const nftMarket = await NFTMarket.deploy(process.env.MARKET_FEE_WALLET)
  await nftMarket.deployed()
  console.log('NFT Market Deployed: ', nftMarket.address)
  //deploying the NFT contract
  const NFT = await hre.ethers.getContractFactory('NFT')
  const nft = await NFT.deploy('test')
  await nft.deployed()
  console.log('NFT Deployed: ', nft.address)
  
  let config = `
  export const nftmarketaddress = '${nftMarket.address}'
  export const nftaddress = '${nft.address}'`
  // wrighting the contract result to config.js
  let data = JSON.stringify(config)
  fs.writeFileSync('./config.js', JSON.parse(data))
}
// its recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
//recommended pattern of doployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
