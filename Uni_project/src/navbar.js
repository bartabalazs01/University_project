import React, { useState } from 'react';
import CustomButton from './costumButton';
import logo from './assets/logo.png';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Donation from './Donation';

const Navbar = () => {
  const navigate = useNavigate();
  const [connButtonText, setConnButtonText] = useState('Login with MetaMask Wallet');
  const [errorMessage, setErrorMessage] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const displayAddress = `${accounts[0].slice(0, 8)}...`;
        setUserAddress(displayAddress);
        setConnButtonText(`Your address: ${displayAddress}`);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Please install the MetaMask browser extension to interact');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="navbar">
      <button className="title_button width_100" onClick={scrollToTop}>
        <img className="title_img" src={logo} alt="logo" />
        Bursch Coin
      </button>
      <button className="main_button button_50_width" onClick={connectWalletHandler}>
        {userAddress ? `Your address: ${userAddress}` : connButtonText}
      </button>
      {errorMessage && <p>{errorMessage}</p>}
      <CustomButton className="normal_button button_50_width" text="Home" onClick={() => navigate('/')} />
      {userAddress && (
        <>
          <CustomButton className="normal_button button_50_width" text="Profile" onClick={() => navigate('/profile')} />
          <Donation />
        </>
      )}
    </div>
  );
};

export default Navbar;
