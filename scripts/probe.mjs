import puppeteer from "puppeteer-core";

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
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const failures = [];
page.on("requestfailed", (r) => failures.push(r.url()));
page.on("response", (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});

await page.goto("http://localhost:3222", { waitUntil: "networkidle0" });

const info = await page.evaluate(() => {
  const out = {};

  // footer wordmark: how tall is it vs one line?
  const marks = [...document.querySelectorAll("footer div")].filter((d) =>
    d.textContent?.trim().startsWith("KAI FERRER")
  );
  const m = marks[marks.length - 1];
  if (m) {
    const cs = getComputedStyle(m);
    out.wordmark = {
      text: m.textContent.trim(),
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      clientHeight: m.clientHeight,
      scrollWidth: m.scrollWidth,
      clientWidth: m.clientWidth,
      lines: Math.round(m.clientHeight / parseFloat(cs.lineHeight)),
    };
  }

  // nav container border at scroll top
  const hdr = document.querySelector("header > div");
  if (hdr) {
    const cs = getComputedStyle(hdr);
    out.navBorder = {
      class: hdr.className.slice(0, 90),
      borderTopColor: cs.borderTopColor,
      borderTopWidth: cs.borderTopWidth,
    };
  }

  // does the page scroll horizontally?
  out.overflowX =
    document.documentElement.scrollWidth > document.documentElement.clientWidth;
  out.docScrollWidth = document.documentElement.scrollWidth;
  out.clientWidth = document.documentElement.clientWidth;

  return out;
});

console.log(JSON.stringify(info, null, 2));
console.log("failed/4xx requests:", failures.length ? failures : "none");

await browser.close();
