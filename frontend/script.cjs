const fs = require('fs');
const path = require('path');

const STITCH_DIR = 'C:\\\\Users\\\\Hp\\\\Desktop\\\\InternHub\\\\stitch';
const PAGES_DIR = 'C:\\\\Users\\\\Hp\\\\Desktop\\\\InternHub\\\\frontend\\\\src\\\\pages';

if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

function toJSName(str) {
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function processHTML(html) {
  // Extract body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';
  let bodyContent = bodyMatch[1];
  
  // HTML to JSX replacements
  bodyContent = bodyContent.replace(/class=/g, 'className=');
  bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
  bodyContent = bodyContent.replace(/tabindex=/g, 'tabIndex=');
  bodyContent = bodyContent.replace(/onclick=/g, 'onClick=');
  bodyContent = bodyContent.replace(/stroke-width=/g, 'strokeWidth=');
  bodyContent = bodyContent.replace(/stroke-linecap=/g, 'strokeLinecap=');
  bodyContent = bodyContent.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  bodyContent = bodyContent.replace(/fill-rule=/g, 'fillRule=');
  bodyContent = bodyContent.replace(/clip-rule=/g, 'clipRule=');
  
  // Fix SVGs
  bodyContent = bodyContent.replace(/viewbox=/gi, 'viewBox=');

  // Close self-closing tags
  bodyContent = bodyContent.replace(/<(img|input|br|hr|link|meta)\b([^>]*?)(?<!\/)>/g, '<$1$2 />');

  // Remove comments
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '');

  // Remove scripts
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Escape { and } if they are naked text? Usually not an issue unless there are CSS styles inline or JS templates inside HTML.
  // We'll replace style="background-image: url('...');" 
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
    // Basic converson of style="color: red; padding: 10px"
    const rules = p1.split(';').filter(r => r.trim());
    if (rules.length === 0) return 'style={{}}';
    
    // Simplistic style convertor: just return empty style to avoid JSX crash, wait, some UI might be broken
    // Best effort mapping: 
    const mapped = rules.map(rule => {
      let [k, v] = rule.split(':');
      if (!k || !v) return '';
      k = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      v = v.trim().replace(/'/g, "\\'");
      return `${k}: '${v}'`;
    }).filter(Boolean).join(', ');
    return `style={{${mapped}}}`;
  });

  return bodyContent;
}

const dirs = fs.readdirSync(STITCH_DIR, { withFileTypes: true });

let imports = [];
let routes = [];

for (const dir of dirs) {
  if (dir.isDirectory()) {
    const dirName = dir.name;
    const componentName = toJSName(dirName);
    const htmlPath = path.join(STITCH_DIR, dirName, 'code.html');
    
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath, 'utf8');
      const jsxContent = processHTML(html);
      
      const fileContent = `
import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
      fs.writeFileSync(path.join(PAGES_DIR, `${componentName}.jsx`), fileContent.trim() + '\n');
      
      imports.push(`import ${componentName} from './pages/${componentName}';`);
      const routePath = dirName === 'landing_page' ? '/' : `/${dirName}`;
      routes.push(`        <Route path="${routePath}" element={<${componentName} />} />`);
    }
  }
}

// Generate App.jsx
const appContent = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
${imports.join('\n')}

function App() {
  return (
    <Router>
      <Routes>
${routes.join('\n')}
      </Routes>
    </Router>
  );
}

export default App;
`;

fs.writeFileSync('C:\\Users\\Hp\\Desktop\\InternHub\\frontend\\src\\App.jsx', appContent.trim() + '\n');
console.log('Done generating components and App.jsx');
