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

function processHTML(html, componentName) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';
  let bodyContent = bodyMatch[1];
  
  bodyContent = bodyContent.replace(/class=/g, 'className=');
  bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
  bodyContent = bodyContent.replace(/tabindex=/g, 'tabIndex=');
  bodyContent = bodyContent.replace(/onclick=/g, 'onClick=');
  bodyContent = bodyContent.replace(/stroke-width=/g, 'strokeWidth=');
  bodyContent = bodyContent.replace(/stroke-linecap=/g, 'strokeLinecap=');
  bodyContent = bodyContent.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  bodyContent = bodyContent.replace(/fill-rule=/g, 'fillRule=');
  bodyContent = bodyContent.replace(/clip-rule=/g, 'clipRule=');
  bodyContent = bodyContent.replace(/viewbox=/gi, 'viewBox=');

  bodyContent = bodyContent.replace(/<(img|input|br|hr|link|meta)\b([^>]*?)(?<!\/)>/g, '<$1$2 />');
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '');
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(';').filter(r => r.trim());
    if (rules.length === 0) return 'style={{}}';
    const mapped = rules.map(rule => {
      let [k, v] = rule.split(':');
      if (!k || !v) return '';
      k = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      v = v.trim().replace(/'/g, "\\'");
      return `${k}: '${v}'`;
    }).filter(Boolean).join(', ');
    return `style={{${mapped}}}`;
  });

  // Basic Routing Logic
  const routeMap = [
    { text: 'Login', to: '/login_page' },
    { text: 'Register', to: '/register_page' },
    { text: 'Students', to: '/student_management_admin' },
    { text: 'Companies', to: '/company_management_admin' },
    { text: 'Internships', to: '/internship_management_admin' },
    { text: 'Applications', to: '/application_tracking_admin' },
    { text: 'Analytics', to: '/admin_analytics_dashboard' },
    { text: 'Discover', to: '/internship_discovery_page' },
    { text: 'My Applications', to: '/my_applications_web' },
    { text: 'Interviews', to: '/interview_schedule_web' },
    { text: 'Profile', to: '/student_profile_page' },
    { text: 'Sign In', to: '/student_dashboard' },
    { text: 'Sign in', to: '/login_page' },
    { text: 'Access Dashboard', to: '/admin_dashboard' },
    { text: 'Request access', to: '/register_page' },
    { text: 'Apply Now', to: '/apply_for_internship_web' },
    { text: 'Details', to: '/internship_details_page' },
    { text: 'Get Started', to: '/register_page' },
    { text: 'Sign Up', to: '/register_page' },
    { text: 'Logout', to: '/login_page' },
    { text: 'Sign Out', to: '/login_page' },
    { text: 'Manage', to: '/admin_dashboard' }
  ];

  // Specific handling for Dashboard word based on role
  const isStudentPage = componentName.toLowerCase().includes('student') || componentName.toLowerCase().includes('discovery') || componentName.toLowerCase().includes('my_applications') || componentName.toLowerCase().includes('apply');
  const dashboardRoute = isStudentPage ? '/student_dashboard' : '/admin_dashboard';

  bodyContent = bodyContent.replace(/<button\b([^>]*)>([\s\S]*?)<\/button>/g, (match, attrs, content) => {
    let replacedAttr = attrs;
    let targetRoute = null;
    
    if (content.includes('Dashboard')) {
      targetRoute = dashboardRoute;
    } else {
      for (const r of routeMap) {
        if (content.includes(r.text)) {
          targetRoute = r.to;
          break;
        }
      }
    }
    
    if (targetRoute && !attrs.includes('onClick=')) {
        if(attrs.includes('type="submit"')) {
            replacedAttr = replacedAttr.replace(/type="submit"/, 'type="button"');
        }
        return `<button${replacedAttr} onClick={(e) => { e.preventDefault(); navigate('${targetRoute}'); }}>${content}</button>`;
    }
    return match;
  });

  bodyContent = bodyContent.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (match, attrs, content) => {
    let targetRoute = null;
    if (content.includes('Dashboard')) {
      targetRoute = dashboardRoute;
    } else {
      for (const r of routeMap) {
        if (content.includes(r.text)) {
          targetRoute = r.to;
          break;
        }
      }
    }
    
    if (targetRoute) {
      let newAttrs = attrs;
      if (newAttrs.includes('href=')) {
        newAttrs = newAttrs.replace(/href="[^"]*"/, `to="${targetRoute}"`).replace(/href='[^']*'/, `to="${targetRoute}"`);
      } else {
        newAttrs = `${newAttrs} to="${targetRoute}"`;
      }
      return `<Link${newAttrs}>${content}</Link>`;
    }
    
    // Default replace href="#" with to="#" to prevent full reloads
    let newAttrs = attrs;
    if (newAttrs.includes('href=')) {
      newAttrs = newAttrs.replace(/href="[^"]*"/, `to="#"`).replace(/href='[^']*'/, `to="#"`);
      return `<Link${newAttrs}>${content}</Link>`;
    }
    return match;
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
      const jsxContent = processHTML(html, componentName);
      
      const fileContent = `
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ${componentName}() {
  const navigate = useNavigate();
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
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
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
console.log('Done reconnecting components and regenerating App.jsx');
