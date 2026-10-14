'use strict';
let passengerTrials=[];
let passengerMode=false;
let titanicFinished=false;
try{titanicFinished=localStorage.getItem('promptQuest.titanicComplete')==='yes';}catch{}
function renderTitanicMap(){
 updateGameHud();
 $('#cards').innerHTML=`<article class="card quest-card titanic-card"><img src="assets/titanic-lumi.png" alt="별빛 갑판에서 기다리는 여우 탐정 루미"><div class="card-body"><span class="tag">한 편으로 끝내는 데이터 탐정 모험 · 입문</span><h3>타이타닉: 마지막 승객의 확률</h3><p>명단을 열고, 빈칸을 정리하고, 예측 모델을 배워요.<br>마지막에는 직접 승객 조건을 바꿔 생존 확률을 비교해요.</p><ol><li>명단에서 단서 찾기</li><li>나이 빈칸과 성별 정리</li><li>공부할 기록과 봉인한 기록 나누기</li><li>처음 보는 기록으로 실력 확인</li><li>새 승객 두 명의 확률 예측 · 탐정 보고서 완성</li></ol><p>${titanicFinished?'✓ 생존 확률 탐험 완료':'마지막 목표: 서로 다른 승객 두 명을 예측하고 비교 결과를 보고서에 남기기'}</p><button class="primary" id="titanic-resume">${progress[0].length?'이어서 탐험하기':'루미와 출항하기'} →</button> <button class="secondary" id="titanic-replay">처음부터 체험하기</button></div></article>`;
 $('#overall').textContent=titanicFinished?'탐정 보고서 완성':`${Math.min(progress[0].length,4)} / 4 준비 단계 · 마지막 확률 실험`;
 $('#titanic-resume').onclick=()=>openMission(0);
 $('#titanic-replay').onclick=()=>{if(busy)return;current=0;stage=0;results[0]=[];storySeen[0]=[];briefingSeen[0]=false;passengerTrials=[];renderLab();};
}
function openPassengerLab(){
 const r=results[0][3];
 if(!r?.passengerProbabilities){$('#quiz-feedback').textContent='먼저 정답 확인을 실행해 모델을 준비해주세요.';return;}
 passengerMode=true;
 openSceneWindow('record');
 $('#result-title').textContent='최종 의뢰 · 새 승객의 생존 확률';
 $('#output').innerHTML=`<p>루미: 이제 네 차례야! 나이·성별·객실 등급을 골라 새 승객을 만들어봐. <b>한 가지 조건만 바꿔</b> 다시 예측하면 비교하기 쉬워.</p><form id="passenger-form" class="passenger-form"><label>나이 <input id="passenger-age" type="number" min="5" max="75" step="1" value="28" required> 살</label><label>성별 <select id="passenger-sex"><option value="female">여성</option><option value="male">남성</option></select></label><label>객실 등급 <select id="passenger-class"><option value="1">1등실</option><option value="2">2등실</option><option value="3">3등실</option></select></label><button class="primary" type="submit">이 승객의 생존 확률 예측하기 →</button></form><p class="gentle-note">학습 명단에 있는 나이 범위인 5~75살에서 실험해요. 실제 승객의 운명을 판단하는 도구는 아니에요.</p><div id="passenger-feedback" role="status"></div><div id="passenger-trials"></div><details class="action-code"><summary>컴퓨터는 확률을 어떻게 구했을까요?</summary><p>앞에서 학습한 모델의 predict_proba()로 생존 클래스의 확률을 구했어요. 정확도는 봉인한 기록 전체에서 맞힌 비율이고, 여기의 확률은 이 승객에 대한 모델의 추정값이에요.</p><pre>${esc(r.probabilityCode)}</pre></details>`;
 $('#quiz').innerHTML='';
 $('#passenger-form').onsubmit=e=>{e.preventDefault();const age=Number($('#passenger-age').value),sex=$('#passenger-sex').value,cabin=Number($('#passenger-class').value),key=`${age}:${sex}:${cabin}`;
  if(!Number.isInteger(age)||age<5||age>75||!Object.hasOwn(r.passengerProbabilities,key)){$('#passenger-feedback').textContent='나이는 5~75 사이의 정수로 입력해주세요.';return;}
  if(passengerTrials.some(t=>t.key===key)){$('#passenger-feedback').textContent='이미 예측한 조건이에요. 나이·성별·객실 중 하나를 바꿔 비교해보세요.';return;}
  passengerTrials.push({key,age,sex,cabin,p:r.passengerProbabilities[key]});
  $('#passenger-feedback').textContent='새 예측을 기록했어요.';drawPassengerTrials();
 };
 drawPassengerTrials();
 setDialogue([['lumi','이번에는 정답을 미리 알 수 없는 새 승객이야. 모델이 추정한 생존 확률을 확인하고, 조건을 하나 바꿔 비교해보자!']],()=>$('#passenger-age').focus(),'승객 조건 고르기 →');
}
function drawPassengerTrials(){
 $('#passenger-trials').innerHTML=passengerTrials.map((t,i)=>`<article class="passenger-result"><b>승객 ${i+1} · ${t.age}살 / ${t.sex==='female'?'여성':'남성'} / ${t.cabin}등실</b><div class="metric">${(t.p*100).toFixed(1)}%<small>모델이 추정한 생존 확률</small></div><meter min="0" max="1" value="${t.p}" aria-label="승객 ${i+1} 생존 확률"></meter><p>생존 여부가 확정됐다는 뜻은 아니에요.</p></article>`).join('');
 if(passengerTrials.length>=2){const a=passengerTrials[0],b=passengerTrials.at(-1);$('#passenger-trials').innerHTML+=`<p class="word-discovery">첫 승객과 마지막 승객의 추정 확률 차이: <b>${(Math.abs(b.p-a.p)*100).toFixed(1)}%p</b><br>조건을 바꾸었을 때 이 모델의 예상이 얼마나 달라지는지 본 거예요. 원인과 결과를 증명한 것은 아니에요.</p>`;
  $('#quiz').innerHTML='<div class="quiz"><span class="guide-label">마지막 의뢰 · 탐정 보고서</span><p>두 승객의 확률을 비교했어요. 루미가 보고서에 적어요: “이 수치는 기록에서 배운 모델의 추정이며, 실제 생존을 보장하지 않는다.”</p><button class="primary" id="finish-report">비교 결과를 보고서에 붙이기 →</button></div>';
  $('#finish-report').onclick=finishTitanic;
 }
 refreshPassengerActions();
}
function refreshPassengerActions(){
 $('#tab-challenge').disabled=passengerTrials.length<2;
 $('#scene-window-hint').textContent=passengerTrials.length<2?`${passengerTrials.length} / 2 승객 예측 · 서로 다른 조건을 비교해요`:'두 승객의 비교 결과를 보고서에 남겨요.';
 $('#scene-task-next').textContent=passengerTrials.length<2?'승객 조건 고르기 ↑':'탐정 보고서 완성하기 →';
 $('#scene-task-next').onclick=()=>{if(passengerTrials.length<2){openSceneWindow('record');$('#pane-record').scrollTop=0;$('#passenger-age').focus();}else{openSceneWindow('challenge');$('#finish-report')?.click();}};
}
function finishTitanic(){
 passengerMode=false;
 titanicFinished=true;completeStage();try{localStorage.setItem('promptQuest.titanicComplete','yes');}catch{}
 const r=results[0][3];
 const report={title:'타이타닉 생존 확률 탐정 보고서',data:'교육용 합성 승객 360명',accuracy:r.metrics.accuracy,testCount:r.testCount,passengers:passengerTrials,date:new Date().toISOString()};
 try{localStorage.setItem('promptQuest.titanicReport',JSON.stringify(report));}catch{}
 $('#quiz').innerHTML=`<div class="quiz"><h2>✦ 생존 확률 탐정 · 의뢰 완료</h2><p>명단 탐색 → 빈칸·성별 정리 → 모델 학습 → 평가 → 새 승객 예측까지 직접 마쳤어요.</p><p>새 승객 ${passengerTrials.length}명의 조건과 추정 확률을 보고서에 남겼어요.</p><p>확률은 모델의 추정이며 확정된 운명이 아니라는 것도 배웠어요.</p><button class="primary" id="next">보고서를 마치고 항구로 →</button><button class="secondary" id="report-download">탐정 보고서 내려받기</button><button class="secondary" id="experiment-again">다른 승객도 예측해보기</button></div>`;
 $('#report-download').onclick=()=>download('titanic-report.json',JSON.stringify(report,null,2),'application/json');
 $('#next').onclick=map;$('#experiment-again').onclick=openPassengerLab;refreshSceneActions();updateGameHud();
 setDialogue([['lumi','의뢰 완료! 기록을 준비하고, 모델의 실력을 확인하고, 새 승객의 확률까지 비교했어. 이제 너도 데이터 탐정이야!']],map,'항구로 돌아가기 →');
}
function showTitanicReport(){
 records();let report;try{report=JSON.parse(localStorage.getItem('promptQuest.titanicReport'));}catch{}
 if(!report)return;
 const panel=document.createElement('section');panel.className='panel';
 panel.innerHTML=`<h2>나의 생존 확률 탐정 보고서</h2><p>학습용 가상 승객 기록 · 기록 대조 정확도 ${(Number(report.accuracy)*100).toFixed(1)}%</p>${report.passengers.map((t,i)=>`<p>승객 ${i+1}: ${esc(t.age)}살 · ${t.sex==='female'?'여성':'남성'} · ${esc(t.cabin)}등실 → 생존 확률 ${(Number(t.p)*100).toFixed(1)}%</p>`).join('')}<p>모델의 추정값이며 실제 생존을 보장하지 않아요.</p>`;
 $('#records').prepend(panel);
}
