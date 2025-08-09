import { useNavigate } from 'react-router-dom';
import { ImCalculator } from "react-icons/im";
import { MdOutlineSupervisorAccount, MdOutlineSettings } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { PiBankBold } from "react-icons/pi";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center p-12 mt-10">
            <div className="text-6xl font-bold text-white mb-20">
                TAX CALCULATOR
            </div>
            <div className="grid grid-cols-2 grid-rows-3 gap-4 w-full max-w-xl">
                <div
                    className="row-span-2 bg-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors gap-6"
                    onClick={() => navigate('/calculate')}
                >
                    <ImCalculator size={40} />
                    <div className="font-extrabold text-2xl">CALCULATE</div>
                </div>

                <div
                    className="bg-gray-200 rounded-3xl p-8 px-12 flex cursor-pointer hover:bg-gray-300 transition-colors gap-4"
                    onClick={() => navigate('/accounts')}
                >
                    <MdOutlineSupervisorAccount size={30} />
                    <div className="font-extrabold text-2xl">ACCOUNTS</div>
                </div>

                <div
                    className="bg-gray-200 rounded-3xl p-8 px-12 flex items-center cursor-pointer hover:bg-gray-300 transition-colors gap-4"
                    onClick={() => navigate('/history')}
                >
                    <LuHistory size={30} />
                    <div className="font-extrabold text-2xl">HISTORY</div>
                </div>

                <div
                    className="bg-gray-200 rounded-3xl p-8 px-12 flex items-center cursor-pointer hover:bg-gray-300 transition-colors gap-4"
                    onClick={() => navigate('/banks')}
                >
                    <PiBankBold size={30} />
                    <div className="font-extrabold text-2xl">BANKS</div>
                </div>

                <div
                    className="bg-gray-200 rounded-3xl p-8 px-12 flex items-center cursor-pointer hover:bg-gray-300 transition-colors gap-4"
                    onClick={() => navigate('/settings')}
                >
                    <MdOutlineSettings size={30} />
                    <div className="font-extrabold text-2xl">SETTINGS</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
