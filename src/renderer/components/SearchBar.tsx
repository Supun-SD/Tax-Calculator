import { FiSearch } from 'react-icons/fi';
import React from 'react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputTextColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name or TIN number',
  className = '',
  inputTextColor = 'white',
  ...inputProps
}) => {
  return (
    <label
      className={`flex w-full items-center rounded-full bg-surface-2 px-4 py-2 ${className}`}
    >
      <input
        type="text"
        className={`flex-grow bg-transparent px-3 py-1 text-${inputTextColor} placeholder-ph outline-none`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
      <FiSearch className="text-lg text-gray-400" />
    </label>
  );
};

export default SearchBar;
