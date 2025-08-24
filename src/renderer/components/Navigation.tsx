import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

interface NavigationProps {
  title: string;
  showBackButton?: boolean;
}

const Navigation = ({ title, showBackButton = true }: NavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex items-center gap-4">
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
  );
};

export default Navigation;
