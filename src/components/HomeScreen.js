import React, { useEffect } from 'react';
import { Box, Button, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import { useAccount, useDisconnect } from 'wagmi';
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";

function HomeScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { account, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) {
      toast({
        title: 'Wallet connected',
        description: `Connected to ${account?.address}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConnected, account, toast]);

  const startGame = () => {
    if (isConnected) {
      navigate('/strategy-selection');
    }
  };

  return (
    <Container centerContent maxW="container.md" py={10} borderRadius="md" bg="transparent">
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">DeFi Quest</Heading>
          <Text>Embark on a thrilling journey in the world of DeFi.</Text>

          {/* Using Web3Button for wallet connection */}
          <Web3Button icon="show" label="Connect Wallet" balance="show" />

          {/* Using Web3NetworkSwitch for network switching */}
          <Web3NetworkSwitch />
          <br />

          {isConnected && <Text display="inline" ml={3}>{account?.address}</Text>}

          <Button colorScheme="orange" size="lg" disabled={!isConnected} onClick={startGame}>
            Start Game
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default HomeScreen;
