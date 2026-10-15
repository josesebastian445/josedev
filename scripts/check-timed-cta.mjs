import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage();
 await page.setViewport({width:1440,height:1000});
 await page.goto('http://localhost:3222/blog/emails-going-to-spam-spf-dkim-dmarc',{waitUntil:'networkidle0'});
 assert.equal(await page.$('.timed-cta'),null);
 await new Promise(r=>setTimeout(r,20000));
 assert.equal(await page.$('.timed-cta'),null,'CTA must stay hidden before 30 seconds');
 await page.waitForSelector('.timed-cta',{timeout:15000});
 await new Promise(r=>setTimeout(r,500));
 const box=await page.$eval('.timed-cta',e=>{const r=e.getBoundingClientRect();return {right:r.right,width:r.width};});
 assert.ok(box.right>1300 && box.width===330,'CTA appears on the right');
 assert.equal(await page.$eval('.timed-cta a',e=>e.getAttribute('href')),'/contact');
 await page.screenshot({path:'preview/timed-cta.png'});
 await page.click('.timed-cta-close');
 await page.waitForSelector('.timed-cta',{hidden:true});
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('joseviews:cta-dismissed')),'1');
 // Accelerate only the repeat check to verify persisted dismissal without another 30-second wait.
 await page.evaluateOnNewDocument(()=>{const original=window.setTimeout;window.setTimeout=(fn,ms,...args)=>original(fn,ms===30000?100:ms,...args);});
 await page.reload({waitUntil:'networkidle0'});
 await new Promise(r=>setTimeout(r,1000));
 assert.equal(await page.$('.timed-cta'),null,'Dismissal survives page reload');
 console.log('Passed: hidden before delay, appears after 30 seconds on right, contact link, dismiss, and session dismissal.');
} finally {await browser.close();}
