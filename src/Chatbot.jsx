import React, { useState } from 'react';
import supabase from './supabaseClient';
import './Chatbot.css';

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
      // Fetch chat history from Supabase
      const { data: history, error: historyError } = await supabase
        .from('chat_history')
        .select('*')
        .order('id', { ascending: true });

      if (historyError) {
        console.error('Error fetching chat history:', historyError.message);
      }

      // Generate a response using the chat history
      const botMessage = {
        role: 'assistant',
        content: await handleQuery(input, history || []),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Store the prompt and response in Supabase
      const { error } = await supabase.from('chat_history').insert([
        { prompt: input, response: botMessage.content },
      ]);

      if (error) {
        console.error('Error storing data in Supabase:', error);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error generating response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleQuery = async (query, history) => {
    // Use chat history to enhance responses (if needed)
    const previousConversations = history.map((entry) => `${entry.prompt}: ${entry.response}`).join('\n');

    // Provide refined responses for specific queries
    if (query.toLowerCase().includes('post ideas')) {
      return 'Here are some engaging post ideas for Instagram: Share behind-the-scenes content, run a poll, post user-generated content, or share a motivational quote.';
    } else if (query.toLowerCase().includes('trending articles')) {
      return 'Here are some trending articles: "Top 10 Digital Marketing Trends", "How to Boost Engagement on Social Media", "The Future of E-commerce".';
    } else if (query.toLowerCase().includes('improve engagement')) {
      return 'To improve engagement, post consistently, use relevant hashtags, interact with your audience through comments and polls, and analyze your content performance.';
    } else if (query.toLowerCase().includes('statistics')) {
      return 'You can find statistics to support your post on platforms like Statista, Google Trends, or HubSpot. Let me know if you need help finding specific data.';
    } else if (query.toLowerCase().includes('tiktok strategies')) {
      return 'The latest TikTok strategies include using trending sounds, creating short and engaging videos, collaborating with influencers, and participating in viral challenges.';
    } else if (query.toLowerCase().includes('caption')) {
      // Generate a caption for a personal post
      return 'Here’s a caption idea for your personal post: "Every moment is a fresh beginning 🌟 #NewBeginnings #PersonalJourney"';
    }

    // Fallback response for unexpected queries
    return 'Thank you for your question! Let me know how I can assist further.';
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
