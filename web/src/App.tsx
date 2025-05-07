import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import Home from './pages/home';
import Login from './pages/login';
import Transactions from './pages/transactions';
import AnalyticsPage from './pages/analytics';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

        </Routes>
      </Router>
  
  );
}

export default App;
