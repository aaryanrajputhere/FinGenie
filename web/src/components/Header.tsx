interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface HeaderProps {
  user: User | null;
}

import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Close any open menus
    setUserMenuOpen(false);
    setIsMenuOpen(false);
    // Navigate to login page
    navigate('/login');
  };

  return (
    <header className="bg-black text-white px-4 sm:px-6 py-4 shadow-xl mx-auto my-6 max-w-2xl rounded-2xl sm:rounded-3xl md:rounded-4xl border border-gray-800">
      <div className="flex items-center justify-between">
        {/* Enhanced Logo */}
        <a href="/" className="flex items-center group">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Fin</span>
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Genie</span>
            <div className="flex items-center justify-center ml-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md text-xs font-bold text-black">
              AI
            </div>
          </div>
          <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 mt-0.5"></div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          <a
            href="/"
            className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
          >
            Home
          </a>
          <a
            href="/transactions"
            className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
          >
            Transactions
          </a>
          <a
            href="/analytics"
            className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
          >
            Analytics
          </a>
        </nav>

        {/* User Info - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {user && (
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <p className="font-medium text-sm">{user.name}</p>
              </button>
              
              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 py-1 z-10">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
          {!user && (
            <a 
              href="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Login
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-2 mt-4 border-t border-gray-800">
          <nav className="flex flex-col space-y-2">
            <a
              href="/"
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/transactions"
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Transactions
            </a>
            <a
              href="/analytics"
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </a>
            
            {/* User info in mobile menu */}
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <p className="font-medium text-sm">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout} 
                  className="mx-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <a 
                href="/login"
                className="mx-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-sm font-medium text-center transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}