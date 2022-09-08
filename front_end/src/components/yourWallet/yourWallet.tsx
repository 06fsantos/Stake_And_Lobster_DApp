import React, {useState} from "react"
import {Box, Tab} from '@mui/material'
import { styled } from '@mui/material/styles';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import {Token} from "../main"
import {WalletBalance} from "../walletBalance"
import { StakeForm } from "./stakeForm";

const PREFIX = 'wallet'
const classes = {
    header: `${PREFIX}-header`,
    tabContent: `${PREFIX}-header`,
}

const Header = styled('h1')(({ theme }) => ({
  [`&.${classes.header}`]: {
    color: "white",
  },
}))

const TabContent = styled('div')(({ theme }) => ({
  [`&.${classes.tabContent}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
}))


interface YourWalletProps{
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens}: YourWalletProps) =>{
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <Box>
            <Header className={classes.header}>
                Your Wallet
            </Header>
            <Box sx={{
                backgroundColor: "white",
                borderRadius: "25px"
            }}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList aria-label="stake form tabs" onChange={handleChange}>
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name} value={index.toString()} key={index} />
                            )
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <TabContent className={classes.tabContent}>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                    <StakeForm token={supportedTokens[selectedTokenIndex]}></StakeForm>
                                </TabContent>
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>
    )
}