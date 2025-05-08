import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transactions" element={<PrivateRoute element={<Transactions />} />} />
        <Route path="/analytics" element={<PrivateRoute element={<AnalyticsPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
