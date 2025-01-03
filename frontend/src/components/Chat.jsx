import React, { useState } from 'react';
import axios from 'axios';

function Chat({ address }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { text: input, fromUser: true }];
    setMessages(newMessages);
    setInput('');
    
    try {
      const response = await axios.post('/chat', {
        message: input,
        address: address
      });
      
      setMessages([...newMessages, { text: response.data.response || JSON.stringify(response.data), fromUser: false }]);
    } catch (error) {
      setMessages([...newMessages, { text: 'Error: ' + error.message, fromUser: false }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.fromUser ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
