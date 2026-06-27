const fs = require('fs');

function addRedirect(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Check if redirect already exists
    if (content.includes('window.location.protocol ===')) {
        return;
    }
    
    const redirectScript = `
<script>
  if (window.location.protocol === 'file:') {
    window.location.href = 'http://localhost:3000/' + '${filename}';
  }
</script>
`;
    
    // Insert after <head>
    content = content.replace('<head>', '<head>' + redirectScript);
    fs.writeFileSync(filename, content);
    console.log('Added redirect to ' + filename);
}

addRedirect(require('path').join(__dirname, '../public/index.html'));
addRedirect(require('path').join(__dirname, '../public/admin.html'));
