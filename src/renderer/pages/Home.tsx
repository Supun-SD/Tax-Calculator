import { useNavigate } from 'react-router-dom';
import { ImCalculator } from 'react-icons/im';
import { MdOutlineSupervisorAccount, MdOutlineSettings } from 'react-icons/md';
import { LuHistory } from 'react-icons/lu';
import { PiBankBold } from 'react-icons/pi';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex flex-col items-center justify-center p-12">
      <div className="mb-20 text-6xl font-bold text-white">TAX CALCULATOR</div>
      <div className="grid w-full max-w-xl grid-cols-2 grid-rows-3 gap-4">
        <div
          className="row-span-2 flex cursor-pointer flex-col items-center justify-center gap-6 rounded-3xl bg-gray-200 p-6 transition-colors hover:bg-gray-300"
          onClick={() => navigate('/calculate')}
        >
          <ImCalculator size={40} />
          <div className="text-2xl font-extrabold">CALCULATE</div>
        </div>

        <div
          className="flex cursor-pointer gap-4 rounded-3xl bg-gray-200 p-8 px-12 transition-colors hover:bg-gray-300"
          onClick={() => navigate('/accounts')}
        >
          <MdOutlineSupervisorAccount size={30} />
          <div className="text-2xl font-extrabold">ACCOUNTS</div>
        </div>

        <div
          className="flex cursor-pointer items-center gap-4 rounded-3xl bg-gray-200 p-8 px-12 transition-colors hover:bg-gray-300"
          onClick={() => navigate('/history')}
        >
          <LuHistory size={30} />
          <div className="text-2xl font-extrabold">HISTORY</div>
        </div>

        <div
          className="flex cursor-pointer items-center gap-4 rounded-3xl bg-gray-200 p-8 px-12 transition-colors hover:bg-gray-300"
          onClick={() => navigate('/banks')}
        >
          <PiBankBold size={30} />
          <div className="text-2xl font-extrabold">BANKS</div>
        </div>

        <div
          className="flex cursor-pointer items-center gap-4 rounded-3xl bg-gray-200 p-8 px-12 transition-colors hover:bg-gray-300"
          onClick={() => navigate('/settings')}
        >
          <MdOutlineSettings size={30} />
          <div className="text-2xl font-extrabold">SETTINGS</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
