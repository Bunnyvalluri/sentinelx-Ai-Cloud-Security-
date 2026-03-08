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

const stringToRemove = " onClick={(e) => { e.preventDefault(); alert('Demo Action triggered! This is a UI mockup preview.'); }}";

const files = walkSync('./src').filter(f => f.endsWith('.jsx'));
let fixedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(stringToRemove)) {
    content = content.split(stringToRemove).join('');
    fs.writeFileSync(file, content);
    console.log('Reverted in', file);
    fixedFiles++;
  }
}
console.log('Fixed', fixedFiles, 'files.');
