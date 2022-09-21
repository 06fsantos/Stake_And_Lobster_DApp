// stake tokens
// unstake tokens
// issueRewards
// addAllowedTokens
// getEthValue

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    IERC20 public dappToken;

    address[] public allowedTokens;
    address[] public stakers;

    // tokenAddress => stakerAddress => amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    // userAddress => numberOfUniqueTokens
    mapping(address => uint256) public uniqueTokensStaked;
    // token => price feed address
    mapping(address => address) public tokenPriceFeedMap;

    constructor(address _dappToken) public {
        dappToken = IERC20(_dappToken);
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // what tokens can be staked
        // how much can be staked
        require(_amount > 0, "Amount staked must be greater than 0.");
        require(tokenAllowed(_token), "Token isn't currently available.");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function issueTokenReward() public onlyOwner {
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    function unstakeTokens(address _token, uint256 _amount) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staked balance must be greater than 0");
        require(
            _amount <= balance,
            "Cannot withdraw more than the value staked."
        );
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] -
            _amount;

        if (stakingBalance[_token][msg.sender] <= 0) {
            uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
            if (uniqueTokensStaked[msg.sender] <= 0) {
                removeStaker(msg.sender);
            }
        }
    }

    function addAllowedToken(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenAllowed(address _token) public view returns (bool) {
        for (
            uint256 allowedIndex = 0;
            allowedIndex < allowedTokens.length;
            allowedIndex++
        ) {
            if (allowedTokens[allowedIndex] == _token) {
                return true;
            }
        }
        return false;
    }

    function updateUniqueTokensStaked(address _sender, address _token)
        internal
    {
        if (stakingBalance[_token][_sender] <= 0) {
            uniqueTokensStaked[_sender] = uniqueTokensStaked[_sender] + 1;
        }
    }

    function getUserTotalValue(address _user) internal view returns (uint256) {
        require(uniqueTokensStaked[_user] > 0, "User has no tokens staked");
        uint256 totalValue = 0;

        for (
            uint256 tokenIndex = 0;
            tokenIndex < allowedTokens.length;
            tokenIndex++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(_user, allowedTokens[tokenIndex]);
        }

        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }

        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (stakingBalance[_token][_user] * price) / (10**decimals);
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // retrieve from chainlink price feeds
        address priceFeedAddress = tokenPriceFeedMap[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMap[_token] = _priceFeed;
    }

    function removeStaker(address _user) internal {
        // we don't care about the order of the staker array here
        // so we'll copy the last element to the index to be removed
        // and delete the last elements
        for (
            uint256 stakerIndex = 0;
            stakerIndex < stakers.length;
            stakerIndex++
        ) {
            if (stakers[stakerIndex] == _user) {
                if (stakerIndex < stakers.length - 1) {
                    // if not the last item in the array, then copy last item to new location before deleting last item
                    stakers[stakerIndex] = stakers[stakers.length - 1];
                }
                stakers.pop();
            }
        }
    }
}
