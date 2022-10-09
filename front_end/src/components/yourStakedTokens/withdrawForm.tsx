import React, {useState, useEffect} from "react"
import { utils} from "ethers"
import { Button, Input, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import {Token} from "../main"
import {useFarmTokens} from "../../hooks"

export interface StakeFormProps{
    token: Token
} 

export const WithdrawForm = ({token}: StakeFormProps) => {
    const {address: tokenAddress, name} = token
    const {account} =  useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const {notifications} = useNotifications()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
    }

    const {withdrawStake, withdrawState} = useFarmTokens(tokenAddress)
    const handleWithdrawSubmit = () => {
        const amountAsWei  = utils.parseEther(amount.toString())
        return withdrawStake(amountAsWei.toString())
    }

    const isMining = withdrawState.status === "Mining"

    const [showWithdrawTokenSuccess, setShowWithdrawTokenSuccess] = useState(false) 

    const handleCloseSnack = () => {
        setShowWithdrawTokenSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" 
                && notification.transactionName === "Stake ERC20 token").length > 0) {
                    setShowWithdrawTokenSuccess(true)
                }
    }, [notifications, showWithdrawTokenSuccess]) 

    return (
        <>
            <div>
                <Input onChange={handleInputChange}/>
                <Button
                    color="primary"
                    size="large"
                    onClick={handleWithdrawSubmit}
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={26}/> : "Stake!!"}
                </Button>
            </div>
            <Snackbar
                open={showWithdrawTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack    } severity="success">
                    Tokens withdrawn!
                </Alert>
            </Snackbar>
        </>
    )
}