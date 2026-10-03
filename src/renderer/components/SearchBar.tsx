import { FiSearch } from "react-icons/fi";
import React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  ...inputProps
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FiSearch className="text-lg text-gray-400" />
      </div>
      <input
        type="text"
        className="h-12 w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 text-white placeholder-gray-300 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
    </div>
  );
};

export default SearchBar;
