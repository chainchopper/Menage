import React, { useState } from 'react';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [address, setAddress] = useState('');

  return (
    <div className="app">
      <h1>Menage NFT Game</h1>
      <div className="address-input">
        <input
          type="text"
          placeholder="Enter your wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {address && <Chat address={address} />}
    </div>
  );
}

export default App;
