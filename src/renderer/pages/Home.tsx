import { useNavigate } from "react-router-dom";
import { ImCalculator } from "react-icons/im";
import {
  MdOutlineSupervisorAccount,
  MdOutlineSettings,
  MdLogout,
} from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { PiBankBold } from "react-icons/pi";
import { Text } from "@radix-ui/themes";
import { useUserContext } from "../contexts/UserContext";
import packageJson from "../../../package.json";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useUserContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="mt-20 flex flex-col items-center justify-center p-8">
      {/* Header Section */}
      <div className="relative mb-16 text-center">
        <div className="mb-6 flex items-center justify-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-400/20">
            <ImCalculator className="text-4xl text-blue-300" />
          </div>
          <Text className="text-6xl font-bold text-white">TAX CALCULATOR</Text>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 lg:grid-cols-3">
        {/* Calculate - Main Feature */}
        <div
          className="group row-span-2 flex cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl border border-blue-400/30 bg-blue-400/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-blue-400/30"
          onClick={() => navigate("/calculate")}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-400/30 transition-transform duration-300 group-hover:scale-110">
            <ImCalculator className="text-5xl text-blue-300" />
          </div>
          <Text className="text-3xl font-bold text-blue-300">CALCULATE</Text>
        </div>

        {/* Accounts */}
        <div
          className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-green-400/30 bg-green-400/20 p-6 transition-all duration-300 hover:scale-105 hover:bg-green-400/30"
          onClick={() => navigate("/accounts")}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/30 transition-transform duration-300 group-hover:scale-110">
            <MdOutlineSupervisorAccount className="text-2xl text-green-300" />
          </div>
          <Text className="text-xl font-bold text-green-300">ACCOUNTS</Text>
        </div>

        {/* History */}
        <div
          className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-400/20 p-6 transition-all duration-300 hover:scale-105 hover:bg-purple-400/30"
          onClick={() => navigate("/history")}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/30 transition-transform duration-300 group-hover:scale-110">
            <LuHistory className="text-2xl text-purple-300" />
          </div>
          <Text className="text-xl font-bold text-purple-300">HISTORY</Text>
        </div>

        {/* Banks */}
        <div
          className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-yellow-400/30 bg-yellow-400/20 p-6 transition-all duration-300 hover:scale-105 hover:bg-yellow-400/30"
          onClick={() => navigate("/banks")}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/30 transition-transform duration-300 group-hover:scale-110">
            <PiBankBold className="text-2xl text-yellow-300" />
          </div>
          <Text className="text-xl font-bold text-yellow-300">BANKS</Text>
        </div>

        {/* Settings */}
        <div
          className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-red-400/30 bg-red-400/20 p-6 transition-all duration-300 hover:scale-105 hover:bg-red-400/30"
          onClick={() => navigate("/settings")}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/30 transition-transform duration-300 group-hover:scale-110">
            <MdOutlineSettings className="text-2xl text-red-300" />
          </div>
          <Text className="text-xl font-bold text-red-300">SETTINGS</Text>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/20 px-4 py-2 font-medium text-red-300 transition-all duration-200 hover:scale-105 hover:bg-red-400/30"
        >
          <MdLogout className="text-lg" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-[5vh] text-center">
        <Text className="text-sm text-gray-400">
          Tax Calculation System v{packageJson.version}
        </Text>
      </div>
    </div>
  );
};

export default Home;
