const { expect } = require("chai");
const { hre } = require("hardhat");
const {time} = require("@openzeppelin/test-helpers");

describe("Contract Deployment", function () {
    let ERC20contract, ERC20contractInstance,NFT1155contract,NFT1155contractInstance,stakingcontract,stakingcontractInstance,owner,addr1,addr2,addr3
    before(async function () {
        
        let accounts = await ethers.getSigners();
        [owner,addr1,addr2,addr3] = accounts;

        console.log(owner.address);

        ERC20contract = await ethers.getContractFactory("RewardToken");
        ERC20contractInstance = await ERC20contract.deploy();
        NFT1155contract = await ethers.getContractFactory("NFT1155");
        NFT1155contractInstance = await NFT1155contract.deploy();


        await ERC20contractInstance.deployed();
        await NFT1155contractInstance.deployed();

        stakingcontract = await ethers.getContractFactory("staking");
        stakingcontractInstance = await stakingcontract.deploy(ERC20contractInstance.address, NFT1155contractInstance.address);
        await stakingcontractInstance.deployed();

        await ERC20contractInstance.transfer(stakingcontractInstance.address,await ERC20contractInstance.totalSupply());

        await NFT1155contractInstance.mint(addr1.address,1,1000);
        await NFT1155contractInstance.connect(addr1).setApprovalForAll(stakingcontractInstance.address,true);
        await stakingcontractInstance.connect(addr1).stake(1,10);

        await NFT1155contractInstance.mint(addr2.address,2,2000);
        await NFT1155contractInstance.connect(addr2).setApprovalForAll(stakingcontractInstance.address,true);
        await stakingcontractInstance.connect(addr2).stake(2,20);

        await NFT1155contractInstance.mint(addr3.address,3,3000);
        await NFT1155contractInstance.connect(addr3).setApprovalForAll(stakingcontractInstance.address,true);
        await stakingcontractInstance.connect(addr3).stake(3,30);

       
        
    })
    describe("Total supply", async function () {
        it("Check TS", async function () {
            expect(await ERC20contractInstance.totalSupply()).to.be.equal(10 ** 6);
        })
    })
    describe("Stake Check", async function () {
        it("Staking of 10 NFT1", async function () {
            expect(await stakingcontractInstance.stakedAmountofId(1,0)).to.be.equal(10);
        })
    })
    describe("Stake Check 2", async function () {
        it("Staking of 20 NFT2", async function () {
            expect(await stakingcontractInstance.stakedAmountofId(2,0)).to.be.equal(20);
        })
    })
    describe("Stake Check 3", async function () {
        it("Staking of 30 NFT3", async function () {
            expect(await stakingcontractInstance.stakedAmountofId(3,0)).to.be.equal(30);
        })
    })
    
    describe("Balance check",async function(){
        it("Balance check of stakingContract",async function(){
        expect(await ERC20contractInstance.balanceOf(stakingcontractInstance.address)).to.be.above(0);
        })
    })
    describe("Unstake Check 1", async function () {
        it("Unstaking in less that 1 month", async function () {
            await stakingcontractInstance.connect(addr1).unstake(1,0);
            expect(await ERC20contractInstance.balanceOf(addr1.address)).to.be.equal(0);
        })
    })
    describe("Unstake Check 2", async function () {
        it("Unstaking in 3 months", async function () {
            let timeafter3months =(await time.latest()).add(await time.duration.weeks(12)); 
            await time.increaseTo(timeafter3months.add(await time.duration.seconds(2)));
            await stakingcontractInstance.connect(addr2).unstake(2,0);
            expect(await ERC20contractInstance.balanceOf(addr2.address)).to.be.above(0);
        })
    })
    describe("Unstake Check 3", async function () {
        it("Unstaking between 6 and 12 months", async function () {
            let timeafter3months =(await time.latest()).add(await time.duration.weeks(30)); 
            await time.increaseTo(timeafter3months.add(await time.duration.seconds(2)));
            
            await stakingcontractInstance.connect(addr3).unstake(3,0);
            expect(await ERC20contractInstance.balanceOf(addr3.address)).to.be.above(0);
        })
    })
    
    
    
})
