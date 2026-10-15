import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
fs.mkdirSync('preview',{recursive:true});
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const page = await browser.newPage();
  for(const [name,width,height] of [['desktop',1440,1100],['mobile',390,844]]) {
    await page.setViewport({width,height,deviceScaleFactor:1});
    await page.goto('http://localhost:3222',{waitUntil:'networkidle0'});
    await new Promise(r=>setTimeout(r,5500));
    const result = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,extensionLinks:document.querySelectorAll('a[href*="#extension"]').length,h1:document.querySelector('h1').innerText,heroHeight:document.querySelector('#top').offsetHeight}));
    if(result.overflow || result.extensionLinks) throw new Error(JSON.stringify(result));
    await page.screenshot({path:`preview/portfolio-${name}.png`});
    console.log(name,JSON.stringify(result));
  }
} finally {await browser.close();}
