import React, { useState } from "react";

interface SearchbarProps {
  onSearch: (query: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <label
      className="fixed top-0 left-0 right-0 z-10 mx-auto mt-5 w-2/3 md:w-[45rem] sm:w-[35rem] flex items-center justify-center border rounded-full shadow-2xl"
      htmlFor="search-bar"
    >
      <input
        id="search-bar"
        placeholder="Search or Input url"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-1.5 w-full h-10 text-black placeholder-gray-500 rounded-full bg-white"
      />
      <button
        className="ml-2 px-3 h-10 bg-black border-black text-white rounded-full transition-all duration-100 active:scale-95 disabled:opacity-70"
        onClick={() => onSearch(query)}
      >
        <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
          Search
        </span>
      </button>
    </label>
  );
};

export default Searchbar;
