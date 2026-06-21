const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const executablePath = '/opt/browsers/chromium-1223/chrome-linux64/chrome';

async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const tempDir = '/home/agent-asset-fixer/raw-screenshots';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const sizes = [
    { name: 'iphone_6_5', width: 1242, height: 2688, label: 'iPhone 6.5"' },
    { name: 'iphone_5_5', width: 1242, height: 2208, label: 'iPhone 5.5"' },
    { name: 'android_play', width: 1080, height: 2280, label: 'Android' }
  ];

  for (const size of sizes) {
    console.log(`\n--- Capture for ${size.label} (${size.width}x${size.height}) ---`);
    
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    });

    const page = await context.newPage();
    
    console.log("Opening landing page to set authorization keys...");
    await page.goto('http://localhost:3000/?preview=true&pwa=true');
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => {
      localStorage.setItem('activeEmpireId', '1');
      localStorage.setItem('empire_userId', '00000000-0000-0000-0000-000000000000');
      localStorage.setItem('isPaid', 'true');
      localStorage.setItem('isProtocolAccepted', 'true');
      localStorage.setItem('onboardedByEmpire', '{"1":true}');
      localStorage.setItem('linkingCompleteByEmpire', '{"1":true}');
      localStorage.setItem('slotStatus', '{"0":true,"1":true,"2":true}');
    });

    console.log("Reloading homepage to apply local storage...");
    await page.reload();
    await page.waitForTimeout(3000);

    // Link Center
    console.log("Navigating to Link Center...");
    await page.goto('http://localhost:3000/link-center?preview=true');
    console.log("Waiting 10 seconds for initializations and animations to settle...");
    await page.waitForTimeout(10000); // 10 seconds wait to guarantee full initialization bypasses timeout and renders real content!
    const linkPath = path.join(tempDir, `${size.name}_link_raw.png`);
    await page.screenshot({ path: linkPath });
    console.log(`Saved Link Center raw screenshot: ${linkPath}`);

    // Analytics (Growth Hub)
    console.log("Navigating to Growth Hub / Analytics...");
    await page.goto('http://localhost:3000/analytics?preview=true');
    console.log("Waiting 10 seconds for charts and loaders to complete...");
    await page.waitForTimeout(10000);
    const analyticsPath = path.join(tempDir, `${size.name}_analytics_raw.png`);
    await page.screenshot({ path: analyticsPath });
    console.log(`Saved Analytics raw screenshot: ${analyticsPath}`);

    await context.close();
  }

  await browser.close();
  console.log("\nAll raw screenshots captured successfully!");
}

run().catch(err => {
  print("Error during screenshot capture:", err);
  process.exit(1);
});
