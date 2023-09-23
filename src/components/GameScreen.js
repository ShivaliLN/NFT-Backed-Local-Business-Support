import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, VStack, Container, Text, Radio, RadioGroup, Stack, Input, Select } from '@chakra-ui/react';

function GameScreen() {
  const [strategy, setStrategy] = useState('');
  const [token, setToken] = useState('');
  const [dstToken, setDstToken] = useState('');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [outcome, setOutcome] = useState('');

  // Polygon Mainnet Addresses
  const POLYGON_DAI_ADDRESS = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
  const POLYGON_USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
  const POLYGON_USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

  // Mumbai Testnet Addresses
  const MUMBAI_DAI_ADDRESS = '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F';
  const MUMBAI_USDC_ADDRESS = '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e';

  const handleStrategyChange = (value) => {
    setStrategy(value);
    setToken('');
    setDstToken('');
    setAmount('');
    setQuote(null);
    setTransactionStatus('');
    setOutcome('');
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleDstTokenChange = (e) => {
    setDstToken(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        if (amount && token && dstToken && strategy === 'Liquidity Pool') {
          const response = await fetch(`http://localhost:4000/fetchQuote?src=${token}&dst=${dstToken}&amount=${amount}`);
          const data = await response.json();
          setQuote(data);
        }
      } catch (error) {
        console.error("Error fetching data from 1inch:", error);
      }
    };
    fetchQuote();
  }, [amount, token, dstToken, strategy]);

  return (
    <Container centerContent maxW="container.md" py={10} borderRadius="md" bg="transparent" backdropBlur="sm">
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
            Game Screen
          </Heading>

          <RadioGroup value={strategy} onChange={handleStrategyChange}>
            <Stack direction="row">
              <Radio value="Yield Farming">Yield Farming</Radio>
              <Radio value="Liquidity Pool">Liquidity Pool</Radio>
            </Stack>
          </RadioGroup>

          {strategy && (
            <>
              <Text>Selected Strategy: {strategy}</Text>
              <Text>Step 1: Get Quote </Text>
              <Select placeholder="Select source token" onChange={handleTokenChange} color={"orange"}>
                <option value={POLYGON_DAI_ADDRESS}>Polygon DAI</option>
                <option value={POLYGON_USDC_ADDRESS}>Polygon USDC</option>
                <option value={MUMBAI_DAI_ADDRESS}>Mumbai DAI</option>
                <option value={MUMBAI_USDC_ADDRESS}>Mumbai USDC</option>
              </Select>
              <Select placeholder="Select destination token" onChange={handleDstTokenChange} color={"orange"}>
                <option value={POLYGON_DAI_ADDRESS}>Polygon DAI</option>
                <option value={POLYGON_USDC_ADDRESS}>Polygon USDC</option>
                <option value={POLYGON_USDT_ADDRESS}>Polygon USDT</option>
                <option value={MUMBAI_DAI_ADDRESS}>Mumbai DAI</option>
                <option value={MUMBAI_USDC_ADDRESS}>Mumbai USDC</option>
              </Select>
              <Input placeholder="Enter Amount in WEI" onChange={handleAmountChange} /> 
            </>
          )}

          {quote && (
            <>
              <Text>Quote: {quote.toAmount}</Text>
            </>
          )}

          {transactionStatus && (
            <Text>Transaction Status: {transactionStatus}</Text>
          )}

          {outcome && (
            <>
              <Text>Simulation Outcome: {outcome}</Text>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
}

export default GameScreen;