import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Loader } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Function to handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: { sender: 'user'; text: string } = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

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
      setLoading(false);
    }

    setInput('');
  };

  // Function to fetch AI response
  const fetchAiResponse = async (text: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<{ amount: number; tag: string }>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/process_spending`,
        { sentence: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Handle 401 Unauthorized manually
      if (response.status === 401) {
        navigate('/signup')
      }
      
      // Construct a response based on the API data
      const { amount, tag } = response.data;
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

  // Sample welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          sender: 'ai', 
          text: 'Hey, I’m Fin Genie! Let me help you track your expenses and give you smart insights. Just tell me what you spent, like "I spent 120 on a Biryani.' 
        }
      ]);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto mx-auto bg-black rounded-2xl shadow-2xl border border-gray-800 flex flex-col h-[500px] overflow-hidden">
      {/* Chat Header */}

      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-black to-gray-900">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-2xl max-w-[85%] shadow-md ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white' 
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center bg-gray-800 rounded-full overflow-hidden pl-4 pr-1">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your expense..."
            className="flex-1 bg-transparent text-white text-sm outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`p-2 rounded-full text-white ${
              loading || !input.trim() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
            }`}
          >
            {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}