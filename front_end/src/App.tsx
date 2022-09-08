import React from 'react';
import './App.css';
import {DAppProvider, ChainId} from '@usedapp/core'
import {Container} from '@mui/material'
import {Header} from './components/header'
import {Main} from './components/main'

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby, 1337], //1337 is for local ganache
      notifications: {
        expirationPeriod: 1000, // miliseconds
        checkInterval: 1000 // check up on transactions every second
      }
    }}>
      <Header/>
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
