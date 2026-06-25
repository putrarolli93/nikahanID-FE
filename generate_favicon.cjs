const fs = require('fs');

let shadowText = '';
for(let i=1; i<=70; i++) {
  shadowText += `<text x="50" y="72" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="65" text-anchor="middle" fill="rgba(0,0,0,0.15)" transform="translate(${i}, ${i})">D</text>\n`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <clipPath id="roundedClip">
      <rect width="100" height="100" rx="25" ry="25"/>
    </clipPath>
  </defs>
  <rect width="100" height="100" rx="25" ry="25" fill="#b5652a"/>
  
  <g clip-path="url(#roundedClip)">
    ${shadowText}
    <text x="50" y="72" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="65" text-anchor="middle" fill="#ffffff">D</text>
  </g>
</svg>`;

fs.writeFileSync('/Users/putrarolli/nikahanID-FE/public/favicon.svg', svg);
console.log('Favicon generated!');
