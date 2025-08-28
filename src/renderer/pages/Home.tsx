import { useNavigate } from 'react-router-dom';
import { ImCalculator } from 'react-icons/im';
import { MdOutlineSupervisorAccount, MdOutlineSettings, MdError, MdLogout } from 'react-icons/md';
import { LuHistory } from 'react-icons/lu';
import { PiBankBold } from 'react-icons/pi';
import { Text } from '@radix-ui/themes';
import { useSettingsContext } from '../contexts/SettingsContext';
import { useUserContext } from '../contexts/UserContext';
import { ClipLoader } from 'react-spinners';

const Home = () => {
  const navigate = useNavigate();
  const { loading, error, refreshSettings } = useSettingsContext();
  const { logout } = useUserContext();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-8 mt-36">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-blue-400/20 rounded-xl flex items-center justify-center">
            <ImCalculator className="text-blue-300 text-4xl" />
          </div>
          <div className="text-center">
            <Text className="text-white text-2xl font-bold mb-2">System Loading</Text><br />
            <Text className="text-gray-300 text-sm">Initializing Tax Calculation System</Text>
          </div>
          <ClipLoader color="#60A5FA" size={40} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-8 mt-36">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 p-12 flex flex-col items-center gap-6 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center">
            <MdError className="text-red-400 text-4xl" />
          </div>
          <div className="text-center">
            <Text className="text-red-300 text-2xl font-bold mb-2">System Error</Text><br />
            <div className="text-gray-300 text-sm">Failed to initialize the system</div><br />
            <Text className="text-red-200 text-xs bg-red-500/10 rounded-lg p-3 border border-red-500/20 mt-3">
              {error}
            </Text>
          </div>
          <button
            onClick={refreshSettings}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg px-6 py-3 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <MdError className="text-lg" />
            Reload System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-20">
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-400/20 rounded-xl flex items-center justify-center">
            <ImCalculator className="text-blue-300 text-4xl" />
          </div>
          <Text className="text-white text-6xl font-bold">TAX CALCULATOR</Text>
        </div>

      </div>

      {/* Navigation Grid */}
      <div className="grid w-full max-w-4xl grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Calculate - Main Feature */}
        <div
          className="row-span-2 flex cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 p-8 transition-all duration-300 hover:scale-105 group"
          onClick={() => navigate('/calculate')}
        >
          <div className="w-20 h-20 bg-blue-400/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ImCalculator className="text-blue-300 text-5xl" />
          </div>
          <Text className="text-blue-300 text-3xl font-bold">CALCULATE</Text>
        </div>

        {/* Accounts */}
        <div
          className="flex cursor-pointer items-center gap-4 rounded-2xl bg-green-400/20 hover:bg-green-400/30 border border-green-400/30 p-6 transition-all duration-300 hover:scale-105 group"
          onClick={() => navigate('/accounts')}
        >
          <div className="w-12 h-12 bg-green-400/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <MdOutlineSupervisorAccount className="text-green-300 text-2xl" />
          </div>
          <Text className="text-green-300 text-xl font-bold">ACCOUNTS</Text>
        </div>

        {/* History */}
        <div
          className="flex cursor-pointer items-center gap-4 rounded-2xl bg-purple-400/20 hover:bg-purple-400/30 border border-purple-400/30 p-6 transition-all duration-300 hover:scale-105 group"
          onClick={() => navigate('/history')}
        >
          <div className="w-12 h-12 bg-purple-400/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <LuHistory className="text-purple-300 text-2xl" />
          </div>
          <Text className="text-purple-300 text-xl font-bold">HISTORY</Text>
        </div>

        {/* Banks */}
        <div
          className="flex cursor-pointer items-center gap-4 rounded-2xl bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 p-6 transition-all duration-300 hover:scale-105 group"
          onClick={() => navigate('/banks')}
        >
          <div className="w-12 h-12 bg-yellow-400/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PiBankBold className="text-yellow-300 text-2xl" />
          </div>
          <Text className="text-yellow-300 text-xl font-bold">BANKS</Text>
        </div>

        {/* Settings */}
        <div
          className="flex cursor-pointer items-center gap-4 rounded-2xl bg-red-400/20 hover:bg-red-400/30 border border-red-400/30 p-6 transition-all duration-300 hover:scale-105 group"
          onClick={() => navigate('/settings')}
        >
          <div className="w-12 h-12 bg-red-400/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <MdOutlineSettings className="text-red-300 text-2xl" />
          </div>
          <Text className="text-red-300 text-xl font-bold">SETTINGS</Text>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="bg-red-400/20 hover:bg-red-400/30 text-red-300 border border-red-400/30 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <MdLogout className="text-lg" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-[5vh] text-center">
        <Text className="text-gray-400 text-sm">
          Tax Calculation System v1.0
        </Text>
      </div>
    </div>
  );
};

export default Home;
