# Staking Contract

Staking is a phrase that refers to the process of locking up bitcoin as collateral to help safeguard a certain blockchain network or smart contract technology. Staking is also a term that refers to cryptocurrency deposits that are used to provide DeFi liquidity, get access to yield benefits, and achieve governance rights. To earn rewards, cryptocurrency staking entails locking up tokens in a network or protocol, with those tokens being utilised to help provide crucial services for consumers.
## Description
This project demonstrates the working of staking NFT tokens for a certain period of time and get rewarded with ERC20 tokens. The transactions occur based on the amount of token a given wallet has staked. 
Instead of Eth, the transaction is controlled with the amount of the token staked.
## How to Install and Run the Project
* Step 1: Use remix, truffle, or Hardhat to deploy RewardToken.sol. This adds 1 million RewardTokens to your wallet.
* Step 2: Using the tools indicated in step 1, deploy NFT1155.sol  and mint a token on your account.
* Step 3: Using the tools indicated in step 1, deploy staking.sol using ERC20.sol and NFT1155.sol contract address. 
* Step 4: Transfer some reward tokens and approve the staking contract to transact on behalf of both ERC20 and NFT contracts.
* Step 5: Stake the required token for a certain period of time and unstake to recieve the reward.
## Contract Verification
Here are the links for the contract verification and transactions on each
* Run the scripts/deploy.js script to deploy the contracts.
* Run the test to check the deployment of the contracts.
