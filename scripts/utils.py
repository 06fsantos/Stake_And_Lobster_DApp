from brownie import (
    Contract,
    accounts,
    config,
    network,
    MockV3Aggregator,
    MockDAI,
    MockWETH,
)
from web3 import Web3

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]

DECIMALS = 18
STARTING_PRICE = Web3.toWei(2000, "ether")


def get_account(index=None, id=None):

    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def add_allowed_tokens(token_farm, dict_allowed_tokens, account):
    for token in dict_allowed_tokens:
        add_tx = token_farm.addAllowedToken(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, dict_allowed_tokens[token], {"from": account}
        )
        set_tx.wait(1)


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": MockDAI,
    "weth_token": MockWETH,
}


def get_contract(contract_name):
    """
    This function will grab the contract addresses from the brownie config if defined,
    otherwise, it'll deploy a mock version of the contract and return that mock

        args:
            contract name - string
        returns:
            brownie.network.contract.ProjectContract (most recently deployed version of this contract)
    """
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        return contract_type[-1]
    else:
        return Contract.from_abi(
            contract_type._name,
            config["networks"][network.show_active()][contract_name],
            contract_type.abi,
        )


def deploy_mocks(decimals=DECIMALS, initial_value=STARTING_PRICE):
    account = get_account()
    print(f"The active network is {network.show_active()}")
    print("Deploying mocks...")
    print("Deoployong MockV3Aggregator...")
    agg_mock = MockV3Aggregator.deploy(decimals, initial_value, {"from": account})
    print(f"MockV3Aggregator deployed to {agg_mock.address}")

    print("Deoployong MockWETH...")
    weth_token = MockWETH.deploy({"from": account})
    print(f"MockWETH deployed to {weth_token.address}")

    print("Deoployong DAIToken...")
    dai_token = MockDAI.deploy({"from": account})
    print(f"MockDAI deployed to {dai_token.address}")

    print("Mocks deployed")
