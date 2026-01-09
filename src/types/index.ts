// Types de base de données
export interface DbCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DbBrand {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string;
  product_code: string;
  name: string;
  brand_id: string;
  category_id: string;
  genre: 'femme' | 'homme' | 'fille' | 'garcon';
  purchase_price?: number;
  sale_price: number;
  weight?: number;
  images: string[]; // JSONB transformé en array
  main_image_index: number;
  condition: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  description?: string;
  defects?: string;
  colors: string[]; // JSONB transformé en array
  material?: string;
  status: 'draft' | 'for-sale-online' | 'for-sale-other-platform' | 'sold-online' | 'sold-other-platform' | 'sold-display';
  serial_number?: string;
  internal_comments?: string;
  defect_images?: string[]; // URLs des photos de défauts
  created_at: string;
  updated_at: string;
}

// Type produit enrichi avec les données des relations
export interface DbProductWithRelations extends DbProduct {
  brand: DbBrand;
  category: DbCategory;
}

// Interface Product pour le client (compatible avec l'existant)
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'New';
  description: string;
  inStock: boolean;
  isSoldDisplay?: boolean; // Produit vendu mais affiché pour le marketing
  // Nouveaux champs disponibles
  productCode?: string;
  genre?: 'femme' | 'homme' | 'fille' | 'garcon';
  colors?: string[];
  material?: string;
  weight?: number;
  images?: string[];
  defects?: string;
  defectImages?: string[]; // Photos des défauts
  serialNumber?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isLoggedIn: boolean;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  conditions: string[];
  colors: string[];
  materials: string[];
  genres: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  company?: string;
}

export interface PaymentMethod {
  type: 'stripe' | 'card' | 'paypal' | 'bank';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  stripeSessionId?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}