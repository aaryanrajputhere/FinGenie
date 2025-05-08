interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface HeaderProps {
  user: User | null;
}
export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-black text-white px-6 py-4 shadow-xl mx-auto my-6 max-w-2xl rounded-4xl border border-gray-800">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <nav className="flex space-x-6">
          <a
            href="/"
            className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            FinGenie AI
          </a>
          <a
            href="/transactions"
            className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Transactions
          </a>
          <a
            href="/analytics"
            className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Analytics
          </a>
        </nav>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          {user && (
            <>
              {/* Circle with first letter */}
              <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full text-white font-semibold">
                {user.name.charAt(0)}
              </div>
              {/* User's Name */}
              <p className="font-semibold text-sm">{user.name}</p>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
