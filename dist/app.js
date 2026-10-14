'use strict';
const $ = s => document.querySelector(s);
const esc = value => String(value ?? '—').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const steps = ['명단 조사','기록 복구','규칙 발견','봉투 대조'];
const missions = [
 {title:'타이타닉 호의 생존자 추적기',short:'타이타닉 생존자 추적',role:'시간 여행 데이터 탐정',type:'분류 · CLASSIFICATION',style:'ship',badge:'🔎 생존 기록 탐정',desc:'1912년으로 떠나는 데이터 여행. 승객 기록 속 생존의 단서를 찾아보세요.',story:'당신은 시간 여행을 떠난 데이터 탐정입니다. 승객의 나이, 성별, 객실 등급을 조사하고 생존 여부를 예측하세요.',tags:['Pandas','결측치 처리','Random Forest'],columns:'Age 나이 · Sex 성별 · Pclass 객실 등급(1이 가장 높음) · Survived 생존 여부(1=생존)',goals:['승객 기록의 모양과 빠진 값을 확인하세요.','나이 빈칸을 채우고 성별을 원-핫 인코딩하세요.','승객의 특징과 생존 여부의 관계를 모델에 학습시키세요.','처음 보는 승객 기록으로 모델 성능을 확인하세요.']},
 {title:'백화점 VIP 고객 예측',short:'백화점 VIP 고객 예측',role:'마케팅 팀 신입 분석가',type:'분류 · TARGETING',style:'vip',badge:'🛍️ 고객 발견 분석가',desc:'숫자 속에 숨어 있는 다음 VIP. 고객의 발자취로 마케팅의 방향을 정하세요.',story:'백화점 마케팅 팀에 합류했습니다. 지난 기간 구매·방문 기록으로 다음 기간의 VIP 여부를 예측해보세요.',tags:['데이터 탐색','StandardScaler','성능 평가'],columns:'AnnualSpend 지난 기간 소비액(만원) · Visits 방문 횟수 · Recency 마지막 구매 후 경과일 · NextVIP 다음 기간 VIP 여부',goals:['고객 데이터와 VIP 분포를 살펴보세요.','결측치를 채우고 수치형 변수의 단위를 맞추세요.','다음 기간의 VIP 여부를 예측하는 모델을 학습시키세요.','어떤 평가 지표가 마케팅 목적에 맞는지 생각해보세요.']},
 {title:'스마트 내비게이션 도착 시간 예측',short:'스마트 내비게이션',role:'모빌리티 알고리즘 엔지니어',type:'회귀 · REGRESSION',style:'route',badge:'🚗 도착 시간 예측가',desc:'목적지까지 얼마나 걸릴까요? 이동 기록을 분석해 더 정확한 도착 시간을 찾아보세요.',story:'모빌리티 스타트업의 엔지니어가 되었습니다. 이동 거리와 출발 시간, 요일로 실제 소요 시간을 예측하세요.',tags:['이상치 검토','Regression','MAE · RMSE'],columns:'Distance 이동 거리(km) · Hour 출발 시각(0~23) · Day 평일/주말 · Duration 소요 시간(분)',goals:['이동 기록을 살펴보고 거리와 시간의 관계를 확인하세요.','비정상 기록을 제거하고 결측치·요일 정보를 정리하세요.','이동 조건으로 소요 시간을 예측하는 회귀 모델을 학습시키세요.','평균적으로 몇 분 어긋나는지 확인하세요.']}
];
const arts = [
 '<path d="M25 85h178l-29 26H54z" fill="#88b9c5"/><path d="M55 66h110l24 19H45z" fill="#c4dadb"/><path d="M75 47h15v19H75zm37 0h15v19h-15zm37 0h15v19h-15z" fill="#d5a16c"/><path d="M19 115q18-8 36 0t36 0t36 0t36 0t36 0" fill="none" stroke="#82b9bd" stroke-width="2"/><path d="M47 33v48m0-45h117" stroke="#99b8c6"/><circle cx="188" cy="30" r="13" fill="#a0c5cd" opacity=".3"/>',
 '<path d="M63 53h92l11 63H52z" fill="#b6a0c5"/><path d="M89 53V39a21 21 0 0142 0v14" fill="none" stroke="#e8d6d7" stroke-width="5"/><rect x="127" y="71" width="61" height="38" rx="6" fill="#d9b478" transform="rotate(-12 127 71)"/><path d="M144 82l5 6 6-9 5 7 5-8-2 16-19 2z" fill="#684e62"/><circle cx="47" cy="31" r="4" fill="#d1acd5"/><path d="M176 27v16m-8-8h16" stroke="#d1acd5" stroke-width="2"/>',
 '<path d="M15 25h190M15 65h190M15 105h190M55 10v110M110 10v110M165 10v110" stroke="#6c9672" opacity=".25"/><path d="M42 103V65h95V29h41" fill="none" stroke="#b7e17f" stroke-width="8" stroke-linejoin="round"/><circle cx="42" cy="103" r="10" fill="#d3e7b4"/><path d="M178 10c-13 0-21 10-21 21s21 30 21 30 21-20 21-30-8-21-21-21" fill="#add781"/><circle cx="178" cy="30" r="7" fill="#294337"/>'
];
let progress = [[],[],[]], history = [];
try {const saved=JSON.parse(localStorage.getItem('promptQuest.v1'));if(saved && Array.isArray(saved.progress) && saved.progress.length===3 && saved.progress.every(a=>Array.isArray(a))) {progress=saved.progress.map(a=>a.filter(n=>[0,1,2,3].includes(n)));history=Array.isArray(saved.history)?saved.history.slice(-60):[];}}catch{}
let current=0,stage=0,busy=false,worker=null,timer=null,configs=[{strategy:'mean',model:'forest'},{strategy:'mean',model:'linear'},{strategy:'mean',model:'forest'}],results=[[],[],[]];
function persist(){try{localStorage.setItem('promptQuest.v1',JSON.stringify({progress,history}));}catch{ $('#feedback').textContent+=' 이 브라우저에서는 학습 기록을 저장할 수 없습니다.';}}
function show(view){stopDialogue();document.body.classList.toggle('playing',view==='lab');['map','lab','records'].forEach(id=>$('#'+id).hidden=id!==view);$('#home').classList.toggle('active',view!=='records');$('#journal').classList.toggle('active',view==='records');window.scrollTo({top:0,behavior:'smooth'});}
function map(){show('map');renderTitanicMap();}
function openMission(index){if(busy)return;current=index;stage=Math.min(progress[index].length,3);renderLab();}

