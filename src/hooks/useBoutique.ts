import { useState, useMemo } from 'react';
import { Product, FilterOptions, SortOption } from '../types';
import { useProducts, useAvailableCategories, useAvailableBrands } from './useProducts';
import { useAvailableFilters } from './useAvailableFilters';

const sortOptions: SortOption[] = [
  { value: 'name', label: 'Nom A-Z' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'brand', label: 'Marque A-Z' }
];

export const useBoutique = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: [0, 20000],
    conditions: [],
    colors: [],
    materials: [],
    genres: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Hooks pour récupérer les données de la DB (seulement produits disponibles)
  const { categories } = useAvailableCategories();
  const { brands } = useAvailableBrands();
  const { colors, materials, genres, conditions } = useAvailableFilters();
  
  // Calcul de l'offset pour la pagination
  const offset = (currentPage - 1) * itemsPerPage;
  
  // Hook principal pour récupérer les produits avec filtres
  const { products, loading, error, total } = useProducts({
    filters: {
      categories: filters.categories,
      brands: filters.brands,
      priceRange: filters.priceRange,
      conditions: filters.conditions,
      colors: filters.colors,
      materials: filters.materials,
      genres: filters.genres,
      searchTerm
    },
    sortBy,
    limit: itemsPerPage,
    offset
  });

  // Données disponibles pour les filtres (déjà filtrées par les hooks)
  const availableCategories = categories;
  const availableBrands = brands;
  const availableColors = colors;
  const availableMaterials = materials;
  const availableGenres = genres;
  const availableConditions = conditions;

  // Pagination calculée côté serveur
  const totalPages = Math.ceil(total / itemsPerPage);

  // Reset to first page when filters change
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 20000],
      conditions: [],
      colors: [],
      materials: [],
      genres: []
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return {
    filters,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage,
    totalPages,
    sortOptions,
    availableCategories,
    availableBrands,
    availableConditions,
    availableColors,
    availableMaterials,
    availableGenres,
    filteredProducts: products, // Les produits viennent déjà filtrés et paginés
    totalResults: total,
    updateFilter,
    setSortBy: handleSortChange,
    setViewMode,
    setCurrentPage,
    setItemsPerPage,
    clearFilters,
    resultsCount: total,
    searchTerm,
    setSearchTerm: handleSearchChange,
    loading,
    error
  };
};