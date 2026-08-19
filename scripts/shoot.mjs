import puppeteer from "puppeteer-core";
import fs from "node:fs";

const OUT = process.argv[2] ?? "shots";
const URL = "http://localhost:3222";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "shell" === "never" ? false : true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-gpu-sandbox",
    "--no-sandbox",
    "--window-size=1440,900",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const errors = [];
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") {
    errors.push(`[console.${m.type()}] ${m.text()}`);
  }
});
page.on("requestfailed", (r) =>
  errors.push(`[requestfailed] ${r.url()} — ${r.failure()?.errorText}`)
);

await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

// confirm WebGL actually initialised
const gl = await page.evaluate(() => {
  const c = document.createElement("canvas");
  const ctx = c.getContext("webgl2") || c.getContext("webgl");
  if (!ctx) return "NO WEBGL CONTEXT";
  const dbg = ctx.getExtension("WEBGL_debug_renderer_info");
  return dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "webgl ok";
});
console.log("WebGL renderer:", gl);

const canvases = await page.evaluate(() =>
  [...document.querySelectorAll("canvas")].map((c) => ({
    w: c.width,
    h: c.height,
  }))
);
console.log("canvases on page:", JSON.stringify(canvases));

const height = await page.evaluate(() => document.body.scrollHeight);
console.log("document height:", height, "≈", (height / 900).toFixed(1), "screens");

// walk down the page, letting motion settle at each stop
const STOPS = 14;
for (let i = 0; i < STOPS; i++) {
  const target = Math.round((height - 900) * (i / (STOPS - 1)));
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), target);
  await new Promise((r) => setTimeout(r, 1100));
  await page.screenshot({
    path: `${OUT}/${String(i).padStart(2, "0")}.png`,
  });
}

console.log("\n--- console/page errors ---");
const unique = [...new Set(errors)];
console.log(unique.length ? unique.join("\n") : "none");

await browser.close();
