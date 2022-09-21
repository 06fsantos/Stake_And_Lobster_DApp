import { useContractFunction, useEthers } from "@usedapp/core"
import {constants, Contract, utils} from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"

export const useFarmTokens = (tokenAddress: string) => {
    const {chainId} = useEthers()
    const {abi} = TokenFarm

    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const {state: withdrawState, send: withdrawStake} =     
        useContractFunction(tokenFarmContract, "unstakeTokens", {transactionName: "Withdraw ERC20 Token"})

    return {withdrawStake, withdrawState}
}