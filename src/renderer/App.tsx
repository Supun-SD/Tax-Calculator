import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Calculate from './pages/Calculate/Calculate';
import Accounts from './pages/Accounts/Accounts';
import History from './pages/History/Histroy';
import Banks from './pages/Banks/Banks';
import Settings from './pages/Settings/Settings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/history" element={<History />} />
        <Route path="/banks" element={<Banks />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;
