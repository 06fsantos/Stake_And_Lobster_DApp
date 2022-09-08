import pytest
from brownie import network, exceptions
from scripts.utils import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    STARTING_PRICE,
    get_account,
    get_contract,
)
from scripts.deploy import deploy_token_farm_and_dapp_token


def test_set_price_feed_contract():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing.")

    account = get_account()
    non_owner_account = get_account(index=1)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()

    token_farm.setPriceFeedContract(
        dapp_token.address,
        # if you set a contract as a param for address brownie automatically knows you only want the address (see below)
        get_contract("eth_usd_price_feed"),
        {"from": account},
    )

    assert token_farm.tokenPriceFeedMap(dapp_token.address) == get_contract(
        "eth_usd_price_feed"
    )
    with pytest.raises(exceptions.VirtualMachineError):
        assert token_farm.setPriceFeedContract(
            dapp_token.address,
            get_contract("eth_usd_price_feed"),
            {"from": non_owner_account},
        )


def test_stake_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing.")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()

    dapp_token.approve(token_farm, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token)

    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address

    return token_farm, dapp_token


def test_issue_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing.")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account.address)

    token_farm.issueTokenReward({"from": account})

    ## we are staking 1 ETH worth of Dapp_Tokens
    ## and the price we instantiated with is $2000,
    ## so we should expect to be issued 2000 dap tokens
    assert dapp_token.balanceOf(account.address) == starting_balance + STARTING_PRICE


def test_allowed_token():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing.")
    account = get_account()

    token_farm, dapp_token = deploy_token_farm_and_dapp_token()

    assert token_farm.tokenAllowed(dapp_token)


def test_unstake_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing.")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)

    token_farm.unstakeTokens(dapp_token, amount_staked, {"from": account})

    assert token_farm.uniqueTokensStaked(account.address) == 0
    assert token_farm.stakingBalance(dapp_token.address, account.address) == 0
