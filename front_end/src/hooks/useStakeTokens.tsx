import { useState, useEffect } from "react"
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
    const {send: approveERC20Send, state: approveAndStakeERC20State} = 
        useContractFunction(erc20Contract, "approve", {transactionName: "Approve ERC20 transfer"})

    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveERC20Send(tokenFarmAddress, amount)
    }

    const {send: stakeSend, state: stakeState} = 
        useContractFunction(tokenFarmContract, "stakeTokens", {transactionName: "Stake ERC20 token"})

    // const [state, setState] = useState(approveERC20State)
    const [amountToStake, setAmountToStake] = useState("0")
    useEffect(() => {
        if(approveAndStakeERC20State.status === "Success"){
            // stake function
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveAndStakeERC20State, amountToStake, tokenAddress]) // if anything in this array changes do something in the method - so when approved will send automatically

    const [state, setState] = useState(approveAndStakeERC20State)
    useEffect(() => {
        if (approveAndStakeERC20State.status === "Success") {
            setState(stakeState)
        } else {
            setState(approveAndStakeERC20State)
        }
    }, [approveAndStakeERC20State, stakeState])

    return {approveAndStake, state}
}