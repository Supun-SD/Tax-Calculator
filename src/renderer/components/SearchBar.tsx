import { FiSearch } from 'react-icons/fi';
import React from 'react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...inputProps
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 text-lg" />
      </div>
      <input
        type="text"
        className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 pl-10 pr-4"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
    </div>
  );
};

export default SearchBar;
