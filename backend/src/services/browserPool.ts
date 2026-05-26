import puppeteer, { Browser } from "puppeteer";

let browser: Browser | null = null;
let launchCount = 0;
const MAX_USES = 50;

export async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.connected || launchCount >= MAX_USES) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    browser = await puppeteer.launch({ headless: true });
    launchCount = 0;
  }
  launchCount++;
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close().catch(() => {});
    browser = null;
    launchCount = 0;
  }
}
