import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Home from './pages/Home';
import Calculate from './pages/Calculate/Calculate';
import Accounts from './pages/Accounts/Accounts';
import History from './pages/History/History';
import Banks from './pages/Banks/Banks';
import Settings from './pages/Settings/Settings';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
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
      {createPortal(
        <ToastContainer
          style={{ zIndex: 9999 }}
          containerId="toast-container"
        />,
        document.body
      )}
    </>
  );
};

export default App;
