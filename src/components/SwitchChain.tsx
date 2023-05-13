import { useEffect, useState } from 'react';
import { Box, IconButton, HStack } from '@chakra-ui/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { chain1, chain2 } from 'src/config';
import { Chain } from 'src/types';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const MotionBox = motion(Box);

interface TextItemProps {
  key: string;
  chain: Chain;
}

const TextItem: React.FC<TextItemProps> = ({ chain, key }) => (
  <MotionBox
    key={key}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    positionTransition
  >
    {chain.name}
  </MotionBox>
);

export default function SwitchChain() {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    console.log(chain)
    if (!chain || (chain?.id !== chain1.id && chain?.id !== chain2?.id)) switchNetwork?.(chain1.id)
  }, [chain])

  const handleClick = () => {
    console.log(chains)
    if (chain?.id === chain1.id) switchNetwork?.(chain2.id)
    else switchNetwork?.(chain1.id)
  };

  return (
    <HStack spacing={4} alignItems="center">
      <AnimatePresence>
        {chain?.id === chain1.id && <TextItem chain={chain1} key="text1" />}
      </AnimatePresence>
      <IconButton
        icon={chain?.id === chain2.id ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        aria-label="Switch Chain"
        onClick={handleClick}
      />
      <AnimatePresence>
        {chain?.id === chain2.id && <TextItem chain={chain2} key="text2" />}
      </AnimatePresence>
    </HStack>
  );
}
