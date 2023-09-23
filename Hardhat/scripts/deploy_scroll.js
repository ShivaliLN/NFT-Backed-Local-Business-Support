const hre = require("hardhat");

async function main() {
 
  const signer0 = await hre.ethers.provider.getSigner(0);
  const addr0 = await signer0.getAddress();

  const NFT4Local = await hre.ethers.getContractFactory("LocalBusinessNFT")
  const nft4Local = await NFT4Local.deploy()
  await nft4Local.deployed()
  console.log("LocalBusinessNFT Contract: " + nft4Local.address)

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });