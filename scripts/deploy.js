// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const ERC20contract = await hre.ethers.getContractFactory("RewardToken");
  const ERC20contractInstance = await ERC20contract.deploy();
  const NFT1155contract = await hre.ethers.getContractFactory("NFT1155");
  const NFT1155contractInstance = await NFT1155contract.deploy();


  await ERC20contractInstance.deployed();
  await NFT1155contractInstance.deployed();

  const stakingcontract = await hre.ethers.getContractFactory("staking");
  const stakingcontractInstance = await stakingcontract.deploy(ERC20contractInstance.address,NFT1155contractInstance.address);
  await stakingcontractInstance.deployed();

  console.log("ERC20Contract deployed to : ", ERC20contractInstance.address);
  console.log("NFTContract deployed to : ", NFT1155contractInstance.address);
  console.log("stakingContract deployed to : ", stakingcontractInstance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
