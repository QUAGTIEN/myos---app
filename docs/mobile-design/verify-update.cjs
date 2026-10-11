const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 const records=[];
 for(const [width,height] of [[390,844],[375,812],[320,740]]){
  const page=await browser.newPage({viewport:{width,height},locale:'vi-VN'});
  for(const file of ['overview.html','calendar-preview.html?state=day','note-history.html','project-create.html','attendance-day.html','attendance-activity.html']){
   await page.goto('http://127.0.0.1:3111/'+file);
   await page.evaluate(()=>document.fonts.ready);
   const result=await page.evaluate(async()=>{
    const photo=new Image();photo.src='https://images.unsplash.com/photo-1559627707-b2d6c5810df4?auto=format&fit=crop&w=1000&q=85';await photo.decode();
    const nav=document.querySelector('.bottom-nav').getBoundingClientRect();
    const dialog=document.querySelector('[role=dialog]');const r=dialog?.getBoundingClientRect();
    return {imageLoaded:photo.naturalWidth>0,navHeight:nav.height,overflow:document.documentElement.scrollWidth>innerWidth,dialog:r?{centerX:r.x+r.width/2,centerY:r.y+r.height/2,top:r.y,bottom:r.bottom}:null};
   });
   assert(result.imageLoaded);if(width>=375)assert.equal(result.navHeight,56);else assert(result.navHeight>=56&&result.navHeight<=72);assert.equal(result.overflow,false);
   if(result.dialog){assert(Math.abs(result.dialog.centerX-width/2)<1);assert(Math.abs(result.dialog.centerY-height/2)<1);assert(result.dialog.top>=12);assert(result.dialog.bottom<=height-12);}
   records.push({file,width,height,...result});
  }
  await page.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(__dirname,'update-verification.json'),JSON.stringify({scope:'Standalone design preview, not MyOS runtime',records},null,2));
 console.log(JSON.stringify({checked:records.length,passed:true}));
})();
