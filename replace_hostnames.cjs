const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir('/Users/putrarolli/nikahanID-FE/src', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const target1 = 'http://${window.location.hostname}:5000';
    content = content.split(target1).join('');
    
    // Some lines might have exactly `http://${window.location.hostname}:5173...`
    const target2 = 'http://${window.location.hostname}:5173';
    content = content.split(target2).join('${window.location.origin}');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
