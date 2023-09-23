import React from 'react';
import { Box, Button, Heading, VStack, Container, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom'; 

function EndScreen() {
  const navigate = useNavigate();
  const totalEarnings = 1000;  // This should be replaced with the actual total earnings calculated from the smart contract data

  // Function to restart the game and navigate back to the home screen
  const restartGame = () => {
    navigate('/');
  };

  return (
    <Container
  centerContent
  maxW="container.md"
  py={10}
  borderRadius="md"
  bg="transparent"  // Set to transparent to inherit the global background
  backdropBlur="sm"  // Adding a blur effect for aesthetics
>

      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Box display="flex" justifyContent="space-between" width="100%" mb={4}>
            <Link to="/">Home</Link>
            <Link to="/strategy-selection">Select Strategy</Link>
            <Text>Wallet: Connected</Text> {/* Replace with real wallet connection status later */}
          </Box>
          
          <Heading as="h1" size="2xl">
            Game Over
          </Heading>
          <Text>
            Congratulations! You earned a total of: ${totalEarnings.toFixed(2)}
          </Text>
          <Button colorScheme="teal" size="lg" onClick={restartGame}>
            Restart Game
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default EndScreen;
