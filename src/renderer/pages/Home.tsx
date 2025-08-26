import { useNavigate } from 'react-router-dom';
import { ImCalculator } from 'react-icons/im';
import { MdOutlineSupervisorAccount, MdOutlineSettings } from 'react-icons/md';
import { LuHistory } from 'react-icons/lu';
import { PiBankBold } from 'react-icons/pi';
import { Text } from '@radix-ui/themes';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-20">
      {/* Header Section */}
      <div className="text-center mb-16">
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

      {/* Footer */}
      <div className="mt-[15vh] text-center">
        <Text className="text-gray-400 text-sm">
          Tax Calculation System v1.0
        </Text>
      </div>
    </div>
  );
};

export default Home;
