import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import {chromium} from 'playwright';
const port=4181;
const preview=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
let chrome;
try {
  let ready=false;
  for(let i=0;i<40;i++){try{const r=await fetch(`http://127.0.0.1:${port}`);if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}
  if(!ready)throw new Error('Production audit preview did not start');
  chrome=await chromeLauncher.launch({chromePath:process.env.CHROME_PATH??chromium.executablePath(),chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
  await fs.mkdir('qa/lighthouse',{recursive:true});
  const scores=[];
  for(const route of ['/','/corridor','/about','/work','/now','/diary']){
    const result=await lighthouse(`http://127.0.0.1:${port}/#${route}`,{port:chrome.port,output:'html',logLevel:'error',onlyCategories:['performance','accessibility','best-practices']});
    if(!result)throw new Error('Lighthouse did not return a report');
    const categories=result.lhr.categories;
    const entry={route,performance:Math.round(categories.performance.score*100),accessibility:Math.round(categories.accessibility.score*100),bestPractices:Math.round(categories['best-practices'].score*100)};
    scores.push(entry);
    await fs.writeFile(`qa/lighthouse/${route==='/'?'landing':route.slice(1)}.html`,result.report);
  }
  await fs.writeFile('qa/lighthouse/scores.json',JSON.stringify(scores,null,2));
  console.table(scores);
  if(scores.some(x=>x.performance<85||x.accessibility<95||x.bestPractices<95))process.exitCode=1;
}finally{if(chrome)await chrome.kill();preview.kill();}
