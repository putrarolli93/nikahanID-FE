const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  
  await page.goto('http://localhost:5173/template/javanese-heritage/preview', { waitUntil: 'networkidle2' });
  
  // Wait for the button and click it to open
  await page.waitForSelector('.javanese-btn');
  await page.click('.javanese-btn');
  
  // Wait for slide up animation
  await new Promise(r => setTimeout(r, 1500));
  
  // Scroll down one viewport height to see Mempelai section
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
  await new Promise(r => setTimeout(r, 1500));
  
  await page.screenshot({ path: '/Users/putrarolli/.gemini/antigravity-ide/brain/111ad2ad-0c64-4567-b1f2-1885c293aaa1/screenshot.png' });
  await browser.close();
})();
