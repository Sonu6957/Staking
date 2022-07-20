// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 



 
contract staking is ERC1155Holder{
    ERC20 rewardsToken;
    IERC1155 nft1155;
    constructor(address _rewardsToken,address _nft){
        nft1155 =  IERC1155(_nft);
        rewardsToken = ERC20(_rewardsToken);
    }
    
    struct staker{
        uint stakedamount;
        uint startingTime;
        address owner; 
     }
    mapping(uint=>uint) public stakingIdOftokenId;                      //To keep track tokenId with staking by a user
    mapping(uint=>mapping (uint=>staker)) public stakerofStakingId;     //To track tokenId with the user details 

    // staking 1 NFT for 1 day would reward 5 tokens.
    // Therefore,total staking for 365 days would be 365*5 = 1825 tokens.
    
    //Staking Interest rates:- Less than a month =0
                              //Between 1 month to 6 months = 5%
                             //Between 6 month to 12 months = 10%
                            //After 12 months = 15%
    
    uint EmissionRate = (5*10**18)/uint(1 days);
    uint[] rates = [5,10,15];                                            

    function stakedAmountofId(uint _id,uint _stakingId) public view returns(uint) {
        return stakerofStakingId[_id][_stakingId].stakedamount;
    }
    
    function stake(uint _id,uint _amount) public payable  {
        nft1155.safeTransferFrom(msg.sender,address(this),_id,_amount,"0x00");
        uint stakingId = stakingIdOftokenId[_id]++;                                 //|
        stakerofStakingId[_id][stakingId].stakedamount=_amount;                     //|
        stakerofStakingId[_id][stakingId].startingTime=block.timestamp;             //| storing user data with each staking
        stakerofStakingId[_id][stakingId].owner = msg.sender;
        
    }

    function tokenCalculator(uint _amount,uint _elapsedTime) public view returns(uint){    //Calculation of token to reward
        uint reward = 0;
        if(_elapsedTime<30 days){      //30 days
            reward = 0;
            return reward;
        }
        else if(_elapsedTime<6*30 days){        //6*30 days
            reward = (_amount*EmissionRate*_elapsedTime)/10**18;
            uint InterestonStaking = (rates[0]*reward)/100;
            reward = (reward + InterestonStaking);
            return reward;
        }
        else if(_elapsedTime<12*30 days){       //12*30 days
            reward = (_amount*EmissionRate*_elapsedTime)/10**18;
            uint InterestonStaking = (rates[1]*reward)/100;
            reward = reward + InterestonStaking;
            return reward;
        }
        else{
            reward = (_amount*EmissionRate*_elapsedTime)/10**18;
            uint InterestonStaking = (rates[2]*reward)/100;
            reward = reward + InterestonStaking;
            return reward;
        }
    }
    function unstake(uint _tokenid,uint _stakeId) public returns(uint){      //Unstaking of the given stake
        require(stakerofStakingId[_tokenid][_stakeId].owner==msg.sender,"You are not the owner");
        require(stakerofStakingId[_tokenid][_stakeId].stakedamount>0,"Not enough staking");
        uint startTime =stakerofStakingId[_tokenid][_stakeId].startingTime;
        uint elapsedTime = block.timestamp - startTime;
        
        uint stakedAmount = stakerofStakingId[_tokenid][_stakeId].stakedamount;
        uint noOftokenstoReward = tokenCalculator(stakedAmount,elapsedTime);

        

        nft1155.safeTransferFrom(address(this),msg.sender,_tokenid,stakedAmount,"0x00");
        rewardsToken.transfer(msg.sender,noOftokenstoReward);
        

        delete stakerofStakingId[_tokenid][_stakeId];
        delete stakingIdOftokenId[_tokenid];
        return(noOftokenstoReward);
        
    }

    
}
