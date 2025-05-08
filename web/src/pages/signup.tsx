import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse {
  token: string;
  message?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // Basic validation
    if (formState.password !== formState.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // Reset states
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`, {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/');
      console.log('Signup successful:', response.data);
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="max-w-md w-full mx-auto bg-black rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden">
      {/* Signup Header */}
      <div className="p-6 bg-gradient-to-b from-black to-gray-900">
        <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-gray-400 text-center">Sign up to get started</p>
      </div>
      
      {/* Form Area */}
      <div className="flex-1 p-6 space-y-5 bg-gradient-to-b from-gray-900 to-black">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="bg-gray-800 rounded-full overflow-hidden pl-4 border border-gray-700">
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full py-3 px-4 bg-transparent text-white text-sm outline-none"
              required
              aria-label="Name"
            />
          </div>
          
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
              minLength={8}
              aria-label="Password"
            />
          </div>
          
          {/* Confirm Password Input */}
          <div className="bg-gray-800 rounded-full overflow-hidden pl-4 border border-gray-700">
            <input
              type="password"
              name="confirmPassword"
              value={formState.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full py-3 px-4 bg-transparent text-white text-sm outline-none"
              required
              minLength={8}
              aria-label="Confirm Password"
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center"
            aria-label="Sign Up"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
          
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </form>
        
        {/* Login Link */}
        <div className="text-center text-gray-500 text-sm pt-4">
          Already have an account?{' '}
          <Link to="/login">
            <span className="text-emerald-500 hover:text-emerald-400 transition-colors">
              Log in
            </span>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}