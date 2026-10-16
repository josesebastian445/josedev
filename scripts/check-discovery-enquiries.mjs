import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('preview',{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage();page.setDefaultNavigationTimeout(60000);await page.setViewport({width:1440,height:1000});
 await page.goto('http://localhost:3222/blog',{waitUntil:'networkidle0'});
 await page.type('#blog-search','backup is only useful');
 await page.waitForFunction(()=>document.querySelector('[role=status]')?.textContent.includes('1 article'));
 assert.equal((await page.$$('.post-hover')).length,1);
 await page.click('#blog-search',{clickCount:3});await page.type('#blog-search','zzzznonexistent');
 await page.waitForFunction(()=>document.body.textContent.includes('No matches this time.'));
 await page.click('button.text-accent');
 await page.select('#blog-topic','SEO');
 await page.waitForFunction(()=>document.querySelector('[role=status]')?.textContent.includes('in SEO'));
 assert.ok((await page.$$('.post-hover')).length>0);
 await page.waitForSelector('[role="presentation"]',{hidden:true});
 await page.$eval('.blog-controls',e=>e.scrollIntoView({block:'center'}));
 await new Promise(r=>setTimeout(r,1500));
 await page.screenshot({path:'preview/blog-discovery-desktop.png'});
 await page.goto('http://localhost:3222/blog/emails-going-to-spam-spf-dkim-dmarc',{waitUntil:'networkidle0'});
 const links=await page.$$eval('.related-card',els=>els.map(e=>e.getAttribute('href')));
 assert.equal(links.length,3);assert.equal(new Set(links).size,3);assert.ok(!links.includes('/blog/emails-going-to-spam-spf-dkim-dmarc'));
 for(const [slug,label] of [['web-design-development','Website or reference URL'],['seo-search-performance','Website to review'],['web-security-maintenance','Website to maintain'],['it-support-infrastructure','Team size and affected systems']]) {
  await page.goto('http://localhost:3222/contact?service='+slug,{waitUntil:'networkidle0'});
  assert.equal(await page.$eval('input[name=service]:checked',e=>e.value),slug);
  assert.ok(await page.$eval('label[for=details]',(e,expected)=>e.textContent.includes(expected),label));
 }
 await page.setViewport({width:390,height:844});
 await new Promise(r=>setTimeout(r,1500));
 await page.screenshot({path:'preview/service-enquiry-mobile.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.goto('http://localhost:3222/work/best-solution-services',{waitUntil:'networkidle0'});
 assert.equal((await page.$$('#project-change-heading')).length,1);
 assert.equal((await page.$$('a[href="https://www.best-solution.ae/"]')).length,1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 console.log('Passed: search, empty state, clear filters, topic filter, three distinct related links, all four preselected enquiry flows, case-study link, mobile overflow.');
} finally {await browser.close();}
