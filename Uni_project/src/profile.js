import React, { useEffect, useState } from 'react';
import './App.css';
import Portfolio from './portfolio';
import fetchCoinData from './priceing_api'; 

const Profile = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [ethereumPrice, setEthereumPrice] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const coinData = await fetchCoinData();
      const bitcoin = coinData.find(coin => coin.name === 'Bitcoin');
      const ethereum = coinData.find(coin => coin.name === 'Ethereum');

      if (bitcoin && ethereum) {
        setBitcoinPrice(bitcoin.quotes.USD.price);
        setEthereumPrice(ethereum.quotes.USD.price);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="main_content">
      <div className="main_top">
        <div className="main_top_left">
          <h5>Bitcoin: {bitcoinPrice !== null ? `${bitcoinPrice.toFixed(2)}$` : 'Loading...'}</h5>
          <h5>Ethereum: {ethereumPrice !== null ? `${ethereumPrice.toFixed(2)}$` : 'Loading...'}</h5>
        </div>
      </div>
      <Portfolio />
    </div>
  );
};

export default Profile;
