import React, { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';
const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;
const client = new InferenceClient(HF_TOKEN);

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const chatCompletion = await client.chatCompletion({
        provider: 'nebius',
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
        max_tokens: 512,
      });
      setResponse(chatCompletion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating text:', error);
      setResponse('Error generating response.');
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default Chatbot;
