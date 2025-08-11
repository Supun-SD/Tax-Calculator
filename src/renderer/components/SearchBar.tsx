const SearchBar = () => {
    return (
        <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow bg-surface-2 h-full w-full p-4" placeholder="Search by name or TIN number" />
        </label>
    )
}

export default SearchBar;