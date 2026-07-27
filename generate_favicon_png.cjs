const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generateFavicons() {
  console.log('🎨 Generating PNG Favicons for Google Search...');
  
  const svgPath = path.join(__dirname, 'public', 'favicon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Generate 192x192 PNG
  await page.setViewport({ width: 192, height: 192 });
  const png192Buffer = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync(path.join(__dirname, 'public', 'favicon-192x192.png'), png192Buffer);
  console.log('✅ Generated public/favicon-192x192.png');

  // Generate 180x180 Apple Touch Icon
  await page.setViewport({ width: 180, height: 180 });
  const png180Buffer = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync(path.join(__dirname, 'public', 'apple-touch-icon.png'), png180Buffer);
  console.log('✅ Generated public/apple-touch-icon.png');

  // Generate 48x48 PNG (Google Search standard)
  await page.setViewport({ width: 48, height: 48 });
  const png48Buffer = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync(path.join(__dirname, 'public', 'favicon-48x48.png'), png48Buffer);
  fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), png48Buffer); // ICO fallback
  console.log('✅ Generated public/favicon-48x48.png and public/favicon.ico');

  await browser.close();
  console.log('🎉 Favicon generation completed!');
}

generateFavicons().catch(console.error);
