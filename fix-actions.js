import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = walkSync(p, filelist);
    } else {
      filelist = filelist.concat(p);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.jsx'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Add a generic onClick to any <button> that doesn't already have one
  newContent = newContent.replace(/<button((?:(?!onClick=)[^>])+?)>/g, (match, p1) => {
    if (p1.trim().endsWith('/')) { // self closing button? rarely happens but just in case
      return match;
    }
    return `<button${p1} onClick={(e) => { e.preventDefault(); alert('Demo Action triggered! This is a UI mockup preview.'); }}>`;
  });

  // Also catch generic actionable div icons that don't have onClick
  // e.g., the social icons in Footer or the "Filter" tabs if they're divs.
  // Actually, standardizing just <button> covers 90% of user expectations.

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed buttons in', file);
  }
}
