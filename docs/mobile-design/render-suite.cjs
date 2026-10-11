const {chromium}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const fs=require('node:fs');
const pages=['overview','overview-checklist','overview-projects','notes','notes-organized','note-editor','note-history','projects','projects-kanban','project-detail','project-create','settings','settings-account','settings-calendar','attendance','attendance-day','attendance-activity'];
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});const records=[];
 for(const [width,height]of [[390,844],[375,812],[320,740]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,locale:'vi-VN'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const name of pages){
   const url=pathToFileURL(path.join(__dirname,name+'.html'));url.search='review=1';
   await page.goto(url.href);await page.evaluate(async()=>{await document.fonts.load('400 16px \"Be Vietnam Pro\"','MyOS Cài đặt');await document.fonts.ready});
   await page.evaluate(async()=>{const image=new Image();image.src='https://images.unsplash.com/photo-1559627707-b2d6c5810df4?auto=format&fit=crop&w=1000&q=85';await image.decode()});await page.screenshot({path:path.join(__dirname,`${name}-${width}x${height}.png`)});
   if(width!==320&&!await page.getByRole('dialog').count())await page.evaluate(async()=>{const image=new Image();image.src='https://images.unsplash.com/photo-1559627707-b2d6c5810df4?auto=format&fit=crop&w=1000&q=85';await image.decode()});await page.screenshot({path:path.join(__dirname,`${name}-full-${width}.png`),fullPage:true});
   records.push({name,width,height,errors:[...errors],...await page.evaluate(()=>{
    const measure=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,100),x:r.x,y:r.y,w:r.width,h:r.height,font:s.fontSize,line:s.lineHeight,padding:s.padding}};
    const visible=e=>e.checkVisibility()&&e.getBoundingClientRect().width>0;
    return {overflow:document.documentElement.scrollWidth>innerWidth,fontLoaded:document.fonts.check('400 16px "Be Vietnam Pro"'),header:measure(document.querySelector('header')),nav:measure(document.querySelector('.bottom-nav')),controls:[...document.querySelectorAll('button,.primary,.secondary,.icon,input,select,textarea,summary')].filter(visible).map(measure),cards:[...document.querySelectorAll('.note-tile,.project-tile,.metric,.settings-block')].filter(visible).map(measure),dialog:document.querySelector('[role=dialog]')?measure(document.querySelector('[role=dialog]')):null};
   })});
  }
  await page.close();
 }
 await browser.close();fs.writeFileSync(path.join(__dirname,'suite-verification.json'),JSON.stringify(records,null,2));
 const failed=records.filter(x=>x.overflow||x.errors.length||!x.fontLoaded);console.log(JSON.stringify({states:pages.length,viewportStates:records.length,failed:failed.map(x=>({name:x.name,width:x.width,errors:x.errors,overflow:x.overflow,font:x.fontLoaded}))}));if(failed.length)process.exit(1);
})();
