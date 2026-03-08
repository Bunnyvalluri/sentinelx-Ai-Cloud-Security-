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
}

const files = walkSync('./src').filter(f => f.endsWith('.jsx') || f.endsWith('.css'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Network Traffic Chart blue -> hot pink/magenta
  newContent = newContent.replace(/#3b82f6/gi, '#f72585');
  // Cyan -> Golden/Yellow
  newContent = newContent.replace(/#06b6d4/gi, '#ffe066');
  // Light blue borders
  newContent = newContent.replace(/rgba\(59,\s*130,\s*246/gi, 'rgba(247, 37, 133');
  // Cyan borders
  newContent = newContent.replace(/rgba\(6,\s*182,\s*212/gi, 'rgba(255, 224, 102');

  newContent = newContent.replace(/💙/g, '💜');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed', file);
  }
}
console.log('Extra blues replaced!');
