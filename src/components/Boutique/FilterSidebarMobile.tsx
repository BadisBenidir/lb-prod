import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, Trash2, Eye } from 'lucide-react';
import { FilterState } from '../../hooks/useBoutique';

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  conditions: string[];
  colors: string[];
  materials: string[];
  genres: string[];
}

interface FilterSidebarMobileProps {
  filters: FilterState;
  availableCategories: string[];
  availableBrands: string[];
  availableConditions: string[];
  availableColors: string[];
  availableMaterials: string[];
  availableGenres: string[];
  onUpdateFilter: (key: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebarMobile: React.FC<FilterSidebarMobileProps> = ({
  filters,
  availableCategories,
  availableBrands,
  availableConditions,
  availableColors,
  availableMaterials,
  availableGenres,
  onUpdateFilter,
  onClearFilters,
  isOpen,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['categories', 'brands']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCheckboxChange = (filterKey: keyof FilterState, value: string) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onUpdateFilter(filterKey, newValues);
  };

  const renderCheckboxSection = (
    title: string,
    key: string,
    filterKey: keyof FilterState,
    items: string[]
  ) => {
    const isExpanded = expandedSections.has(key);
    const selectedItems = filters[filterKey] as string[];

    if (items.length === 0) return null;

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-900">{title}</span>
          <div className="flex items-center">
            {selectedItems.length > 0 && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-semibold mr-2">
                {selectedItems.length}
              </span>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3">
            {items.map((item) => (
              <label 
                key={item} 
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleCheckboxChange(filterKey, item)}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded-lg border-2 flex items-center justify-center mr-3 transition-all duration-200
                  ${selectedItems.includes(item) 
                    ? 'bg-black border-black' 
                    : 'border-gray-300 group-hover:border-black'
                  }
                `}>
                  {selectedItems.includes(item) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPriceSection = () => {
    const isExpanded = expandedSections.has('price');
    const [minPrice, maxPrice] = filters.priceRange;
    
    return (
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-900">Prix</span>
          <div className="flex items-center">
            {(minPrice > 0 || maxPrice < 20000) && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-semibold mr-2">
                •
              </span>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => onUpdateFilter('priceRange', [parseInt(e.target.value) || 0, maxPrice])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="text-gray-400">-</div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => onUpdateFilter('priceRange', [minPrice, parseInt(e.target.value) || 20000])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    placeholder="20000"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                €{minPrice} - €{maxPrice}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 pt-[164px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-white mr-2" />
            <h2 className="text-lg font-semibold">Filtres</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClearFilters}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title="Effacer tous les filtres"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {renderCheckboxSection('Catégories', 'categories', 'categories', availableCategories)}
          {renderCheckboxSection('Marques', 'brands', 'brands', availableBrands)}
          {renderCheckboxSection('Couleurs', 'colors', 'colors', availableColors)}
          {renderCheckboxSection('Matières', 'materials', 'materials', availableMaterials)}
          {renderCheckboxSection('Genre', 'genres', 'genres', availableGenres)}
          {renderPriceSection()}
          {renderCheckboxSection('État', 'conditions', 'conditions', availableConditions)}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <button
              onClick={onClearFilters}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Effacer
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white py-3 px-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebarMobile;