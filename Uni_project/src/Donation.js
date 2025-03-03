import React, { useState, useEffect, useCallback } from 'react';
import CustomButton from './costumButton';
import './App.css';

const Donation = () => {
  const [showInput, setShowInput] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const sepoliaToEthRate = 0.01;

  useEffect(() => {
    const getAccount = async () => {
      const provider = window.ethereum;
      if (!provider) {
        console.error("MetaMask is not installed");
        return;
      }
      try {
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        setAccounts(accounts);
      } catch (error) {
        console.error("Error getting accounts:", error);
      }
    };
    getAccount();
  }, []);

  const handleDonationClick = () => {
    setShowInput(prev => !prev);
  };

  const handleSendClick = useCallback(async () => {
    const provider = window.ethereum;
    if (!accounts.length) {
      console.error("No account found");
      return;
    }

    const recipient = "wallet address";
    const donationInSepoliaETH = parseFloat(donationAmount);
    const valueInWei = (donationInSepoliaETH * sepoliaToEthRate * Math.pow(10, 18)).toString();

    try {
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      const balanceInEth = parseFloat(balance) / Math.pow(10, 18);
      const gasPrice = await provider.request({ method: "eth_gasPrice" });
      const estimatedGasLimit = await provider.request({
        method: "eth_estimateGas",
        params: [{
          from: accounts[0],
          to: recipient,
          value: '0x' + Number(valueInWei).toString(16),
        }],
      });
      const estimatedFee = (estimatedGasLimit * parseFloat(gasPrice)) / Math.pow(10, 18);

      if (balanceInEth < donationInSepoliaETH + estimatedFee) {
        alert(`Not enough SepoliaETH to cover transaction and fees. Required: ${donationInSepoliaETH + estimatedFee} ETH`);
        return;
      }

      await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: accounts[0],
          to: recipient,
          value: '0x' + Number(valueInWei).toString(16),
          gas: estimatedGasLimit.toString(),
          maxPriorityFeePerGas: '0x3b9aca00',
          maxFeePerGas: '0x2540be400',
        }],
      });

      setDonationAmount('');
      setShowInput(false);
    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Transaction failed. Please check the console for details.");
    }
  }, [accounts, donationAmount]);

  return (
    <div className="donation-container">
      <CustomButton className="main_button donation_bottom_button" text="Donation" onClick={handleDonationClick}/>
      {showInput && (
        <div className="donation-input-container">
          <input type="text" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} 
          placeholder="Enter amount in SepoliaETH" className="donation-input"/>
          <CustomButton className="normal_button" text="Send" onClick={handleSendClick}/>
        </div>
      )}
    </div>
  );
};

export default Donation;
