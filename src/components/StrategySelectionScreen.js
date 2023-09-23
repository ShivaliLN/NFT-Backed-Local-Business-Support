import React from 'react';
import { Box, Button, Heading, VStack, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function StrategySelectionScreen() {
  const navigate = useNavigate();
  
  const selectStrategy = (strategy) => {
    navigate(`/action?strategy=${strategy}`);
  };

  return (
    <Container centerContent maxW="container.md" py={10} borderRadius="md" bg="transparent" backdropBlur="sm">
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
            Select Your Strategy
          </Heading>
          <Button colorScheme="teal" size="lg" onClick={() => selectStrategy('supportLocalBusiness')}>
            Support Local Business
          </Button>
          <Button colorScheme="orange" size="lg" onClick={() => selectStrategy('createNFTForLocalBusiness')}>
            Create NFT for Local Business
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default StrategySelectionScreen;
