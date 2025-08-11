import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

interface NavigationProps {
    title: string;
    showBackButton?: boolean;
}

const Navigation = ({ title, showBackButton = true }: NavigationProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-4 mb-8">
            {showBackButton && (
                <button
                    onClick={() => navigate('/')}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <IoIosArrowBack size={36} />
                </button>
            )}
            <h1 className="text-4xl font-bold text-white uppercase">{title}</h1>
        </div>
    );
};

export default Navigation;
