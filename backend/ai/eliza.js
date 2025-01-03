// Adapted from https://github.com/elizaOS/eliza.git
const natural = require('natural');
const compromise = require('compromise');

class ElizaAI {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.initializeClassifier();
  }

  initializeClassifier() {
    // Basic training data
    this.classifier.addDocument('how are you', 'greeting');
    this.classifier.addDocument('hello', 'greeting');
    this.classifier.addDocument('hi', 'greeting');
    this.classifier.addDocument('what is my balance', 'balance');
    this.classifier.addDocument('show my eggs', 'eggs');
    this.classifier.addDocument('hatch my egg', 'hatch');
    this.classifier.train();
  }

  async processInput(input) {
    const classification = this.classifier.classify(input);
    const doc = compromise(input);
    const nouns = doc.nouns().out('array');
    const numbers = doc.values().out('array');

    switch (classification) {
      case 'greeting':
        return { response: "Hello! How can I assist you with your Menage NFTs today?" };
      case 'balance':
        return { action: 'getBalance' };
      case 'eggs':
        return { action: 'getEggs' };
      case 'hatch':
        return { 
          action: 'hatchEgg',
          data: {
            tokenId: numbers[0] || nouns[0]
          }
        };
      default:
        return { response: "I'm here to help with your Menage NFTs. What would you like to do?" };
    }
  }
}

module.exports = ElizaAI;
