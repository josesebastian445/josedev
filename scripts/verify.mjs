import puppeteer from "puppeteer-core";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3222";
const OUT = "preview";
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ["/", "home"],
  ["/work", "work"],
  ["/work/nomad-atlas", "case-study"],
  ["/services", "services"],
  ["/blog", "blog"],
  ["/blog/unlayered-css-beats-tailwind-utilities", "post"],
  ["/contact", "contact"],
  ["/this-page-does-not-exist", "404"],
];

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--no-sandbox",
  ],
});

const problems = [];

for (const [route, name] of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const seen = [];
  page.on("pageerror", (e) => seen.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") seen.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    // the 404 route is expected to 404
    if (r.status() >= 400 && !(name === "404" && r.url().endsWith(route))) {
      seen.push(`${r.status()} ${r.url()}`);
    }
  });

  const res = await page.goto(BASE + route, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // let the preloader finish and every entrance animation settle
  await new Promise((r) => setTimeout(r, 6000));

  const info = await page.evaluate(() => ({
    overflowX:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
    height: document.body.scrollHeight,
    preloaderLeft: !!document.querySelector('[role="presentation"]'),
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60) ?? null,
    deadLinks: [...document.querySelectorAll("a[href='#']")].length,
    canvases: document.querySelectorAll("canvas").length,
  }));

  await page.screenshot({ path: `${OUT}/${name}.png` });

  console.log(
    `${route.padEnd(46)} ${String(res.status()).padEnd(4)} ` +
      `h=${String(info.height).padStart(6)} canvas=${info.canvases} ` +
      `overflowX=${info.overflowX} deadLinks=${info.deadLinks} ` +
      `preloaderStuck=${info.preloaderLeft}`
  );
  console.log(`   h1: ${info.h1}`);

  if (seen.length) {
    problems.push(`${route}\n   ` + [...new Set(seen)].join("\n   "));
  }
  if (info.overflowX) problems.push(`${route}: horizontal overflow`);
  if (info.preloaderLeft) problems.push(`${route}: preloader did not dismiss`);

  await page.close();
}

/* ---- contact form: validation, then a valid submission ---- */
console.log("\n--- contact form ---");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const seen = [];
  page.on("pageerror", (e) => seen.push(`pageerror: ${e.message}`));
  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 3000));

  // too-short message should be rejected by the server action
  await page.type("#name", "A");
  await page.type("#email", "not-an-email");
  await page.type("#message", "too short");
  await page.evaluate(() => {
    // bypass native validation so the action itself is exercised
    document.querySelector("form").noValidate = true;
    document.querySelector("form button[type=submit]").click();
  });
  await new Promise((r) => setTimeout(r, 2500));

  const errors = await page.evaluate(() =>
    [...document.querySelectorAll("[id$='-error']")].map((e) => e.textContent)
  );
  console.log("validation errors shown:", errors.length, errors);

  // now a valid submission
  await page.evaluate(() => {
    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#message").value = "";
  });
  await page.type("#name", "Marta Okafor");
  await page.type("#email", "marta@company.com");
  await page.type(
    "#message",
    "We need a marketing site rebuilt before our Series A announcement in October."
  );
  await page.click("form button[type=submit]");
  await new Promise((r) => setTimeout(r, 2500));

  const success = await page.evaluate(
    () => document.body.innerText.includes("Got it — thank you")
  );
  console.log("success state rendered:", success);
  await page.screenshot({ path: `${OUT}/contact-success.png` });
  if (!success) problems.push("contact form did not reach the success state");
  if (seen.length) problems.push("contact form: " + seen.join(", "));
  await page.close();
}

/* ---- OG images ---- */
console.log("\n--- opengraph images ---");
for (const path of [
  "/opengraph-image",
  "/work/nomad-atlas/opengraph-image",
  "/blog/unlayered-css-beats-tailwind-utilities/opengraph-image",
]) {
  const page = await browser.newPage();
  const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const type = res.headers()["content-type"];
  const len = (await res.buffer()).length;
  console.log(`${path.padEnd(58)} ${res.status()} ${type} ${len}b`);
  if (res.status() !== 200 || !type?.includes("png")) {
    problems.push(`${path}: bad OG response`);
  }
  await page.close();
}

console.log("\n=== problems ===");
console.log(problems.length ? problems.join("\n") : "none");

await browser.close();
