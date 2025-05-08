import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Signup from './pages/signup';
import Home from './pages/home';
import Login from './pages/login';
import Transactions from './pages/transactions';
import AnalyticsPage from './pages/analytics';
import Header from './components/Header';
import { useEffect, useState, type JSX } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

function AppWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const response = await axios.get<User>(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    return user ? element : <Navigate to="/login" replace />;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );
  
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideHeader && <Header user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transactions" element={<PrivateRoute element={<Transactions />} />} />
        <Route path="/analytics" element={<PrivateRoute element={<AnalyticsPage />} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
