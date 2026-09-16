const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    if (file.includes('node_modules') || file.includes('.next') || file.includes('.git')) return;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:/Coastlane Motors/coastlane');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace font-display and font-body
  content = content.replace(/\bfont-display\b/g, 'font-sans');
  content = content.replace(/\bfont-body\b/g, 'font-sans');
  
  // Specifically for Hero Search "FIND YOUR CAR" (USED & NEW)
  if (file.endsWith('hero-search.tsx')) {
    content = content.replace('font-sans font-bold', 'font-extrabold');
  }

  // Specifically for CategoryRail category names
  if (file.endsWith('category-rail.tsx')) {
    content = content.replace('font-sans font-bold text-ink', 'font-semibold text-ink');
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
