import { useState, useEffect, useCallback } from "react";
import {
  type WalletState,
  connectWallet,
  getCurrentWallet,
  switchToNetwork,
} from "@/lib/web3";

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || "0");

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setWallet({ address: null, chainId: null, isConnected: false });
    } else {
      setWallet((prev) => ({ ...prev, address: accounts[0] }));
    }
  }, []);

  const handleChainChanged = useCallback((chainId: string) => {
    setWallet((prev) => ({ ...prev, chainId: parseInt(chainId, 16) }));
  }, []);

  useEffect(() => {
    async function checkWallet() {
      const currentWallet = await getCurrentWallet();
      setWallet(currentWallet);
      setIsLoading(false);
    }

    checkWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      const newWallet = await connectWallet();
      setWallet(newWallet);

      // Check if we need to switch networks
      if (expectedChainId && newWallet.chainId !== expectedChainId) {
        await switchToNetwork(expectedChainId);
      }
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [expectedChainId]);

  const disconnect = useCallback(() => {
    setWallet({ address: null, chainId: null, isConnected: false });
  }, []);

  const switchNetwork = useCallback(async () => {
    if (expectedChainId) {
      await switchToNetwork(expectedChainId);
    }
  }, [expectedChainId]);

  const isCorrectNetwork = wallet.chainId === expectedChainId;

  return {
    wallet,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
    isCorrectNetwork,
  };
}
