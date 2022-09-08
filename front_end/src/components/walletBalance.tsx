import { formatUnits } from "@ethersproject/units"
import { useEthers, useTokenBalance } from "@usedapp/core"
import {Token} from "./main"
import { BalanceMsg } from "./balanceMsg"

export interface WalletBalanceProps{
    token: Token
}

export const WalletBalance = ({token}: WalletBalanceProps) => {
    const {image, address, name} = token
    const {account} = useEthers()
    
    const tokenBalance = useTokenBalance(address, account)
    const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    console.log(tokenBalance)
    return(<BalanceMsg
            label={`Your unstaked balance of ${name} is:`}
            tokenImgSrc={image}
            amount={formattedBalance}
            />)
}



