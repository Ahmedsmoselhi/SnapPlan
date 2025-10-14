import { Search } from "lucide-react";
import React from "react";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (
    value: "all" | "upcoming" | "ongoing" | "completed" | "cancelled"
  ) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      {/* Search Input */}
      <div className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg w-full md:w-1/3 shadow-sm">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search Events..."
          className="bg-transparent text-gray-800 placeholder-gray-500 outline-none w-full text-sm md:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as any)}
        className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg outline-none text-sm md:text-base shadow-sm"
      >
        <option value="all">All Statuses</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;
