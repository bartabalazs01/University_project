import React, { useEffect, useState } from 'react';
import './App.css';

const importImage = (chain) => {
  try {
    return require(`./assets/${chain}.png`);
  } catch (error) {
    return require('./assets/default.png');
  }
};

const App = () => {
  const [address, setAddress] = useState('');
  const [balances, setBalances] = useState({
    ethereum: { balance: 'Loading...', tokens: [] },
    avalanche: { balance: 'Loading...', tokens: [] },
    arbitrum: { balance: 'Loading...', tokens: [] },
    base: { balance: 'Loading...', tokens: [] },
    linea: { balance: 'Loading...', tokens: [] },
    optimism: { balance: 'Loading...', tokens: [] },
    scroll: { balance: 'Loading...', tokens: [] },
  });

  const [visibleList, setVisibleList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
      } else {
        setError('Please install MetaMask!');
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    if (address) {
      const fetchBalance = async () => {
        const chains = ['ethereum', 'avalanche', 'arbitrum', 'base', 'linea', 'optimism', 'scroll'];
      
        try {
          const newBalances = {};
      
          for (const chain of chains) {
            const response = await fetch(`http://localhost:3500/${chain}?address=${address}`);
            if (!response.ok) {
              const errorDetails = await response.text();
              throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
            }
            const data = await response.json();
      
            newBalances[chain] = {
              balance: (parseFloat(data.native) || 0).toFixed(5),
              tokens: data.tokens.map(token => {
                const [value, name] = token.split(' ');
                return { name: name || 'Token', amount: (parseFloat(value) || 0).toFixed(5) };
              }),
            };
          }
      
          setBalances(newBalances);
        } catch (error) {
          console.error(`Error fetching data:`, error);
          setError(`Error loading data: ${error.message}`);
        }
      };
      fetchBalance();
    }
  }, [address]);

  const toggleList = (chain) => {
    setVisibleList(prev => (prev === chain ? null : chain));
    console.log(`Visible list set to: ${visibleList === chain ? null : chain}`);
    console.log('Tokens for chain:', balances[chain].tokens);
  };

  return (
    <div className="main_profile">
      <h2>Profile</h2>
      <h3>Portfolio</h3>
      <div className="line"></div>
      {error && <div className="error">{error}</div>}
      <div className="profile_tokens">
        {Object.keys(balances).map((chain) => (
          <div className='single_token' key={chain}>
            <img className="title_img" src={importImage(chain)} alt={chain} />
            <div className='single_token_left'>
              <h6>{chain.charAt(0).toUpperCase() + chain.slice(1)}</h6>
              <p><strong>Native Balance:</strong> <span>{balances[chain].balance}</span>$</p>
              <button 
                className={`toggle-button ${visibleList === chain ? 'active' : ''}`} 
                onClick={() => toggleList(chain)}
              >
                {visibleList === chain ? 'Hide tokens' : 'Show tokens'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="token-list-container">
        {Object.keys(balances).map((chain) => (
          visibleList === chain && (
            <div className="token-list" key={chain}>
              <h4>{chain.charAt(0).toUpperCase() + chain.slice(1)} Tokens</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {balances[chain].tokens.map((token, index) => (
                    <tr key={index}>
                      <td>{token.name}</td>
                      <td>{token.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ))}

      </div>
    </div>
  );
};

export default App;
