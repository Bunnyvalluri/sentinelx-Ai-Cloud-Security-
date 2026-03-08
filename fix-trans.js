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

const files = walkSync('./src').filter(f => f.endsWith('.jsx') || f.endsWith('.css'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace transition styles that animate all properties (which causes performance issues)
  // E.g., transition: 'all 0.3s' -> transition: 'background-color 0.3s, border-color 0.3s, color 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s, box-shadow 0.3s, transform 0.3s'
  newContent = newContent.replace(/transition:\s*(['"`])all\s+(.*?)(['"`])/g, "transition: $1background-color $2, border-color $2, color $2, fill $2, stroke $2, opacity $2, box-shadow $2, transform $2$3");

  // And just string 'all' alone
  newContent = newContent.replace(/transition:\s*(['"`])all(['"`])/g, "transition: $1background-color, border-color, color, fill, stroke, opacity, box-shadow, transform$2");

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed transition in', file);
  }
}
