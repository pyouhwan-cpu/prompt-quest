'use strict';
function renderAdventureTask(){
 const r=results[0][stage];
 const tasks={
  1:{title:'복구한 명단에 표시 붙이기',text:'나이 빈칸을 채웠어요. 글자로 적힌 성별이 숫자로 어떻게 바뀌는지 살펴봐요.',action:'성별의 숫자 표시 펼치기',reveal:'여성 → 여성 1 · 남성 0<br>남성 → 여성 0 · 남성 1',term:'범주형 인코딩',note:'문자를 컴퓨터가 계산할 수 있는 숫자(0, 1)로 변환하는 원-핫 인코딩이야!',next:'정리한 명단으로 규칙 찾기 →'},
  2:{title:'두 묶음의 명단 확인하기',text:'루미가 기록을 나누어 한 묶음으로만 규칙을 배웠어요.',action:'명단 두 묶음 살펴보기',reveal:`공부한 명단 ${r.trainCount}명 · 봉인한 명단 ${r.testCount}명`,term:'학습·평가 데이터 분할',note:'80%로 공부하고 20%는 공정하게 실력을 평가하기 위해 봉인해뒀어!',next:'봉인한 명단 열러 가기 →'},
  3:{title:'예상과 기록이 다른 단서 조사',text:'봉투 속 기록을 보고 생존 여부를 예상했어요. 실제와 맞는지 대조해봐요.',action:'봉투 속 예상과 실제 기록 대조하기',reveal:table(r.table),term:'모델 평가',note:'미리 숨겨둔 실제 기록과 대조해 얼마나 정확히 맞혔는지 평가하는 단계야!',next:'새 승객의 의뢰 받기 →'}
 };
 const t=tasks[stage];
 if(stage===3){$('#result-title').textContent='봉인한 명단이 열렸어요';$('#output').innerHTML='<p>루미: 예상한 생존 여부와 실제 기록을 대조해 보자!</p>';}
 $('#quiz').innerHTML=`<div class="quiz adventure-task"><span class="guide-label">루미의 의뢰</span><h3>${t.title}</h3><p>${t.text}</p><button class="primary" id="investigate">${t.action} →</button><div id="investigation-result" hidden></div></div>`;
 $('#investigate').onclick=()=>{
  $('#investigate').hidden=true;const el=$('#investigation-result');el.hidden=false;
  if(typeof triggerScreenShake==='function')triggerScreenShake();
  if(typeof playChime==='function')playChime(true);
  if(typeof triggerFloatingToast==='function')triggerFloatingToast(`단서 발견: ${t.term}!`, '🎯');
  el.innerHTML=`<div class="clue-reveal">${t.reveal}</div><p class="word-discovery">이 행동의 이름은 <b>${t.term}</b></p><p>${t.note}</p><button class="primary" id="next">${t.next}</button>`;
  $('#next').onclick=()=>{if(stage===3){openPassengerLab();}else{completeStage();stage++;renderLab();}};
  setDialogue([['lumi',t.note]],()=>$('#next').click(),t.next);refreshSceneActions();
 };
}
