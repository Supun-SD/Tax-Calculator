import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Home from './pages/Home';
import Calculate from './pages/Calculate/CreateEdit/Calculate';
import Accounts from './pages/Accounts/Accounts';
import History from './pages/History/History';
import Banks from './pages/Banks/Banks';
import Settings from './pages/Settings/Settings';
import { ToastContainer } from 'react-toastify';
import { SettingsProvider } from './contexts/SettingsContext';
import { CalculationProvider } from './contexts/CalculationContext';
import ViewCalculation from './pages/Calculate/View/ViewCalculation';
import Login from './pages/Login/Login';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';


const App = () => {
  return (
    <SettingsProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/calculate" element={<ProtectedRoute><CalculationProvider><Calculate /></CalculationProvider></ProtectedRoute>} />
            <Route path="/view-calculation/:id" element={<ProtectedRoute><ViewCalculation /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/banks" element={<ProtectedRoute><Banks /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </Router>
        {createPortal(
          <ToastContainer
            style={{ zIndex: 9999 }}
            containerId="toast-container"
          />,
          document.body
        )}
      </UserProvider>
    </SettingsProvider >
  );
};

export default App;
