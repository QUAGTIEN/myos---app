const { chromium } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'msedge'});
 const results=[];
 for(const [width,height] of [[390,844],[375,812],[320,740]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,locale:'vi-VN'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [state,query] of [['month',''],['week','view=week'],['filters','state=filters'],['day','state=day']]) {
   const url=pathToFileURL(path.join(__dirname,'calendar-preview.html'));
   url.search='review=1'+(query?'&'+query:'');
   await page.goto(url.href);await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{const image=new Image();image.src='https://images.unsplash.com/photo-1559627707-b2d6c5810df4?auto=format&fit=crop&w=1000&q=85';await image.decode()});await page.screenshot({path:path.join(__dirname,`calendar-${state}-${width}x${height}.png`)});
   if(state==='filters')await page.evaluate(async()=>{const image=new Image();image.src='https://images.unsplash.com/photo-1559627707-b2d6c5810df4?auto=format&fit=crop&w=1000&q=85';await image.decode()});await page.screenshot({path:path.join(__dirname,`calendar-filters-full-${width}.png`),fullPage:true});
   results.push({width,height,state,errors:[...errors],...await page.evaluate(()=>{
    const measure=selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,w:r.width,h:r.height,font:s.fontSize,line:s.lineHeight}};
    return {overflow:document.documentElement.scrollWidth>innerWidth,fontLoaded:document.fonts.check('400 16px "Be Vietnam Pro"'),header:measure('header'),grid:measure('.grid'),preview:measure('.day-section'),nav:measure('.bottom-nav'),options:measure('.options'),day:measure('.day')};
   })});
  }
  await page.close();
 }
 await browser.close();fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(results,null,2));
 if(results.some(x=>x.overflow||x.errors.length||!x.fontLoaded))throw new Error('Design artifact verification failed');
 console.log(JSON.stringify(results.filter(x=>x.width===390),null,2));
})();
