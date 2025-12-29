import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const generateSitemap = async () => {
  const baseUrl = 'https://www.votredomaine.com'; // Remplacez par votre URL de production

  // --- Supabase Client Initialization ---
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing in your .env file');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // --- Fetching Products ---
  console.log('Fetching products from Supabase...');
  const { data: products, error } = await supabase.from('products').select('id');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products.`);

  // --- Defining Static Routes ---
  const staticRoutes = [
    '/',
    '/boutique',
    '/about',
    '/selection',
    '/sell',
    '/privacy',
    '/terms',
    '/legal',
    '/cookies'
    // Ajoutez d'autres routes statiques ici
  ];

  // --- Building the Sitemap XML ---
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

  // --- Writing the Sitemap File ---
  fs.writeFileSync('../public/sitemap.xml', sitemap);

  console.log('Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
