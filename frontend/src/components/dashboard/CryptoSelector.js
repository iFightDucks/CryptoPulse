import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CryptoSelector = () => {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const navigate = useNavigate();
  
  const popularCoins = [
    { symbol: 'BTC/USDT', name: 'Bitcoin' },
    { symbol: 'ETH/USDT', name: 'Ethereum' },
    { symbol: 'SOL/USDT', name: 'Solana' },
    { symbol: 'XRP/USDT', name: 'Ripple' },
    { symbol: 'ADA/USDT', name: 'Cardano' },
    { symbol: 'DOGE/USDT', name: 'Dogecoin' }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol) {
      navigate(`/analysis/${symbol}`);
    }
  };
  
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Select Cryptocurrency</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter symbol (e.g. BTC/USDT)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Analyze</button>
          </div>
        </form>
        
        <div>
          <h6>Popular Cryptocurrencies</h6>
          <div className="d-flex flex-wrap gap-2">
            {popularCoins.map(coin => (
              <button
                key={coin.symbol}
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/analysis/${coin.symbol}`)}
              >
                {coin.name} ({coin.symbol.split('/')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoSelector;