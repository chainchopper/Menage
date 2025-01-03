const express = require('express');
const Web3 = require('web3');
const ElizaAI = require('./ai/eliza');
const MenageCoin = require('./contracts/MenageCoin.json');
const NFTMaturity = require('./contracts/NFTMaturity.json');

const app = express();
app.use(express.json());

const web3 = new Web3('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const mncAddress = 'YOUR_DEPLOYED_MNC_ADDRESS';
const nftAddress = 'YOUR_DEPLOYED_NFT_ADDRESS';

const mncContract = new web3.eth.Contract(MenageCoin.abi, mncAddress);
const nftContract = new web3.eth.Contract(NFTMaturity.abi, nftAddress);
const eliza = new ElizaAI();

app.post('/chat', async (req, res) => {
  try {
    const { message, address } = req.body;
    const response = await eliza.processInput(message);
    
    if (response.action) {
      switch (response.action) {
        case 'getBalance':
          const balance = await mncContract.methods.balanceOf(address).call();
          response.balance = web3.utils.fromWei(balance, 'ether');
          break;
        case 'getEggs':
          const eggCount = await nftContract.methods.balanceOf(address).call();
          response.eggs = [];
          for (let i = 0; i < eggCount; i++) {
            const tokenId = await nftContract.methods.tokenOfOwnerByIndex(address, i).call();
            const egg = await nftContract.methods.eggs(tokenId).call();
            response.eggs.push({
              tokenId: tokenId.toString(),
              maturityTime: egg.maturityTime.toString(),
              currentSize: egg.currentSize.toString(),
              hasHatched: egg.hasHatched
            });
          }
          break;
        case 'hatchEgg':
          // Implement hatching logic
          break;
      }
    }
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
