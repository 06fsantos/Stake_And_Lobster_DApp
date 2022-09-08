from importlib.abc import Loader
from brownie import config, network, DappToken, TokenFarm
from web3 import Web3
from scripts.utils import get_account, add_allowed_tokens, get_contract
from scripts.update_front_end import update_front_end_config


KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(update_front_end=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    fund_tx = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    fund_tx.wait(1)
    # dapp_token, weth_token, fau_token (pretend DAI)
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    add_allowed_tokens(token_farm, dict_allowed_tokens, account)
    if update_front_end:
        update_front_end_config()
    return token_farm, dapp_token


def main():
    deploy_token_farm_and_dapp_token(update_front_end=True)
