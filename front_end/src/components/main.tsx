import { useEthers } from "@usedapp/core"
import { styled } from '@mui/material/styles';
import {constants} from "ethers"
import helperConfig from "../helper-config.json"
import brownieConfig from "../brownie-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import {YourWallet} from "./yourWallet"
import  {YourStakedTokens}  from "./yourStakedTokens";
import dappToken from "../dapp_token.png"
import wethToken from "../eth.png"
import fauToken from "../fau.png"

const PREFIX = 'Main'
const classes = {
    title: `${PREFIX}-title`,
}

const Root = styled('h2')(({ theme }) => ({
  [`&.${classes.title}`]: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4),
  },
}))

export type Token = {
    image: string,
    address: string, 
    name: string
}

export const Main = () => {
    // Show the token values for the user 

    // Get the address for different tokens 
    // Get the balance of the users wallet

    // we need to send our brownie config to our source folder
    // also need to send our build folder 

    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    
    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: dappToken,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: wethToken,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: fauToken,
            address: fauTokenAddress,
            name: "FAU"
        }
    ]

    return (
        <div>
            <Root className={classes.title}>Stake and Lobster</Root>
            <YourWallet supportedTokens={supportedTokens} />
            <YourStakedTokens supportedTokens={supportedTokens} />
        </div>
    )
}