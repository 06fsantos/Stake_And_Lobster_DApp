import { styled } from '@mui/material/styles';

const PREFIX = 'BalanceMsg'
const classes = {
    container: `${PREFIX}-root`,
    tokenImg: `${PREFIX}-tokenImg`,
    amount: `${PREFIX}-amount`,
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.container}`]: {
    display: 'inline-grid',
    gridTemplateColumns: "auto auto auto",
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  [`& .${classes.tokenImg}`]: {
    width: "32px"
  },
  [`& .${classes.amount}`]: {
    fontWeight: 700
  },
}))

interface BalanceMsgProps {
    label: string,
    amount: number,
    tokenImgSrc: string
}

export const BalanceMsg = ({label, amount, tokenImgSrc}: BalanceMsgProps) => {
    return (
        <Root className={classes.container}>
            <div>{label}</div>
            <div className={classes.amount}>{amount}</div>
            <img className={classes.tokenImg} src={tokenImgSrc} alt="token logo"></img>
        </Root>
    )
}