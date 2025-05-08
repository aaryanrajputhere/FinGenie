import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

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
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, {
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
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="max-w-md w-full mx-auto bg-black rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden">
        {/* Login Header */}
        <div className="p-6 bg-gradient-to-b from-black to-gray-900">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center">Log in to your account</p>
        </div>
        
        {/* Form Area */}
        <div className="flex-1 p-6 space-y-5 bg-gradient-to-b from-gray-900 to-black">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="bg-gray-800 rounded-full overflow-hidden pl-4 border border-gray-700">
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full py-3 px-4 bg-transparent text-white text-sm outline-none"
                required
                aria-label="Email"
              />
            </div>
            
            {/* Password Input */}
            <div className="bg-gray-800 rounded-full overflow-hidden pl-4 border border-gray-700">
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full py-3 px-4 bg-transparent text-white text-sm outline-none"
                required
                aria-label="Password"
              />
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm transition-colors">
                Forgot password?
              </a>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center"
              aria-label="Log In"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Log In'
              )}
            </button>
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </form>
          
          {/* Signup Link */}
          <div className="text-center text-gray-500 text-sm pt-4">
            Don't have an account?{' '}
            <Link to="/signup">
              <span className="text-emerald-500 hover:text-emerald-400 transition-colors">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}