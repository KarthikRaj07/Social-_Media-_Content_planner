import React, { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';
import supabase from './supabaseClient'; // Ensure this file exists
import './Chatbot.css';

const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_TOKEN);

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const chatCompletion = await client.chatCompletion({
        provider: 'nebius',
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [...messages, userMessage],
        max_tokens: 512,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (
        chatCompletion &&
        chatCompletion.choices &&
        chatCompletion.choices[0] &&
        chatCompletion.choices[0].message &&
        chatCompletion.choices[0].message.content
      ) {
        const botMessage = {
          role: 'assistant',
          content: chatCompletion.choices[0].message.content,
        };
        setMessages((prev) => [...prev, botMessage]);

        // Store the prompt and response in Supabase
        const { error } = await supabase.from('chat_history').insert([
          {
            prompt: input, // User's input
            response: botMessage.content, // Bot's response
          },
        ]);

        if (error) {
          console.error('Error storing data in Supabase:', error);
        }
      } else {
        throw new Error('Invalid response from the API');
      }
    } catch (error) {
      console.error('Error generating text:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error generating response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">Chatbot</div>
      <div className={`chat-input ${messages.length === 0 ? 'centered-input' : 'top-input'}`}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="loading-spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;
