import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, VStack, Container, Text, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { Contract, JsonRpcProvider, Wallet } from 'ethers';


// Assume contractABI is imported or defined here. Replace it with your actual ABI.
const contractABI = "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"_description\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_business\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"tokenURI\",\"type\":\"string\"}],\"name\":\"mintNFTByOwner\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"; 
const contractAddress = "0xc6d321c0cC595265d7C8e4e462c0f0b614171099"; // Replace with your contract address Scroll Sepolia


function ActionScreen() {
  const [strategy, setStrategy] = useState('');
  const [description, setDescription] = useState('');
  const [business, setBusiness] = useState(''); // New state for business name
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setStrategy(params.get('strategy'));
  }, [location]);

  const handleMintNFT = async () => {
    try {
      // Initialize provider and signer
      //const provider = new JsonRpcProvider(process.env.REACT_APP_SCROLL_RPC);
      //const signer = new Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);

      const provider = new JsonRpcProvider("https://sepolia-blockscout.scroll.io/api");
      const signer = new Wallet("c03eda9b7c571f07b7d3cb0a8e3d896316627651f6a36b6e07730033edab0ba5", provider);

        console.log("signer:" + signer)
      // Create contract instance
      const contract = new Contract(contractAddress, contractABI, signer);
      console.log("contract:" + contract.address)
      // Call mintNFTByOwner function from the smart contract
      const txResponse = await contract.mintNFTByOwner(
        signer.address, // Owner's address
        description,    // Description of the service or product
        business,       // Business name
        "ipfs://tokenURI_here"  // Replace with actual IPFS URI
      );

      console.log(`Transaction hash: ${txResponse.hash}`);

      const receipt = await txResponse.wait();

      console.log(`NFT minted for ${business} with description: ${description}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
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
