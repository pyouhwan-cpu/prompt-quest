const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('dist/app.js','utf8');
const run=source.slice(source.indexOf('function run(){'),source.indexOf('\nfunction renderResult'));
(async()=>{for(let m=0;m<3;m++)for(let s=0;s<4;s++){
let done;const completion=new Promise(r=>done=r);let requested;
const context={busy:false,current:m,stage:s,AbortSignal,$:()=>({}),lock:()=>{},fetch:async path=>{requested=path;return {ok:true,json:async()=>JSON.parse(fs.readFileSync('dist/'+path.split('?')[0],'utf8'))}},finishResult:r=>done(r),fail:e=>{throw Error(e)}};
vm.runInNewContext(run+';run()',context);const result=await completion;
assert.ok(result.code);if(s===3&&m===0)assert.equal(Object.keys(result.passengerProbabilities).length,426);
assert.ok(!requested.includes('cdn'));}
assert.ok(!run.includes('Worker'));console.log('PASS: all 12 lesson loads, 426 predictions, no Python runtime download.');})().catch(e=>{console.error(e);process.exitCode=1});
