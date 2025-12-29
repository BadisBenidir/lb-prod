import React from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { SortOption } from '../../types';

interface BoutiqueHeaderProps {
  resultsCount: number;
  sortBy: string;
  sortOptions: SortOption[];
  viewMode: 'grid' | 'list';
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFilterToggle: () => void;
}

const BoutiqueHeader: React.FC<BoutiqueHeaderProps> = ({
  resultsCount,
  sortBy,
  sortOptions,
  viewMode,
  searchValue,
  onSearchChange,
  onSortChange,
  onViewModeChange,
  onFilterToggle
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Results Count */}
        <div>
          <h1 className="text-xl md:text-2xl font-light mb-2">Notre Boutique</h1>
          <p className="text-gray-600 text-sm md:text-base">{resultsCount} article{resultsCount !== 1 ? 's' : ''} trouvé{resultsCount !== 1 ? 's' : ''}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="relative order-1 sm:order-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black w-full sm:w-48 md:w-64 text-sm md:text-base"
            />
          </div>

          <div className="flex gap-3 md:gap-4 order-2 sm:order-none">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm md:text-base"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={onFilterToggle}
              className="sm:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-100 text-sm"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueHeader;