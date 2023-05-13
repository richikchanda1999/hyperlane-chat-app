export type Origin = {
  timestamp: number;
  hash: string;
  from: string;
  blockHash: string;
  blockNumber: number;
  mailbox: string;
  nonce: number;
  to: string;
  gasLimit: number;
  gasPrice: number;
  effectiveGasPrice: number;
  gasUsed: number;
  cumulativeGasUsed: number;
  maxFeePerGas: number;
  maxPriorityPerGas: number;
};

export type Destination = {
  timestamp: number;
  hash: string;
  from: string;
  blockHash: string;
  blockNumber: number;
  mailbox: string;
  nonce: number;
  to: string;
  gasLimit: number;
  gasPrice: number;
  effectiveGasPrice: number;
  gasUsed: number;
  cumulativeGasUsed: number;
  maxFeePerGas: number;
  maxPriorityPerGas: number;
};

export type Message = {
  status: string;
  id: string;
  nonce: number;
  sender: string;
  recipient: string;
  originChainId: number;
  originDomainId: number;
  destinationChainId: number;
  destinationDomainId: number;
  origin: Origin;
  destination?: Destination;
  isPiMsg: boolean;
  body: string;
  totalGasAmount: string;
  totalPayment: string;
  numPayments: number;
};

export type Data = {
  status: string;
  message: string;
  result: Message[];
};

export interface Contracts {
  mailbox: string;
  testRecipient: string;
  gasPaymaster: string;
}

export interface Chain {
  name: string;
  id: number;
  contracts: Contracts;
}
