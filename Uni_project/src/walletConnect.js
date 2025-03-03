import { ethers, formatEther } from 'ethers';
import { useState, useEffect } from 'react';

export const useWalletConnect = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Login with MetaMask Wallet');
  const [provider, setProvider] = useState(null);
  const [tokenData, setTokenData] = useState({});

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setDefaultAccount(accounts[0]);
        await fetchTokens(accounts[0]);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Please install the MetaMask browser extension to interact');
    }
  };

  const fetchTokens = async (address) => {
    const chains = ['ethereum', 'avalanche', 'arbitrum', 'base', 'linea', 'optimism', 'scroll'];
    const fetchedTokenData = {};

    try {
      for (const chain of chains) {
        const response = await fetch(`http://localhost:3500/${chain}?address=${address}`);
        if (!response.ok) {
          throw new Error(`Error fetching ${chain} chain: HTTP ${response.status}`);
        }
        const data = await response.json();
        fetchedTokenData[chain] = data;
      }
      setTokenData(fetchedTokenData);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setErrorMessage("Failed to fetch token data.");
    }
  };

  useEffect(() => {
    if (defaultAccount && provider) {
      provider.getBalance(defaultAccount).then((balance) => {
        setUserBalance(formatEther(balance));
      }).catch((error) => {
        setErrorMessage(error.message);
      });
    }
  }, [defaultAccount, provider]);

  return {
    connectWalletHandler,
    defaultAccount,
    userBalance,
    connButtonText,
    errorMessage,
    tokenData,
  };
};
