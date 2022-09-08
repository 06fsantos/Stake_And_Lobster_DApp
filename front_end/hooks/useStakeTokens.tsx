import { useState } from "react"
import { useContractFunction, useEthers, useTokenBalance } from "@usedapp/core"
import {constants, Contract, utils} from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockDAI.json"

export const useStakeTokens = (tokenAddress: string) => {
    const {chainId} = useEthers()
    const {abi} = TokenFarm

    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    // approve
    // stake
    const {send: approveERC20Send, state: approveERC20State} = 
        useContractFunction(erc20Contract, "approve", 
            {transactionName: "Approve ERC20 transfer"})

    const approve = (amount: string) => {
        return approveERC20Send(tokenFarmAddress, amount)
    }

    const [state, setState] = useState(approveERC20State)

    return {approve, state}
}