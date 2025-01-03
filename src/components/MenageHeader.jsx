import React from 'react';

const MenageHeader = () => (
  <header className="menage-header">
    <div className="branding">
      <h1>Menage</h1>
      <p className="tagline">The Intelligent NFT Ecosystem</p>
      <p className="copyright">
        Developed by ProffX<br />
        © 2023 Fanalogy
      </p>
    </div>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/nfts">NFTs</a></li>
        <li><a href="/ai">MenageAI</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
);

export default MenageHeader;
