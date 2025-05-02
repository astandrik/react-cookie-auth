#!/usr/bin/env node

// This script helps ensure TypeScript declarations are properly structured
// It runs after the main build process

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Just to make sure our index.d.ts file exists in case it wasn't copied
try {
  // Check if dist/index.d.ts exists, create a symlink to our root index.d.ts if needed
  if (!fs.existsSync('dist/index.d.ts')) {
    console.log('Creating dist/index.d.ts file');
    
    // Read the content of our root index.d.ts
    const content = fs.readFileSync('index.d.ts', 'utf8');
    
    // Update paths to be relative within dist
    const updatedContent = content.replace(/\.\/dist\/src\//g, './src/');
    
    // Write the updated content to dist/index.d.ts
    fs.writeFileSync('dist/index.d.ts', updatedContent);
  }
  
  console.log('TypeScript declarations setup completed successfully');
} catch (error) {
  console.error('Error setting up TypeScript declarations:', error);
  process.exit(1);
}