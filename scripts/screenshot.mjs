// Screenshots a route at the mockup widths, in light and dark, to compare
// with design/screens/images/ (same 2× scale). Needs `npm run dev` running.
//
//   npm run screens -- /app
//   npm run screens -- /app/progres --widths 390 --themes dark
//
// Files land in .screenshots/<route>-<width>-<theme>.png (not committed).

import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const HEIGHTS = { 390: 844, 768: 1024, 1440: 900 };

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const positional = args.filter((arg, i) => !arg.startsWith("--") && !args[i - 1]?.startsWith("--"));

const route = `/${(positional[0] ?? "/").replace(/^\/+/, "")}`;
const widths = option("widths", "390,768,1440").split(",").map(Number);
const themes = option("themes", "light,dark").split(",");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const slug = route === "/" ? "accueil-public" : route.slice(1).replace(/[^a-z0-9]+/gi, "-");

await mkdir(".screenshots", { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of themes) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: HEIGHTS[width] ?? 900 },
        deviceScaleFactor: 2,
        reducedMotion: "reduce",
      });
      await context.addCookies([{ name: "qrious-theme", value: theme, url: baseUrl }]);
      const page = await context.newPage();
      await page.goto(baseUrl + route, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const file = `.screenshots/${slug}-${width}-${theme}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
      await context.close();
    }
  }
} catch (error) {
  console.error(`Could not screenshot ${baseUrl}${route}. Is \`npm run dev\` running?`);
  throw error;
} finally {
  await browser.close();
}
