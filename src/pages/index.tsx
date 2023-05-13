import { useEffect, useState } from 'react';
import { Box, Input, Button, VStack, HStack, useToast, Text, Textarea, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import SwitchChain from 'src/components/SwitchChain';
import { Data, Message } from 'src/types';
import { chain1, chain2 } from 'src/config';
import { zeroPadBytes, zeroPadValue } from 'ethers';
import { hexToString, stringToHex } from 'src/utils';
import MailboxContractABI from "src/ABIs/MailboxContract.json"
import ChatMessage from 'src/components/ChatMessage';

const MotionBox = motion(Box);

export default function Home() {
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const toast = useToast();

  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const { isLoading: isDispatching, writeAsync: dispatch } = useContractWrite({
    address: (chain?.id === chain1?.id ? chain1?.contracts?.mailbox : chain2?.contracts?.mailbox) as `0x${string}`,
    abi: MailboxContractABI,
    functionName: 'dispatch',
  })

  const fetchMessages = async () => {
    const endpoint = `https://explorer.hyperlane.xyz/api?module=message&action=get-messages&sender=${address}`
    const response = await fetch(endpoint)
    if (response.status === 200) {
      const data: Data = await response.json()
      if (data.message === 'OK') {
        const result = data.result
        result.sort((a: Message, b: Message) => a.origin.timestamp - b.origin.timestamp)
        setMessages(result)
      }
    }
  }

  const sendMessage = async () => {
    if ((chain?.id === chain1?.id && chain1?.contracts?.testRecipient === '') || (chain?.id === chain2?.id && chain2?.contracts?.testRecipient === '')) {
      toast({
        title: 'Error',
        description: 'Need test recipient address!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }

    const fromChain = chain?.id === chain1?.id ? chain1 : chain2
    const toChain = chain?.id === chain1?.id ? chain2 : chain1

    if (fromChain?.id === toChain?.id) {
      toast({
        title: 'Error',
        description: 'Inter chain messaging not possible!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const args = [toChain.id, zeroPadValue(toChain.contracts.testRecipient, 32), stringToHex(text)]

    //1. Call mailbox contract
    const res = await dispatch?.({ args })
    console.log({ 'Transaction hash': res?.hash })

    //2. Get gas estimate
    //3. Pay manual gas fee

    toast({
      title: 'Text submitted',
      description: `You entered: ${text}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setText('');
  }

  useEffect(() => {
    console.log(messages)
  }, [messages])

  useEffect(() => {
    if (isConnected && address) fetchMessages()
  }, [address, isConnected])

  const handleSubmit = () => {
    // Add your custom logic here
    if (isConnected) {
      console.log(text);
      sendMessage()
    } else {
      connect({ connector: connectors[0] })
    }
  };

  return (
    <MotionBox
      as="main"
      w="100%"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, cyan.400, blue.500)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HStack
        spacing={8}
        w='100%'
        justify={'center'}
      >
        <VStack justify={'center'} spacing={4} p={4} width={['90%', '80%', '60%', '40%']}>
          <SwitchChain />
          <VStack
            p={6}
            bg="white"
            borderRadius="md"
            boxShadow="xl"
            w='100%'
          >
            <Textarea
              placeholder="Enter your message"
              size="md"
              value={text}
              h='20vh'
              onChange={(e) => setText(e.target.value)}
              focusBorderColor="blue.500"
              borderRadius="md"
            />
            <Button
              isLoading={(!isConnected && connectors[0].id === pendingConnector?.id && isLoading) || (isConnected && isDispatching)}
              colorScheme="blue"
              size="md"
              onClick={handleSubmit}
              borderRadius="md"
            >
              {isConnected ? 'Send' : 'Connect'}
            </Button>
          </VStack>
        </VStack>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w={['0%', '0%', '35%', '50%']}
          h="90vh"
          p={4}
          borderRadius="md"
          backdropFilter="blur(5px)"
          bg="rgba(255, 255, 255, 0.1)"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <Flex direction="column" align="stretch" overflowY="auto" h="100%" gap={4} w='100%'>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </Flex>

        </Box>
      </HStack>
    </MotionBox>
  );
}
