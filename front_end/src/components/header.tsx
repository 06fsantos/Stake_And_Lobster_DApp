import { Button, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { useEthers } from "@usedapp/core"


export const Header = () => {

    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
                {isConnected ? (
                    <Button variant="contained" onClick={deactivate}>
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => activateBrowserWallet()}
                    >
                        Connect
                    </Button>
                )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}
