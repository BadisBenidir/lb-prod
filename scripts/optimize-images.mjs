import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const OUTPUT_DIR = join(PUBLIC_DIR, 'optimized');

// Configuration
const MAX_WIDTH = 1920;
const QUALITY = 80;

// Extensions à optimiser
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function ensureOutputDir() {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

async function getImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Ignorer le dossier optimized et Photos Site pour éviter la récursion
      if (entry.name !== 'optimized' && entry.name !== 'Photos Site') {
        const subFiles = await getImageFiles(fullPath);
        files.push(...subFiles);
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (IMAGE_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function optimizeImage(inputPath) {
  const fileName = basename(inputPath, extname(inputPath));
  const outputPath = join(OUTPUT_DIR, `${fileName}.webp`);

  try {
    const stats = await stat(inputPath);
    const originalSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n📸 Optimisation: ${basename(inputPath)}`);
    console.log(`   Taille originale: ${originalSizeKB} KB`);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Redimensionner si nécessaire
    let processedImage = image;
    if (metadata.width > MAX_WIDTH) {
      console.log(`   Redimensionnement: ${metadata.width}px → ${MAX_WIDTH}px`);
      processedImage = processedImage.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convertir en WebP
    await processedImage
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const outputStats = await stat(outputPath);
    const optimizedSizeKB = (outputStats.size / 1024).toFixed(2);
    const reduction = ((1 - outputStats.size / stats.size) * 100).toFixed(1);

    console.log(`   Taille optimisée: ${optimizedSizeKB} KB`);
    console.log(`   ✅ Réduction: ${reduction}%`);

    return {
      original: inputPath,
      optimized: outputPath,
      originalSize: stats.size,
      optimizedSize: outputStats.size,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Démarrage de l\'optimisation des images...\n');
  console.log(`📁 Dossier source: ${PUBLIC_DIR}`);
  console.log(`📁 Dossier de sortie: ${OUTPUT_DIR}\n`);
  console.log('━'.repeat(60));

  await ensureOutputDir();

  const imageFiles = await getImageFiles(PUBLIC_DIR);
  console.log(`\n🔍 ${imageFiles.length} image(s) trouvée(s)\n`);

  const results = [];
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (result) {
      results.push(result);
    }
  }

  // Résumé
  console.log('\n' + '━'.repeat(60));
  console.log('\n📊 RÉSUMÉ DE L\'OPTIMISATION\n');

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);

  console.log(`✅ ${results.length} image(s) optimisée(s)`);
  console.log(`📦 Taille totale originale: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Taille totale optimisée: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🎉 Réduction totale: ${totalReduction}%`);
  console.log(`\n💡 Les images optimisées sont dans: ${OUTPUT_DIR}`);
  console.log(`💡 Remplacez les anciennes images par les nouvelles et mettez à jour les extensions .jpg → .webp dans le code\n`);
}

main().catch(console.error);
