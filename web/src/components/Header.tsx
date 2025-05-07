export default function Header() {
    return (
      <header className="bg-black text-white px-6 py-4 shadow-xl mx-auto my-6 max-w-2xl rounded-4xl border border-gray-800">
        <div className="flex items-center justify-around">
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
        </div>
      </header>
    );
  }
  