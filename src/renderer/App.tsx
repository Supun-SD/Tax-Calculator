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
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/home" element={<ProtectedRoute><SettingsProvider><Home /></SettingsProvider></ProtectedRoute>} />
          <Route path="/calculate" element={<ProtectedRoute><SettingsProvider><CalculationProvider><Calculate /></CalculationProvider></SettingsProvider></ProtectedRoute>} />
          <Route path="/view-calculation/:id" element={<ProtectedRoute><SettingsProvider><ViewCalculation /></SettingsProvider></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><SettingsProvider><Accounts /></SettingsProvider></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><SettingsProvider><History /></SettingsProvider></ProtectedRoute>} />
          <Route path="/banks" element={<ProtectedRoute><SettingsProvider><Banks /></SettingsProvider></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsProvider><Settings /></SettingsProvider></ProtectedRoute>} />
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
  );
};

export default App;
