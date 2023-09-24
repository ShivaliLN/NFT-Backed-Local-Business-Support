import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, VStack, Container, Text, Input, FormControl, FormLabel, Alert, Image, Flex, AspectRatio, HStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { Contract, JsonRpcProvider, Wallet, BrowserProvider } from 'ethers';
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";

// Assume contractABI is imported or defined here. Replace it with your actual ABI.
//const contractABI = "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"_description\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_business\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"tokenURI\",\"type\":\"string\"}],\"name\":\"mintNFTByOwner\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_description\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_business\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"tokenURI\",\"type\":\"string\"}],\"name\":\"mintNFTByUser\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"redeemNFT\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"; 
const contractJSON = require('./LocalBusinessNFT.json');
const contractABI = contractJSON.abi;

const contractAddress = "0xCc77B02C28dEc3F4369fb21C8cf0491cFa478287"    //"0xc6d321c0cC595265d7C8e4e462c0f0b614171099"; // Replace with your contract address Scroll Sepolia


function ActionScreen() {
  const [strategy, setStrategy] = useState('');
  const [description, setDescription] = useState('');
  const [business, setBusiness] = useState(''); // New state for business name
  const [tokenURI, setTokenURI] = useState('');  // New state for tokenURI
  const [transactionMessage, setTransactionMessage] = useState('');
  const location = useLocation();

  const [availableNFTs, setNfts] = useState([]); // To store available NFTs
  
  useEffect(() => {
    // Fetch available NFTs from the smart contract when the component mounts
    const fetchAvailableNFTs = async () => {
      const provider = new JsonRpcProvider("https://sepolia-rpc.scroll.io/");
      const contract = new Contract(contractAddress, contractABI, provider);
      // Assume you have a function in your contract to get the total number of NFTs
    // Fetch NFTs (This part depends on how your contract is structured)
    const nftCount = await contract._tokenIdsForBusiness();
    const nftData = [];

    for (let i = 1; i <= nftCount; i++) {
      const tokenURI = await contract.tokenURI(i);
     // console.log("tokenURI:" + i + tokenURI)
      // Fetch JSON metadata (Assumes metadata is accessible publicly)
      const metaData = await fetch(tokenURI).then((res) => res.json());
      //console.log("Metadata:" + metaData.data)
      nftData.push({ tokenId: i,tokenURI: tokenURI, ...metaData });
    }

    setNfts(nftData);
  };

  fetchAvailableNFTs();

  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setStrategy(params.get('strategy'));
  }, [location]);

  const handleOwnerMintNFT = async () => {
    try {
      // Initialize provider and signer
     //const provider = new JsonRpcProvider(process.env.REACT_APP_SCROLL_RPC);
      //const signer = new Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
      const provider = new JsonRpcProvider("https://sepolia-rpc.scroll.io/");
      const signer = new Wallet("<PK>", provider);

      
        console.log("signer:" + signer)
      // Create contract instance
      const contract = new Contract(contractAddress, contractABI, signer);
      console.log("contract:" + contract.address)
      // Call mintNFTByOwner function from the smart contract
      const txResponse = await contract.mintNFTByOwner(
        signer.address, // Owner's address
        description,    // Description of the service or product
        business,       // Business name
        tokenURI  // Replace with actual IPFS URI
      );

      console.log(`Transaction hash: ${txResponse.hash}`);

      const receipt = await txResponse.wait();
      const message = `NFT minted for ${business} with description: ${description}`;
      setTransactionMessage(message);

      // Clear the UI fields
      setDescription('');
      setBusiness('');
      setTokenURI('');

      console.log(`NFT minted for ${business} with description: ${description}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  const handleLocalMintNFT = async (tokenURI) => {
    try {
      // Fetch JSON metadata from tokenURI
      console.log("tokenURI"+ tokenURI)
      const metaData = await fetch(tokenURI).then((res) => res.json());
  
      // Extract business name and description from metadata attributes
      let business = '';
      let description = '';
      metaData.attributes.forEach(attribute => {
        if (attribute.trait_type === 'Business Name') {
          business = attribute.value;
        }
        if (attribute.trait_type === 'Description') {
          description = attribute.value;
        }
      });
      console.log(description, business, tokenURI)
      
      // Create a Web3Provider using the MetaMask provider
      const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner(); // Async call to getSigner
         
      // Create contract instance with the signer
      const contract = new Contract(contractAddress, contractABI, signer);
      const nftCount = await contract._tokenIdsForUsers();
      console.log("Count:" + nftCount)
      // Call the mintNFTByUser function from the smart contract
      const txResponse = await contract.mintNFTByUser(description, business, tokenURI);
      const receipt = await txResponse.wait();

      // Set transaction message (or do any other UI updates here)
      const message = `NFT minted for ${business} with description: ${description}`;
      setTransactionMessage(message);
      
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    } catch (error) {
      console.error("Error while minting NFT:", error);
    }
  };

  // Add this function to handle NFT burning
const handleBurnNFT = async (tokenId) => {
    // Logic to burn NFT
    try {
        const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
        const signer = await provider.getSigner(); // Async call to getSigner
        const contract = new Contract(contractAddress, contractABI, signer);
    
        const txResponse = await contract.redeemNFT(4);
        const receipt = await txResponse.wait();

        // Set transaction message (or do any other UI updates here)
      const message = `NFT purpose fulfilled and has been burned.`;
      setTransactionMessage(message);
    
        console.log(`NFT with token ID ${tokenId} has been burned.`);
      } catch (error) {
        console.log("Error while burning NFT:", error);
      }
  };

  return (
    <Container centerContent maxW="container.md" py={10} borderRadius="md" bg="transparent" backdropBlur="sm">
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
            Action Screen
          </Heading>
          {/* Using Web3Button for wallet connection */}
          <Web3Button icon="show" label="Connect Wallet" balance="show" />          
          <Web3NetworkSwitch />
          <br />
          {transactionMessage && (
            <Alert status="success" bgColor="blue.500" color="black">
              {transactionMessage}
            </Alert>
          )}
{strategy === 'supportLocalBusiness' && (
  <>
    <Text fontSize="2xl" mb={4}>Support Local Businesses by Minting NFTs</Text>
    <Flex wrap="wrap" justify="flex-start">
      {availableNFTs.map((nft) => {
        // Extract Business Name and Description from attributes
        const businessName = nft.attributes.find(attr => attr.trait_type === "Business Name")?.value || "Unknown";
        const businessDescription = nft.attributes.find(attr => attr.trait_type === "Description")?.value || "Unknown";
        
        // Add the prefix to the image URI
        const imageUrl = `https://ipfs.io/ipfs/${nft.image.replace("ipfs://", "")}`;

        return (
          <Box 
            key={nft.tokenId} 
            p={5} 
            borderWidth={1} 
            borderRadius="md" 
            boxShadow="xl"
            m={4}
            bgColor="gray.100"
            width="300px"
          >
            <Text fontSize="xl" color="teal.500">{businessName}</Text>
            <AspectRatio ratio={1}>
              <Image src={imageUrl} alt={businessName} objectFit="cover" borderRadius="md"/>
            </AspectRatio>
            <Text color="gray.700">{businessDescription}</Text>
            <HStack spacing={4} mt={3}>
              <Button colorScheme="green" onClick={() => handleLocalMintNFT(nft.tokenURI)}>
                Mint NFT
              </Button>
              <Button colorScheme="red" onClick={() => handleBurnNFT(nft.tokenId)}>
                Redeem NFT (Burn)
              </Button>
            </HStack>
          </Box>
        );
      })}
    </Flex>
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
              <FormControl id="tokenURI">
                <FormLabel>Metadata URI</FormLabel>
                <Input 
                  placeholder="Enter Metadata URI (e.g., ipfs://...)"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="orange" size="md" onClick={handleOwnerMintNFT}>
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