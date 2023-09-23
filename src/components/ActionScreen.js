import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, VStack, Container, Text, Input } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

function ActionScreen() {  // Renamed from GameScreen
  const [strategy, setStrategy] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setStrategy(params.get('strategy'));
  }, [location]);

  return (
    <Container centerContent maxW="container.md" py={10} borderRadius="md" bg="transparent" backdropBlur="sm">
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
           Action Screen  // Renamed from DeFi Screen
          </Heading>

          {strategy === 'supportLocalBusiness' && (
            <>
              {/* Add components for supporting local businesses here */}
            </>
          )}

          {strategy === 'createNFTForLocalBusiness' && (
            <>
              {/* Add components for creating NFTs for local businesses here */}
              <Text>Create your NFT for Local Business</Text>
              <Input placeholder="Enter Service/Product Description" />
              <Button colorScheme="orange" size="md">
                Mint NFT
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
}

export default ActionScreen;  // Renamed from GameScreen
