import { useState, useRef, useEffect } from 'react';
import axios from 'axios';


export default function Chat() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // For managing the loading state
  const bottomRef = useRef<HTMLDivElement>(null);

  // Function to handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: { sender: 'user'; text: string } = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true); // Start loading while waiting for the response

    try {
      const aiReply = await fetchAiResponse(input);
      const aiMessage: { sender: 'ai'; text: string } = { sender: 'ai', text: aiReply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Sorry, something went wrong. Please try again later.' },
      ]);
    } finally {
      setLoading(false); // End loading after response
    }

    setInput('');
  };

  // Function to fetch AI response
  const fetchAiResponse = async (text: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<{ amount: number; tag: string }>(
        'http://localhost:3000/api/v1/expense/process_spending',
        { sentence: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log(response.data); // Log the response for debugging purposes
      
      // Now you can safely access 'amount' and 'tag'
      const { amount, tag } = response.data;
      
      // Construct a response based on the API data
      return amount && tag
        ? `You Spent ${amount} on ${tag}`
        : `Sorry I am not able to understand, Can you clarify your expense"`;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      throw new Error('Failed to fetch response');
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-black text-white rounded-xl shadow-lg h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-900 text-white p-3 rounded-l-lg outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 px-6 rounded-r-lg"
          disabled={loading || !input.trim()} // Disable button if loading or input is empty
        >
          {loading ? 'Sending...' : 'Send'} {/* Show loading text */}
        </button>
      </div>
    </div>
  );
}
