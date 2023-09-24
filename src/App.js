import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
//import GameScreen from './components/GameScreen';
//import EndScreen from './components/EndScreen';
import StrategySelectionScreen from './components/StrategySelectionScreen';
import './App.css';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum, scrollSepolia, arbitrumGoerli, filecoinCalibration} from 'wagmi/chains';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import ActionScreen from './components/ActionScreen';  // Renamed from GameScreen
import { Flex, Box } from '@chakra-ui/react';


const chains = [scrollSepolia, filecoinCalibration, arbitrumGoerli];
const projectId ='c86e5674490f54850e94c279deb49808';  // Replace this with your actual project ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ chains, projectId }),
  publicClient,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);


function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
<Flex direction="column" align="flex-start" justify="flex-start" minHeight="100vh">
        <Box position="absolute" top={4} right={4}>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </Box>
      <Router>
        <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/strategy-selection" element={<StrategySelectionScreen />} />
        <Route path="/action" element={<ActionScreen />} />  // Renamed from /game to /action
      </Routes>
      </Router>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </Flex>
    </WagmiConfig>
  );

}

export default App;
