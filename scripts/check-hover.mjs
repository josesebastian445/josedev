import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:1000});
  await page.goto('http://localhost:3222/blog/emails-going-to-spam-spf-dkim-dmarc',{waitUntil:'networkidle0'});
  await page.waitForSelector('.article-motion');
  await page.hover('.page-hero dl > div');
  await new Promise(r=>setTimeout(r,400));
  const marker = await page.$eval('.page-hero dl > div',e=>getComputedStyle(e,'::before').transform);
  assert.equal(marker,'matrix(1, 0, 0, 1, 0, 0)');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  const reduced = await page.$eval('.article-motion',e=>getComputedStyle(e).animationName);
  assert.equal(reduced,'none');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.goto('http://localhost:3222',{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,3000));
  await page.hover('.hero-copy a');
  await new Promise(r=>setTimeout(r,400));
  assert.equal(await page.$eval('.hero-copy a',e=>getComputedStyle(e).translate),'0px -3px');
  console.log('Passed: article metadata hover, reduced motion, no horizontal overflow, homepage button lift.');
} finally { await browser.close(); }
