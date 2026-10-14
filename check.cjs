const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8').split("$('#sound-toggle').onclick=")[0];
const context=vm.createContext({console});
vm.runInContext(source+'\nglobalThis.api={missions,beginner,configs,esc,friendlyTable};',context);
assert.ok(!source.includes('parsePrompt'));
assert.ok(!source.includes('<textarea'));
assert.ok(!source.includes('id="write-own"'));
assert.ok(!source.includes("$('#prompt')"));
const api=context.api;
assert.equal(api.missions.length,3);
for(let m=0;m<3;m++){
 assert.equal(api.beginner[m].actions.length,4);
 assert.equal(api.configs[m].strategy,'mean');
 assert.equal(api.configs[m].model,m===1?'linear':'forest');
}
assert.equal(api.esc('<script>'),'&lt;script&gt;');
const table=api.friendlyTable({columns:['Age','Sex','Pclass','Survived'],data:[[null,'female',1,1]]});
assert.ok(!table.includes('female'));
assert.ok(table.includes('missing-cell'));
console.log('PASS: button-only actions, fixed model choices, no free-input parser, safe table output.');
