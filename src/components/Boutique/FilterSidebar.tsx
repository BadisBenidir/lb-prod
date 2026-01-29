import React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions } from '../../types';
import { translateCategory } from '../../utils/translations';

interface FilterSidebarProps {
  filters: FilterOptions;
  availableCategories: string[];
  brandsList: string[];
  availableGenres: string[];
  availableConditions: string[];
  availableColors: string[];
  availableMaterials: string[];
  onUpdateFilter: (key: keyof FilterOptions, value: any) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CONDITION_ORDER = [
  'New',
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  availableCategories,
  brandsList,
  availableGenres,
  availableConditions,
  availableColors,
  availableMaterials,
  onUpdateFilter,
  onClearFilters,
  isOpen,
  onClose
}) => {

  const safeBrandsList: string[] = Array.isArray(brandsList) ? brandsList : [];

  const CONDITION_ORDER = [
    'new',
    'excellent',
    'very-good',
    'good',
    'fair',
  ];

  const preferredCategoryOrder = ["Sacs", "Chaussures", "Accessoires", "Vetements", "Pochettes"];

  const sortedCategories = [...availableCategories].sort((a, b) => {
    const ia = preferredCategoryOrder.indexOf(a);
    const ib = preferredCategoryOrder.indexOf(b);

    if (ia === -1 && ib === -1) return a.localeCompare(b, "fr");
    if (ia === -1) return 1;
    if (ib === -1) return -1;

    return ia - ib;
  });

  const normalizeCondition = (c: string) =>
  (c || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace('tres-bon', 'very-good');

  const sortedConditions = [...availableConditions].sort((a, b) => {
    const ia = CONDITION_ORDER.indexOf(a);
    const ib = CONDITION_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const [expandedSections, setExpandedSections] = React.useState({
    categories: true,
    brands: true,
    condition: true,
    price: true,
    genres: false,
    colors: false,
    materials: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onUpdateFilter('categories', newCategories);
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onUpdateFilter('brands', newBrands);
  };

  const handleConditionChange = (condition: string) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter(c => c !== condition)
      : [...filters.conditions, condition];
    onUpdateFilter('conditions', newConditions);
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onUpdateFilter('colors', newColors);
  };

  const handleMaterialChange = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter(m => m !== material)
      : [...filters.materials, material];
    onUpdateFilter('materials', newMaterials);
  };

  const handleGenreChange = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    onUpdateFilter('genres', newGenres);
  };

  // Fonction pour traduire les genres
  const translateGenre = (genre: string) => {
    const translations: Record<string, string> = {
      'femme': 'Femme',
      'homme': 'Homme',
      'fille': 'Fille',
      'garcon': 'Garçon'
    };
    return translations[genre] || genre;
  };

  // Fonction pour traduire les conditions
  const translateCondition = (condition: string) => {
    const translations: Record<string, string> = {
      'new': 'Neuf',
      'neuf': 'Neuf',
      'excellent': 'Excellent',
      'very-good': 'Très Bon', 
      'good': 'Bon',
      'fair': 'Correct'
    };
    return translations[condition] || condition;
  };

  const featuredBrands = [
    'Louis Vuitton',
    'Saint Laurent',
    'Chanel',
    'Hermès',
    'Gucci',
    'Dior',
  ];

  const normalize = (s: string) =>
    s.normalize("NFC").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const featuredSet = new Set(featuredBrands.map(normalize));

  const mainBrands = safeBrandsList.filter((brand) => 
    featuredBrands.includes(brand)
  );
  const otherBrands = safeBrandsList.filter((brand) => 
    !featuredBrands.includes(brand)
  );

  console.log("brandsList", brandsList);
  console.log("safeBrandsList lenght", safeBrandsList.length);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[45] lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed lg:relative top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-full w-80 bg-white border-r border-gray-200 z-[50] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold">Filtres</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-600 hover:text-black"
              >
                Effacer
              </button>
              <button onClick={onClose} className="lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
            >
              Catégories
              {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.categories && (
              <div className="space-y-2">
                {sortedCategories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2"
                    />
                    <span className="text-sm">{translateCategory(category)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => toggleSection('brands')}
              className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
            >
            Marques
            {expandedSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.brands && (
              <div className="space-y-2 max-h-50 md:max-h-60 overflow-y-auto">
                <div className='space-y-2'>
                  {mainBrands.map((brand: string) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>

                <hr className="my-4 border-gray-0" />

                <div className='space-y-2 mt-16'>
                  {otherBrands.map((brand: string) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Condition */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => toggleSection('condition')}
              className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
            >
              État
              {expandedSections.condition ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.condition && (
              <div className="space-y-2">
                {CONDITION_ORDER.map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.conditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="mr-2"
                    />
                    <span className="text-sm">{translateCondition(condition)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
            >
              Prix
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.price && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => onUpdateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="w-full px-2 py-1 border border-gray-300 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => onUpdateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="w-full px-2 py-1 border border-gray-300 text-sm"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => onUpdateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            )}
          </div>

                    {/* Genres */}
          {availableGenres.length > 0 && (
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => toggleSection('genres')}
                className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
              >
                Genre
                {expandedSections.genres ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.genres && (
                <div className="space-y-2">
                  {availableGenres.map(genre => (
                    <label key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        className="mr-2"
                      />
                      <span className="text-sm">{translateGenre(genre)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Colors */}
          {availableColors.length > 0 && (
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => toggleSection('colors')}
                className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
              >
                Couleurs
                {expandedSections.colors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.colors && (
                <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
                  {availableColors.map(color => (
                    <label key={color} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(color)}
                        onChange={() => handleColorChange(color)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{color}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Materials */}
          {availableMaterials.length > 0 && (
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => toggleSection('materials')}
                className="flex items-center justify-between w-full mb-2 md:mb-3 font-medium text-sm md:text-base"
              >
                Matières
                {expandedSections.materials ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.materials && (
                <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
                  {availableMaterials.map(material => (
                    <label key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(material)}
                        onChange={() => handleMaterialChange(material)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{material}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;