function supportText(){return ['명단의 처음 5개 기록과 빈칸을 살펴봐요.', ['학습용 기록의 평균으로 나이 빈칸을 채우고 성별을 숫자로 바꿔요.','학습용 기록의 평균으로 빈칸을 채우고 숫자의 단위를 비교하기 좋게 맞춰요.','잘못된 거리 기록을 정리하고 평균으로 빈칸을 채운 뒤 요일을 숫자로 바꿔요.'][current], '학습용 기록 80%로 규칙을 배우고 나머지 20%는 확인용으로 남겨둬요.', '처음 보는 기록으로 예상한 답을 실제 정답과 비교해요.'][stage];}
function lock(value){busy=value;document.querySelectorAll('button:not([data-scene-control])').forEach(el=>{if(value){el.dataset.wasDisabled=el.disabled?'1':'0';el.disabled=true;}else if(el.dataset.wasDisabled!==undefined){el.disabled=el.dataset.wasDisabled==='1';delete el.dataset.wasDisabled;}});if($('#guided-run'))$('#guided-run').textContent=value?'잠시만요…':beginner[current].actions[stage]+' →';refreshSceneActions();}

function fail(message){clearTimeout(timer);if(worker)worker.terminate();worker=null;lock(false);$('#feedback').className='error';$('#feedback').textContent='분석을 완료하지 못했어요. 인터넷 연결을 확인한 뒤 명령을 다시 실행해주세요.';const detail=document.createElement('details');const summary=document.createElement('summary');summary.textContent='오류 상세';const pre=document.createElement('pre');pre.textContent=String(message);detail.append(summary,pre);$('#feedback').append(detail);}
function table(t){return `<table><thead><tr>${t.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.data.map(row=>`<tr>${row.map(v=>`<td>${v===null?'<span class="error">빈칸</span>':esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}


function download(name,text,type){const url=URL.createObjectURL(new Blob(['\uFEFF',text],{type:type+';charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function records(){if(busy)return;show('records');$('#records').innerHTML=`<div class="eyebrow">MY ADVENTURE JOURNAL</div><h1>나의 탐험 수첩</h1><p>이 브라우저에 저장한 분석 기록과 획득 배지입니다.</p><div class="panel">${missions.slice(0,1).map((m,i)=>`<div class="record"><b>${progress[i].length===4?m.badge:m.short}</b><p>${progress[i].length}/4 단계 완료</p></div>`).join('')}</div><div class="panel"><h2>최근 실행한 명령</h2>${history.length?history.filter(h=>h.mission===0).slice().reverse().map(h=>`<div class="record"><span class="meta">${esc(missions[h.mission]?.short||'미션')} · ${esc(steps[h.stage]||'')} · ${esc(new Date(h.date).toLocaleString('ko-KR'))}</span><p>${esc(h.prompt)}</p>${h.metrics?`<p>${esc(JSON.stringify(h.metrics))}</p>`:''}</div>`).join(''):'<p>아직 실행 기록이 없어요. 첫 번째 퀘스트를 시작해보세요.</p>'}</div>`;}
const beginner = [
  {noun:'승객',unit:'명',title:['먼저, 승객 명단을 열어볼까요?','나이가 적혀 있지 않네요.','컴퓨터에게 승객 기록을 보여줄까요?','처음 보는 승객도 맞힐 수 있을까요?'],message:['누가 배에 탔는지 함께 살펴봐요. 아래 버튼을 누르면 승객 5명의 기록이 나와요.','나이가 적힌 사람들의 평균 나이로 빈칸을 채워볼게요. 평균은 나이를 모두 더한 뒤 사람 수로 나눈 값이에요.','기록 일부를 예제로 보여주고, 승객의 특징과 생존 여부 사이의 규칙을 배우게 할 거예요.','공부할 때 보여주지 않은 기록으로 생존 여부를 맞혀보고, 실제 기록과 비교할 거예요.'],actions:['승객 명단을 보여줘','빈 나이 칸을 평균 나이로 채워줘','승객 기록으로 공부시켜줘','얼마나 맞혔는지 보여줘']},
  {noun:'고객',unit:'명',title:['먼저, 고객 명단을 열어볼까요?','구매 금액에 빈칸이 있네요.','컴퓨터에게 고객 기록을 보여줄까요?','새로운 VIP를 잘 찾았을까요?'],message:['누가 얼마나 자주 방문했는지 살펴봐요. 버튼 하나로 고객 5명의 기록을 볼 수 있어요.','금액이 적힌 고객들의 평균 금액으로 빈칸을 채울 거예요. 서로 단위가 다른 숫자를 비교하기 좋게 정리하는 일도 함께 도와드려요.','지난 구매 기록을 보고 다음 기간에 VIP가 된 고객들의 특징을 배우게 할 거예요.','공부할 때 보여주지 않은 고객 기록으로 VIP 여부를 맞히고, 실제 정답과 비교해볼게요.'],actions:['고객 명단을 보여줘','빈 구매 금액을 평균으로 채워줘','고객 기록으로 공부시켜줘','VIP를 얼마나 맞혔는지 보여줘']},
  {noun:'이동 기록',unit:'건',title:['먼저, 이동 기록을 열어볼까요?','이동 거리에 빈칸이 있네요.','컴퓨터에게 이동 기록을 보여줄까요?','예상 시간은 얼마나 빗나갔을까요?'],message:['얼마나 멀리, 얼마나 오래 이동했는지 살펴봐요. 우선 기록 5건만 열어볼게요.','거리의 평균으로 빈칸을 채울 거예요. 거리가 마이너스인 잘못된 기록도 정리해드려요.','거리와 출발 시간, 요일을 보고 도착까지 걸리는 시간을 배우게 할 거예요.','처음 보는 이동 기록의 소요 시간을 예측해요. 실제 시간과 몇 분이나 차이가 나는지 함께 봐요.'],actions:['이동 기록을 보여줘','빈 거리를 평균으로 채우고 잘못된 기록을 정리해줘','이동 기록으로 공부시켜줘','시간이 얼마나 차이 나는지 보여줘']}
];
const friendlyNames = {Age:'나이',Sex:'성별',Pclass:'객실 등급',Survived:'생존 여부',AnnualSpend:'구매 금액(만원)',Visits:'방문 횟수',Recency:'마지막 구매 후 지난 날',NextVIP:'다음 기간 VIP',Distance:'이동 거리(km)',Hour:'출발 시각',Day:'요일',Duration:'걸린 시간(분)'};
function friendlyValue(column,value){
  if(value===null)return '<span class="missing-cell">빈칸</span>';
  if(column==='Sex')return value==='female'?'여성':'남성';
  if(column==='Pclass')return `${esc(value)}등실`;
  if(column==='Survived')return value===1?'생존':'사망';
  if(column==='NextVIP')return value===1?'VIP':'일반 고객';
  if(column==='Day')return value==='weekday'?'평일':'주말';
  if(column==='Hour')return `${esc(value)}시`;
  return esc(value);
}
function friendlyTable(t){return `<table><thead><tr>${t.columns.map(c=>`<th>${esc(friendlyNames[c]||c)}</th>`).join('')}</tr></thead><tbody>${t.data.map(row=>`<tr>${row.map((v,i)=>`<td>${friendlyValue(t.columns[i],v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
function showCodePreview(){
  const filename=['titanic.csv','customers.csv','trips.csv'][current];
  const column=['Age','AnnualSpend','Distance'][current];
  const preview=[
    [`df = pd.read_csv('${filename}')\npreview = df.head(5)`, 'read_csv는 명단 파일을 열어요. head(5)는 맨 앞의 기록 5개를 펼쳐요.'],
    [`# 먼저 공부할 기록과 확인할 기록을 나눠둡니다.\nfill_value = X_train['${column}'].mean()\nX_train['${column}'] = X_train['${column}'].fillna(fill_value)\nX_test['${column}'] = X_test['${column}'].fillna(fill_value)`, 'mean()은 평균을 구하고, fillna()는 빈칸을 채워요. 공부할 기록에서 구한 평균을 두 묶음에 함께 사용해요.'],
    ['model.fit(X_train, y_train)', 'fit은 예제와 정답을 보고 규칙을 배우는 명령이에요. X_train은 예제, y_train은 그 정답이에요.'],
    [current===2?'predictions = model.predict(X_test)\nmae = mean_absolute_error(y_test, predictions)':'predictions = model.predict(X_test)\naccuracy = accuracy_score(y_test, predictions)', current===2?'predict는 시간을 예상해요. mean_absolute_error는 실제 시간과 얼마나 차이가 나는지 계산해요.':'predict는 답을 예상해요. accuracy_score는 실제 정답과 비교해 맞힌 비율을 구해요.']
  ][stage];
  $('#code').textContent=preview[0];$('#code-note').textContent=preview[1];
}
function renderLab(){
  passengerMode=false;
  show('lab');const m=missions[current],b=beginner[current];
  $('#lab').innerHTML=`<button class="back" id="back">← 퀘스트 지도</button>
    <div class="lab-head"><div><div class="eyebrow">QUEST 0${current+1} · ${m.role}</div><h1>${m.title}</h1></div><span class="status">처음부터 함께 배우기</span></div>
    <div class="steps">${steps.map((s,i)=>`<button class="step ${stage===i?'selected':''}" data-step="${i}" ${i>progress[current].length?'disabled':''}>${progress[current].includes(i)?'✓':i+1} ${s}</button>`).join('')}</div>
    <div id="story-mount"></div><section id="workbench" hidden><div class="workbench-heading"><h2>▤ 탐험 수첩</h2><span>작은 발견을 하나씩 기록해요</span></div><div class="workspace beginner-workspace"><div><div class="panel guide-panel">
      <div class="guide-label">✦ 함께 해봐요 · ${stage+1} / 4</div><h2>${b.title[stage]}</h2><p class="guide-message">${b.message[stage]}</p>
      <button class="primary guided-action" id="guided-run">${b.actions[stage]} <span>→</span></button>
      <p class="gentle-note">버튼을 눌러 루미와 함께 한 단계씩 진행해요.</p>
      <div class="action-code" id="code-panel"><details id="peek"><summary>컴퓨터는 어떻게 했을까요? <span class="optional-label">눌러서 바로 보기</span></summary><p id="code-context">실행 전에는 핵심 코드 예시를 보여줘요. 실행하면 이 작업에 사용한 코드로 바뀝니다.</p><pre id="code"></pre><p id="code-note"></p><div class="actions"><button class="secondary" id="download-code" disabled>코드 내려받기</button><button class="secondary" id="download-data" disabled>명단 내려받기</button></div></details></div>
      <div id="feedback" role="status" aria-live="polite"></div>

    </div><details class="panel optional"><summary>이 명단은 어떤 자료인가요?</summary><p>학습용으로 만든 ${current===2?'이동 기록 360건':'360명의 가상 '+b.noun+' 기록'}이에요. 실제 역사·고객·이동 자료는 아니에요.</p><p>${m.columns}</p></details></div>
    <div><div class="panel"><div class="guide-label">함께 살펴볼 기록</div><h2 id="result-title">${stage===0?'명단을 열면 여기에 보여요':'버튼을 눌러 함께 확인해요'}</h2><div class="output" id="output"><div class="empty"><div><span>✧</span>${stage===0?'처음에는 표를 구경하는 것만으로 충분해요.':'복잡한 계산은 컴퓨터가 도와줄 거예요.'}</div></div></div><div id="quiz"></div></div>
</div></div></section><p class="game-footnote">대화와 선택지를 따라 진행하는 학습 게임이에요. 기록 분석은 이 브라우저에서 계산해요.</p>`;
  $('#back').onclick=map;
  showCodePreview();
  $('#guided-run').onclick=run;
  document.querySelectorAll('[data-step]').forEach(button=>button.onclick=()=>{if(!busy){stage=Number(button.dataset.step);renderLab();}});
  mountStoryScene();
  if(results[current][stage])renderResult(results[current][stage]);
}
function finishResult(result){clearTimeout(timer);lock(false);results[current][stage]=result;history.push({mission:current,stage,prompt:beginner[current].actions[stage],date:new Date().toISOString(),metrics:result.metrics||null});history=history.slice(-60);renderResult(result);persist();}
function run(){
  if(busy)return;const config=configs[current];
  lock(true);$('#feedback').className='';$('#feedback').textContent='명단을 준비하고 있어요…';
  if(stage===0){
    fetch(`intro-${current}.json`,{signal:AbortSignal.timeout(15000)}).then(response=>{if(!response.ok)throw Error('명단 파일을 열지 못했어요.');return response.json();}).then(finishResult).catch(error=>fail(error.message));return;
  }
  try{
    if(!worker){worker=new Worker('worker.js?v=10',{type:'module'});worker.onmessage=({data})=>{if(data.status){$('#feedback').textContent=data.status;return;}if(data.error){fail(data.error);return;}finishResult(data.result);};worker.onerror=event=>fail(event.message||'계산 도구를 준비하지 못했어요.');}
    worker.postMessage({mission:current,stage,...config});timer=setTimeout(()=>fail('계산 도구를 준비하는 시간이 너무 오래 걸리고 있어요.'),180000);
  }catch(error){fail(error.message);}
}
function renderResult(r){
  const b=beginner[current];let html='';
  $('#result-title').textContent=['명단이 열렸어요!','빈칸을 채웠어요!','공부를 마쳤어요!','정답과 비교해봤어요!'][stage];
  if(stage===0){
    html=`<p class="guide-message">${current===2?'이동 기록 5건':'승객 고객'.split(' ')[current]+' 5명'}이에요. <b>가로 한 줄이 ${current===2?'한 번의 이동':'한 사람의 기록'}</b>이에요.</p>${friendlyTable(r.table)}<p>전체 ${r.rows}${b.unit} 중 처음 5${b.unit}만 펼쳐봤어요.</p><div class="discovery-prompt"><p>기록에는 적혀 있지 않은 칸도 있을 수 있어요.</p><button class="secondary" id="find-blanks">빈칸이 있는지 찾아볼까요? →</button></div><details class="action-code"><summary>빈칸 찾기는 어떻게 하나요?</summary><p>각 칸이 비어 있는지 확인하고, 항목별로 빈칸 수를 더해요.</p><pre>df.isna().sum()</pre><p>isna()는 빈칸인지 확인하고, sum()은 그 개수를 세어요.</p></details><div id="blank-discovery" hidden></div>`;
  }
  if(stage===1){
    const column=['Age','AnnualSpend','Distance'][current];const unit=['살','만원','km'][current];
    html=`<div class="before-after"><div><span>채우기 전</span><strong>빈칸</strong></div><span>→</span><div><span>채운 값</span><strong>${Number(r.fillValues[column]).toFixed(1)}${unit}</strong></div></div><p>공부에 사용할 기록에서 구한 값으로 빈칸을 채웠어요. 빈칸으로 남은 숫자는 <b>${r.missingAfter}개</b>예요.</p><p>이건 실제 ${['나이','구매 금액','거리'][current]}를 알아낸 것이 아니라, 계산을 계속하기 위해 대신 넣은 값이에요.</p><details class="optional"><summary>나머지 정리 작업도 볼까요?</summary><p>${supportText()}</p>${table(r.table)}<p>학습용 ${r.trainCount}개 · 확인용 ${r.testCount}개. 확인용 기록은 공부할 때 보여주지 않아요.</p></details>`;
  }
  if(stage===2)html=`<div class="study-complete">✦</div><p class="guide-message"><b>${r.trainCount}개의 예제로 공부했어요.</b></p><p>나머지 ${r.testCount}개는 아직 보여주지 않았어요.<br>다음에는 이 기록으로 얼마나 잘 배웠는지 확인해요.</p><details class="optional"><summary>사용한 방법의 이름이 궁금해요</summary><p>${esc(r.model)} · ${current===2?'걸리는 시간처럼 숫자를 예상하는 것을 회귀라고 해요.':'생존 여부나 VIP 여부처럼 종류를 맞히는 것을 분류라고 해요.'}</p></details>`;
  if(stage===3){
    if(current<2){const correct=r.confusion[0][0]+r.confusion[1][1];html=`<div class="metric">${r.testCount}개 중 ${correct}개<small>처음 보는 기록에서 맞힌 개수</small></div><p>정답을 맞힌 비율은 <b>${(r.metrics.accuracy*100).toFixed(1)}%</b>예요.<br>이 비율을 <b>정확도</b>라고 불러요.</p>`;}else html=`<div class="metric">약 ${r.metrics.mae.toFixed(1)}분<small>예상 시간과 실제 시간이 평균적으로 어긋난 정도</small></div><p>일찍 예상했든 늦게 예상했든, 차이의 크기만 모아 평균을 냈어요. 이를 <b>평균 절대 오차(MAE)</b>라고 불러요.</p>`;
    html+=`<details class="optional"><summary>예상과 실제 기록을 비교해볼까요?</summary>${table(r.table)}<p>${current<2?'이 표에서 1은 생존 또는 VIP, 0은 사망 또는 일반 고객을 뜻해요.':'단위는 분이에요.'}</p><p>${current<2?`정밀도 ${(r.metrics.precision*100).toFixed(1)}% · 재현율 ${(r.metrics.recall*100).toFixed(1)}%`:`큰 차이에 더 민감한 지표인 RMSE는 ${r.metrics.rmse.toFixed(2)}분이에요.`}</p></details><p class="gentle-note">학습용으로 만든 기록에서 계산한 결과예요. 실제 상황에서도 같은 성능을 보장하지는 않아요.</p>`;
  }
  $('#output').innerHTML=html;$('#quiz').innerHTML='';$('#code-panel').hidden=false;$('#code-context').textContent='방금 실행한 작업의 파이썬 코드예요. 읽거나 외우지 않아도 괜찮아요.';
  $('#code').textContent=r.code;$('#code-note').textContent=['head(5)는 처음 5명의 기록을 펼치는 명령이에요.','fillna는 비어 있는 칸을 채우는 명령이에요.','fit은 기록에서 규칙을 배우는 명령이에요.','predict는 배운 규칙으로 답을 예상하는 명령이에요.'][stage];
  $('#download-code').disabled=false;$('#download-data').disabled=false;
  $('#download-code').onclick=()=>download('quest.py',r.fullCode.replace('pd.read_csv(io.StringIO(csv_text))',`pd.read_csv('${r.filename}')`),'text/x-python');$('#download-data').onclick=()=>download(r.filename,r.csv,'text/csv');
  $('#feedback').className='success';$('#feedback').textContent=stage===0?'잘했어요! 이제 명단을 보고 빈칸을 찾아봐요.':'잘했어요! 아래 결과를 천천히 살펴보세요.';
  if(stage===0){$('#find-blanks').onclick=()=>{
    const missing=Object.entries(r.missing).filter(([,count])=>count>0),el=$('#blank-discovery');el.hidden=false;
    el.innerHTML=`<h3>적혀 있지 않은 칸을 찾았어요.</h3>${missing.map(([column,count])=>`<p><b>${esc(friendlyNames[column]||column)}</b>가 비어 있는 기록이 전체 명단에 <b>${count}${b.unit}</b> 있어요.</p>`).join('')}${r.blankExample?friendlyTable(r.blankExample):''}<p class="word-discovery">새 단어 하나만!<br><b>빈칸 = 결측치</b><br>‘값이 빠져 있다’는 뜻이에요. 지금은 ‘빈칸’이라고 불러도 괜찮아요.</p>`;
    gameDiscovery();
    $('#find-blanks').hidden=true;$('#code-panel').hidden=false;$('#quiz').innerHTML='<div class="quiz"><p>명단을 열고 빈칸을 찾았어요. 첫 번째 탐험 성공!</p><button class="primary" id="next">이제 빈칸을 채워볼까요? →</button></div>';$('#next').onclick=()=>{completeStage();stage=1;renderLab();};refreshSceneActions();
  };}else renderQuiz();
  gameResult();
}
function completeStage(){if(!progress[current].includes(stage))progress[current].push(stage);progress[current].sort();persist();gameReward();}
function renderQuiz(){
  if(current===0){renderAdventureTask();return;}
  const question=stage===1?['평균으로 채운 값은 실제 값을 알아낸 걸까요?',['아니요. 비어 있는 자리에 대신 넣은 값이에요.','네. 실제 값을 정확히 알아냈어요.'],0]:stage===2?['공부할 때 보여주지 않은 기록은 어디에 쓸까요?',['얼마나 잘 배웠는지 확인하는 데 써요.','필요 없으니 버려요.'],0]:current===2?['예상 시간이 실제와 3분 차이 나면, 차이의 크기는?',['3분','30분'],0]:['10개 중 8개를 맞혔다면, 맞힌 비율은?',['80%','8%'],0];
  $('#quiz').innerHTML=`<div class="quiz"><span class="guide-label">잠깐, 함께 생각해봐요</span><p>${question[0]}</p>${question[1].map((answer,i)=>`<button class="secondary" data-answer="${i}">${answer}</button>`).join('')}<p id="quiz-feedback" role="status"></p></div>`;
  document.querySelectorAll('[data-answer]').forEach(button=>button.onclick=()=>{
    if(Number(button.dataset.answer)!==question[2]){$('#quiz-feedback').textContent=['','실제 값을 알아낸 것은 아니에요. 비어 있던 자리에 계산을 위한 값을 넣었어요.','처음 보는 문제도 잘 푸는지 확인하려고 따로 남겨둔 거예요.',current===2?'일찍이든 늦게든 차이의 크기는 3분이에요.':'10개 중 8개는 100개로 생각하면 80개예요.'][stage];return;}
    if(current===0&&stage===3){openPassengerLab();return;}
    completeStage();$('#quiz').innerHTML=`<div class="quiz"><p class="success">✓ ${stage===3?missions[current].badge+' 배지 획득!':'잘 이해했어요. 다음으로 가볼까요?'}</p><button class="primary" id="next">${stage===3?'퀘스트 지도로 돌아가기':'다음으로 →'}</button></div>`;$('#next').onclick=()=>{if(stage===3)map();else{stage++;renderLab();}};refreshSceneActions();
  });
}

$('#sound-toggle').onclick=()=>{soundEnabled=!soundEnabled;$('#sound-toggle').setAttribute('aria-pressed',String(soundEnabled));$('#sound-toggle').textContent=soundEnabled?'효과음 켜짐':'효과음 꺼짐';playChime();};
$('#home').onclick=()=>{if(!busy)map();};$('.brand').onclick=e=>{e.preventDefault();if(!busy)map();};$('#journal').onclick=showTitanicReport;$('#continue').onclick=()=>openMission(0);map();
