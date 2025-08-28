import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { AiFillHome } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";
import { useUserContext } from '../contexts/UserContext';

interface NavigationProps {
  title: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

const Navigation = ({ title, showBackButton = true, showHomeButton = true }: NavigationProps) => {
  const navigate = useNavigate();
  const { logout } = useUserContext();

  const handleLogout = () => {
    logout();
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="text-white transition-colors hover:text-gray-300"
          >
            <IoIosArrowBack size={36} />
          </button>
        )}
        <h1 className="text-4xl font-bold uppercase text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {showHomeButton && (
          <button
            onClick={() => navigate('/home')}
            className="ml-auto text-white transition-colors hover:text-gray-300"
            title="Go to Home"
          >
            <AiFillHome size={28} />
          </button>
        )}
        <button
          onClick={handleLogout}
          className="ml-auto text-white transition-colors hover:text-gray-300"
          title="Logout"
        >
          <LuLogOut size={28} />
        </button>
      </div>
    </div>
  );
};

export default Navigation;
