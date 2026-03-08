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

  // Find all <button> tags that DO NOT end with a slash, and capture their attributes
  // regex looks for <button followed by anything that isn't a closing bracket
  newContent = newContent.replace(/<button\s([^>]*)(>)/gi, (match, attrStr, closingBracket) => {
    if (attrStr.includes('onClick')) return match;
    return `<button onClick={() => alert('Demo Mode: Feature coming soon!')} ${attrStr}${closingBracket}`;
  });

  // some buttons might just be <button> without attrs
  newContent = newContent.replace(/<button>/gi, () => {
    return `<button onClick={() => alert('Demo Mode: Feature coming soon!')}>`;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Added generic onClick to', file);
  }
}
