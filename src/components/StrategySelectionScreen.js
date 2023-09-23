import React from 'react';
import { Box, Button, Heading, VStack, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';  // Updated this line

function StrategySelectionScreen() {
  const navigate = useNavigate();  // Updated this line
  
  const selectStrategy = (strategy) => {

    // Here we will later integrate the selected strategy with the smart contract
    navigate('/game');  // Updated this line
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
          <Heading as="h1" size="2xl">
            Select Your Strategy
          </Heading>
          <Button colorScheme="teal" size="lg" onClick={() => selectStrategy('yieldFarming')}>
            Yield Farming
          </Button>
          <Button colorScheme="orange" size="lg" onClick={() => selectStrategy('liquidityPool')}>
            Liquidity Pool
          </Button>
          <Button colorScheme="purple" size="lg" onClick={() => selectStrategy('liquidityPool')}>
            Flashloan (Coming Soon..)
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default StrategySelectionScreen;
