import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
if (!process.argv.includes('--send')) throw new Error('This sends four real emails. Run with --send only when explicitly authorized.');
const run='JV-LIVE-'+new Date().toISOString().replace(/[-:.]/g,'').slice(0,15);
const results=[];
const services=['Website development','SEO','Maintenance','IT support'];
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 for(const service of services) {
  const page=await browser.newPage();await page.setRequestInterception(true);
  page.on('request',request=> /google-analytics|googletagmanager|cloudflareinsights/.test(request.url())?request.abort():request.continue());
  await page.goto('https://joseviews.com/contact',{waitUntil:'networkidle0',timeout:60000});
  await page.waitForSelector('[role=presentation]',{hidden:true,timeout:15000});
  await page.type('#name','Joseviews Delivery Test');
  await page.type('#email','hi@joseviews.com');
  await page.type('#message',`TEST ONLY — ${run} — ${service}. This is an authorized contact-form delivery check for the site owner, not a customer enquiry. Please confirm this message arrived and use Reply to verify that Reply-To points to hi@joseviews.com. No work or quotation is requested.`);
  await page.click('button[type=submit]');
  await page.waitForFunction(()=>document.body.innerText.includes('Got it — thank you.') || document.querySelector('[role=alert]'),{timeout:30000});
  const accepted=await page.evaluate(()=>document.body.innerText.includes('Got it — thank you.'));
  results.push({service,run,acceptedByLiveForm:accepted,at:new Date().toISOString(),inboxReceipt:'Not verified',replyReceipt:'Not verified'});
  console.log(service+': '+(accepted?'Live form reported success':'Live form reported an error'));
  if(!accepted){console.log(await page.$eval('[role=alert]',e=>e.textContent));break;}
  await page.close();
 }
} finally {fs.mkdirSync('preview',{recursive:true});fs.writeFileSync('preview/live-enquiry-tests.json',JSON.stringify(results,null,2));await browser.close();}
console.log('Reference: '+run+'. Inbox and reply receipt require confirmation.');
