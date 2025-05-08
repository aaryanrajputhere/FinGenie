import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Chat from "../components/Chat";

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust if you store token differently
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
        navigate("/signup");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header/>
      <Chat  />
    </div>
  );
}
