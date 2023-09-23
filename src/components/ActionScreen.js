import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, VStack, Container, Text, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

function ActionScreen() {
  const [strategy, setStrategy] = useState('');
  const [description, setDescription] = useState('');
  const [business, setBusiness] = useState(''); // New state for business name
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setStrategy(params.get('strategy'));
  }, [location]);

  const handleMintNFT = () => {
    // Integrate code to interact with the Solidity contract and mint NFT
    console.log(`Minting NFT for ${business} with description: ${description}`);
  };

  return (
    <Container centerContent maxW="container.md" py={10} borderRadius="md" bg="transparent" backdropBlur="sm">
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
            Action Screen
          </Heading>

          {strategy === 'supportLocalBusiness' && (
            <>
              {/* Add components for supporting local businesses here */}
            </>
          )}

          {strategy === 'createNFTForLocalBusiness' && (
            <>
              <Text>Create your NFT for Local Business</Text>
              <FormControl id="businessName">
                <FormLabel>Business Name</FormLabel>
                <Input 
                  placeholder="Enter Business Name" 
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                />
              </FormControl>
              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Input 
                  placeholder="Enter Service/Product Description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="orange" size="md" onClick={handleMintNFT}>
                Mint NFT
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
}

export default ActionScreen;
