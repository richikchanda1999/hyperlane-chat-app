import { ethers } from "ethers";

export function stringToHex(str: string) {
  return ethers.hexlify(ethers.toUtf8Bytes(str));
}

// Convert hex to a string
export function hexToString(hex: ethers.BytesLike) {
  return ethers.toUtf8String(hex);
}