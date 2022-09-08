import React, {useState, useEffect} from "react"
import { utils} from "ethers"
import { Button, Input, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import {Token} from "../main"
import {useStakeTokens} from "../../hooks"

export interface StakeFormProps{
    token: Token
} 

export const StakeForm = ({token}: StakeFormProps) => {
    const {address: tokenAddress, name} = token
    const {account} =  useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const {notifications} = useNotifications()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
    }

    const {approveAndStake, state: approveAndStakeERC20State} = useStakeTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei  = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeERC20State.status === "Mining"

    const [showERC20ApprovalSuccess, setShowERC20ApprovalSuccess] = useState(false) 
    const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false) 

    const handleCloseSnack = () => {
        setShowERC20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" 
                && notification.transactionName === "Approve ERC20 transfer").length > 0) {
                    setShowERC20ApprovalSuccess(true)
                    setShowStakeTokenSuccess(false)
                }
        
        if (notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" 
                && notification.transactionName === "Stake ERC20 token").length > 0) {
                    setShowERC20ApprovalSuccess(false)
                    setShowStakeTokenSuccess(true)
                }
    }, [notifications, showERC20ApprovalSuccess, showStakeTokenSuccess]) 

    return (
        <>
            <div>
                <Input onChange={handleInputChange}/>
                <Button
                    color="primary"
                    size="large"
                    onClick={handleStakeSubmit}
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={26}/> : "Stake!!"}
                </Button>
            </div>
            <Snackbar
                open={showERC20ApprovalSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    ERC-20 token transfer approved! Next, approve the 2nd transaction.
                </Alert>
            </Snackbar>
            <Snackbar
                open={showStakeTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack    } severity="success">
                    Tokens staked!
                </Alert>
            </Snackbar>
        </>
    )
}