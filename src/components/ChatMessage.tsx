import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { Message } from 'src/types';
import { hexToString } from 'src/utils';
import { useNetwork } from 'wagmi';

const MotionBox = motion(Box);

const ChatMessage = ({ message }: { message: Message }) => {
    const animation = useAnimation();
    const { chain } = useNetwork()

    React.useEffect(() => {
        animation.start({
            alignSelf: message.originChainId === chain?.id ? 'flex-start' : 'flex-end',
        });
    }, [message.sender, chain, animation]);

    return (
        <MotionBox initial={false} animate={animation} transition={{ duration: 0.3 }}>
            <Text
                p={2}
                borderRadius="md"
                bg={message.originChainId === chain?.id ? 'blue.500' : 'gray.300'}
                color={message.originChainId === chain?.id ? 'white' : 'black'}
            >
                {hexToString(message.body as `0x${string}`)}
            </Text>
        </MotionBox>
    );
};

export default ChatMessage