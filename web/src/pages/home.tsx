
import Chat from "../components/Chat";

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Home() {

  return (
    <div>
      <Chat  />
    </div>
  );
}
