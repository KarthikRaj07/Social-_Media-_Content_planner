import React, { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';

const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_TOKEN);
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_API
);

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
      const generatedResponse = chatCompletion.choices[0].message.content;
      setResponse(generatedResponse);

      // Store the prompt and response in Supabase
      const { error } = await supabase.from('chat_history').insert([
        { prompt: input, response: generatedResponse },
      ]);

      if (error) {
        console.error('Error storing data in Supabase:', error);
      }
    } catch (error) {
      console.error('Error generating text:', error);
      setResponse('Error generating response. Please try again.');
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
