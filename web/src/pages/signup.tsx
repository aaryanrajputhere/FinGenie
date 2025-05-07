import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
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
    try{
      
      const response = await axios.post<ApiResponse>('http://localhost:3000/api/v1/user/signup', {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });
      console.log(response.data.token)
      localStorage.setItem('token', response.data.token);
      navigate('/');
      console.log('Signup successful:', response.data);
    }
      
    catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Sign up to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="border-b-2 border-gray-700">
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full py-3 px-4 bg-transparent outline-none"
                required
                aria-label="Name"
              />
            </div>
            
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
                minLength={8}
                aria-label="Password"
              />
            </div>
            
            {/* Confirm Password Input */}
            <div className="border-b-2 border-gray-700">
              <input
                type="password"
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full py-3 px-4 bg-transparent outline-none"
                required
                minLength={8}
                aria-label="Confirm Password"
              />
            </div>
          </div>
          
          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
              aria-label="Sign Up"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="text-center text-gray-500 text-sm mt-6">
            Already have an account? 
           <Link
           to={"/login"}>
           <span className="text-gray-400 hover:text-gray-300 ml-1 cursor-pointer">
              Log in
            </span>
           </Link>
          </div>
        </form>
      </div>
    </div>
  );
}