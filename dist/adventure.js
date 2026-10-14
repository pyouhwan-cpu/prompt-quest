'use strict';
function renderAdventureTask(){
 const r=results[0][stage];
 const tasks={
  1:{title:'복구한 명단에 표시 붙이기',text:'나이 빈칸을 채웠어요. 이제 글자로 적힌 성별이 컴퓨터에게 어떻게 전달되는지 살펴봐요.',action:'성별의 숫자 표시 펼치기',reveal:'여성 → 여성 표시 1 · 남성 표시 0<br>남성 → 여성 표시 0 · 남성 표시 1',term:'범주형 인코딩',note:'종류마다 별도의 표시를 붙이는 원-핫 인코딩이에요. get_dummies()가 이 작업을 해요.',next:'정리한 명단으로 규칙 찾기 →'},
  2:{title:'두 묶음의 명단 확인하기',text:'루미가 기록을 나누어 한 묶음으로만 규칙을 배웠어요. 나머지 봉투는 아직 열지 않았어요.',action:'명단 두 묶음 살펴보기',reveal:`공부한 명단 ${r.trainCount}명 · 봉인한 명단 ${r.testCount}명`,term:'학습·평가 데이터 분할',note:'train_test_split()으로 기록을 나눴어요. 학습용 기록과 생존 정답을 함께 보여주는 fit()으로 규칙을 배웠어요. 남겨둔 기록은 다음 의뢰에서 열어요.',next:'봉인한 명단 열러 가기 →'},
  3:{title:'예상과 기록이 다른 단서 조사',text:'봉투 속 기록을 보고 생존 여부를 예상했어요. 실제 기록과 다른 경우도 있는지 한 줄씩 대조해봐요.',action:'봉투 속 예상과 실제 기록 대조하기',reveal:table(r.table),term:'모델 평가',note:'predict()로 예상한 답을 실제 기록과 비교해요. 컴퓨터도 틀릴 수 있으므로, 다음 승객의 확률도 확정된 운명으로 읽으면 안 돼요.',next:'새 승객의 의뢰 받기 →'}
 };
 const t=tasks[stage];
 if(stage===3){$('#result-title').textContent='봉인한 명단이 열렸어요';$('#output').innerHTML='<p>루미: 이 명단은 규칙을 배울 때 보여주지 않았어. 예상한 생존 여부와 실제 기록을 대조해서, 우리 모델이 어떤 실수를 하는지 살펴보자.</p>';}
 $('#quiz').innerHTML=`<div class="quiz adventure-task"><span class="guide-label">루미의 의뢰</span><h3>${t.title}</h3><p>${t.text}</p><button class="primary" id="investigate">${t.action} →</button><div id="investigation-result" hidden></div></div>`;
 $('#investigate').onclick=()=>{
  $('#investigate').hidden=true;const el=$('#investigation-result');el.hidden=false;
  el.innerHTML=`<div class="clue-reveal">${t.reveal}</div><p class="word-discovery">이 행동의 이름은 <b>${t.term}</b></p><p>${t.note}</p><button class="primary" id="next">${t.next}</button>`;
  $('#next').onclick=()=>{if(stage===3){openPassengerLab();}else{completeStage();stage++;renderLab();}};
  setDialogue([['lumi',t.note]],()=>$('#next').click(),t.next);refreshSceneActions();
 };
}
