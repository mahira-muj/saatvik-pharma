import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import {
  CPANEL_SQL_SCHEMA,
  CPANEL_CONFIG_PHP,
  CPANEL_API_PHP,
  CPANEL_HTACCESS,
  LARAVEL_ROUTES_PHP,
  LARAVEL_PRODUCT_CONTROLLER,
  LARAVEL_ORDER_CONTROLLER,
  LARAVEL_ENV_EXAMPLE,
  README_DEPLOYMENT_TXT
} from '../src/services/cpanelBundle.ts';

const rootDir = process.cwd();
const outputZipPath = path.join(rootDir, 'public', 'saatvikpharma_source_code.zip');

const zip = new JSZip();

// Ignore patterns
const ignoreDirs = new Set(['node_modules', '.git', 'dist', '.cache', 'scripts']);
const ignoreFiles = new Set(['bun.lock', 'package-lock.json', '.DS_Store', 'saatvikpharma_source_code.zip']);

function addDirectoryToZip(currentDir, zipFolder) {
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    if (ignoreDirs.has(item) || ignoreFiles.has(item)) continue;
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(item);
      addDirectoryToZip(fullPath, subFolder);
    } else {
      const data = fs.readFileSync(fullPath);
      zipFolder.file(item, data);
    }
  }
}

console.log('Packaging Saatvik Pharma project into ZIP...');
addDirectoryToZip(rootDir, zip);

// Also add a dedicated 'cpanel_and_laravel_backend' folder with standalone PHP, SQL & Laravel files
const cpanelFolder = zip.folder('cpanel_and_laravel_backend');
if (cpanelFolder) {
  cpanelFolder.file('saatvikpharma_schema.sql', CPANEL_SQL_SCHEMA);
  cpanelFolder.file('config.php', CPANEL_CONFIG_PHP);
  cpanelFolder.file('api.php', CPANEL_API_PHP);
  cpanelFolder.file('.htaccess', CPANEL_HTACCESS);
  cpanelFolder.file('README_CPANEL_DEPLOYMENT.txt', README_DEPLOYMENT_TXT);

  const laravelSub = cpanelFolder.folder('laravel');
  if (laravelSub) {
    laravelSub.file('.env.example', LARAVEL_ENV_EXAMPLE);
    laravelSub.file('routes_api.php', LARAVEL_ROUTES_PHP);
    laravelSub.file('ProductController.php', LARAVEL_PRODUCT_CONTROLLER);
    laravelSub.file('OrderController.php', LARAVEL_ORDER_CONTROLLER);
  }
}

const content = await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 }
});

fs.writeFileSync(outputZipPath, content);
const sizeMb = (content.length / (1024 * 1024)).toFixed(2);
console.log(`Successfully created ZIP: ${outputZipPath} (${sizeMb} MB)`);
