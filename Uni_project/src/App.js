import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './navbar';
import Table from './table';
import fetchCoinData from './priceing_api'; 
import Profile from './profile'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const BurschCoin = () => {
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
      <div className="main_table">
        <div className="main_table_top">
          <div className="main_table_left">
            <h2>Balances</h2>
          </div>
        </div>
        <Table />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BurschCoin />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
