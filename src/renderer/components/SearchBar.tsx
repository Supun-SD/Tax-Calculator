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
    placeholder = "Search by name or TIN number",
    className = "",
    ...inputProps
}) => {
    return (
        <label className={`flex items-center w-full bg-surface-2 rounded-full px-4 py-2 ${className}`}>
            <input
                type="text"
                className="bg-transparent outline-none text-white placeholder-ph flex-grow px-3 py-1"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...inputProps}
            />
            <FiSearch className="text-gray-400 text-lg" />
        </label>
    );
};

export default SearchBar;