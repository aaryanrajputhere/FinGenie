import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

interface ApiResponse {
  token: string;
  message?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await axios.post<ApiResponse>('http://localhost:3000/api/v1/user/login', {
        email: formState.email,
        password: formState.password
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/');
      console.log('Login successful:', response.data);
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="border-b-2 border-gray-700">
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full py-3 px-4 bg-transparent outline-none"
                required
                aria-label="Email"
              />
            </div>
            
            {/* Password Input */}
            <div className="border-b-2 border-gray-700">
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full py-3 px-4 bg-transparent outline-none"
                required
                aria-label="Password"
              />
            </div>
          </div>
          
          <div className="text-right">
            <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
              Forgot password?
            </a>
          </div>
          
          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
              aria-label="Log In"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="text-center text-gray-500 text-sm mt-6">
            Don't have an account? 
            <span 
              className="text-gray-400 hover:text-gray-300 ml-1 cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}