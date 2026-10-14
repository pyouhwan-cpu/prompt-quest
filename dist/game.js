'use strict';
const questScenes = [
  {image:'assets/titanic-lumi.png',place:'타이타닉 · 별빛 갑판',chapter:'별빛 아래 남겨진 명단',npc:'기록관 레오',icon:'◈',color:'#f3cc87',item:'승객 명단',desc:'별빛이 내려앉은 갑판. 낡은 명단 속 작은 빈칸에서 탐정의 첫 이야기가 시작됩니다.',intro:[['npc','탐정님, 어서 오세요. 이 책에 배에 탔던 사람들의 기록이 담겨 있어요.'],['lumi','안녕! 나는 여우 탐정 루미. 냄새 대신 기록에서 단서를 찾지! 먼저 누가 타고 있었는지 살펴보자.'],['npc','우선 다섯 사람의 기록만 같이 볼까요? 책을 펼치는 것부터 시작해요.']]},
  {image:'assets/store-lumi.png',place:'백화점 · 불 켜진 안내 데스크',chapter:'다음 VIP를 찾아서',npc:'매니저 유나',icon:'◇',color:'#d6b2ed',item:'고객 수첩',desc:'문을 닫은 백화점에 도착한 작은 의뢰. 손님들이 남긴 기록에서 다음 VIP의 단서를 찾아요.',intro:[['npc','어서 와요! 오늘은 마케팅 팀의 새 동료가 되어주세요. 함께 살펴볼 고객 수첩이 있어요.'],['lumi','누가 얼마나 자주 왔는지 적혀 있대. 기록을 읽는 것도 훌륭한 첫걸음이야.'],['npc','다음에 VIP가 될 손님은 누구일까요? 먼저 다섯 분의 기록을 펼쳐볼게요.']]},
  {image:'assets/city-lumi.png',place:'도시 · 야간 모빌리티 차고',chapter:'도착 시간을 부탁해',npc:'엔지니어 준',icon:'⌖',color:'#91d4dd',item:'이동 일지',desc:'비 내리는 도시, 늦은 밤의 차고. 지난 이동 기록을 단서 삼아 목적지까지 걸리는 시간을 알아봐요.',intro:[['npc','반가워요! 차는 준비됐는데, 목적지까지 얼마나 걸릴지 궁금하네요.'],['lumi','지난번에 얼마나 멀리, 얼마나 오래 달렸는지 일지에 적혀 있어. 같이 읽어보자!'],['npc','복잡한 수식은 몰라도 괜찮아요. 우선 다섯 번의 이동 기록부터 펼쳐볼까요?']]}
];
let dialogueState=null,dialogueTimer=null,soundEnabled=false,soundContext=null;
const storySeen=[[],[],[]];
function stopDialogue(){clearInterval(dialogueTimer);dialogueTimer=null;dialogueState=null;}
function playChime(success=false){if(!soundEnabled)return;try{soundContext??=new(window.AudioContext||window.webkitAudioContext)();soundContext.resume().catch(()=>{});const now=soundContext.currentTime;[0,1,...(success?[2]:[])].forEach((n)=>{const tone=soundContext.createOscillator(),gain=soundContext.createGain();tone.type='square';tone.frequency.value=[523.25,659.25,783.99][n];gain.gain.setValueAtTime(.025,now+n*.09);gain.gain.exponentialRampToValueAtTime(.001,now+n*.09+.12);tone.connect(gain);gain.connect(soundContext.destination);tone.start(now+n*.09);tone.stop(now+n*.09+.13);});}catch{}}
function updateGameHud(){const count=Math.min(progress[0].length,4)+(titanicFinished?1:0);$('#game-xp').textContent=`✦ ${count} / 5 발견`;$('#level').textContent=titanicFinished?'생존 확률 탐정':'타이타닉 · 탐정 수련 중';}

function renderQuestMap(){
  updateGameHud();const count=progress.filter(p=>p.length===4).length;
  $('#cards').innerHTML=questScenes.map((scene,i)=>`<article class="card quest-card"><button class="quest-image-button" data-mission="${i}" aria-label="${esc(missions[i].title)} 시작"><img src="${scene.image}" alt="${esc(scene.place)}의 도트 그래픽 게임 장면" loading="lazy"><span class="quest-num">CHAPTER 0${i+1}</span><span class="badge">${progress[i].length===4?'✦ 모험 완료':`${progress[i].length} / 4 발견`}</span></button><div class="card-body"><span class="tag">${scene.place}</span><h3>${scene.chapter}</h3><p>${scene.desc}</p><div class="quest-track" aria-label="${progress[i].length}단계 완료">${steps.map((name,j)=>`<span class="${progress[i].includes(j)?'earned':''}" title="${name}">${progress[i].includes(j)?'✦':'◇'}</span>`).join('')}<small>대화를 따라 한 걸음씩</small></div><button class="card-action" data-mission="${i}"><span>${progress[i].length?'이야기 이어가기':'이곳으로 떠나기'}</span><span>→</span></button></div></article>`).join('');
  $('#overall').textContent=`${count} / 3 이야기 완료`;
  document.querySelectorAll('[data-mission]').forEach(button=>button.onclick=()=>{playChime();openMission(Number(button.dataset.mission));});
}
function speakerMarkup(speaker){if(speaker==='lumi')return '<img class="lumi-portrait" src="assets/lumi-portrait.png" alt="청록 목도리를 두른 여우 탐정 루미">';return `<span class="human-portrait" aria-hidden="true" style="--portrait:url('${questScenes[current].image}')"></span>`;}

function stageLines(){
  if(stage===0)return questScenes[current].intro;
  return storyLessons[current][stage-1];
}

function setDialogue(lines,onDone,label){
  stopDialogue();dialogueState={lines,index:0,onDone,label,typing:false,text:'',shown:0};
  $('#dialogue-log').innerHTML=lines.map(([who,line])=>`<p><b>${who==='lumi'?'루미':questScenes[current].npc}</b> ${esc(line)}</p>`).join('');
  showDialogueLine();
}
function showDialogueLine(){
  const state=dialogueState;if(!state)return;
  const [who,line]=state.lines[state.index];state.text=line;state.shown=0;
  $('#speaker-name').textContent=who==='lumi'?'루미 · 여우 탐정':questScenes[current].npc;
  $('#speaker-portrait').innerHTML=speakerMarkup(who);
  $('#dialogue-count').textContent=`${state.index+1} / ${state.lines.length}`;
  $('#dialogue-text').innerHTML=`<span class="sr-only">${esc(line)}</span><span id="typed-line" aria-hidden="true"></span>`;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  state.typing=!reduced;
  if(reduced){$('#typed-line').textContent=line;state.shown=line.length;}else{
    dialogueTimer=setInterval(()=>{if(dialogueState!==state||!$('#typed-line')){clearInterval(dialogueTimer);return;}state.shown=Math.min(state.shown+2,line.length);$('#typed-line').textContent=line.slice(0,state.shown);if(state.shown===line.length){clearInterval(dialogueTimer);dialogueTimer=null;state.typing=false;drawDialogueControls();}},24);
  }
  drawDialogueControls();
}
function drawDialogueControls(){
  const state=dialogueState;if(!state)return;
  const last=state.index===state.lines.length-1;
  $('#dialogue-controls').innerHTML=`<button class="${last&&!state.typing?'primary':'secondary'}" id="dialogue-next">${state.typing?'한 번에 읽기 ▸':last?esc(state.label):'다음 이야기 ▸'}</button>${last&&!state.typing?'<button class="soft-choice" id="dialogue-help">처음이라 걱정돼요</button>':''}`;
  $('#dialogue-next').onclick=()=>{
    if(busy)return;playChime();
    if(state.typing){clearInterval(dialogueTimer);dialogueTimer=null;state.typing=false;$('#typed-line').textContent=state.text;drawDialogueControls();return;}
    if(last){const done=state.onDone;stopDialogue();done();}else{state.index++;showDialogueLine();}
  };
  if($('#dialogue-help'))$('#dialogue-help').onclick=()=>{if(!busy)setDialogue([['lumi','처음엔 책을 펼치고 빈칸 하나를 찾는 것만으로 충분해. 버튼을 누르면 내가 옆에서 도와줄게. 틀려도 다시 해보면 돼!']],state.onDone,state.label);};
}
function gameReward(){
  updateGameHud();playChime(true);
  const scene=$('.game-scene');if(scene){scene.classList.remove('reward-flash');void scene.offsetWidth;scene.classList.add('reward-flash');}
  if(stage===3&&$('#story-mount')){setDialogue([['npc','덕분에 기록 속 단서를 찾았어요. 오늘의 의뢰를 멋지게 끝냈네요!'],['lumi','모험 완료! 발견한 내용과 배지는 탐험 수첩에 남겨뒀어. 다음 세상에서도 같이 모험하자!']],map,'다음 모험 고르기 →');}
}

function mountStoryScene(){
  const scene=questScenes[current],target=$('#story-mount');
  target.innerHTML=`<section class="game-scene" aria-label="${esc(scene.place)}"><img class="scene-art" src="${scene.image}" alt="${esc(scene.place)}에서 안내 캐릭터와 여우 탐정 루미이 기다리고 있어요."><div class="scene-vignette"></div><div class="scene-toolbar"><button class="scene-tool" id="scene-back">← 모험 지도</button><div id="scene-steps"></div><div class="scene-tools"><button class="scene-tool" id="scene-notebook" data-scene-control aria-expanded="false">▤ 수첩</button><button class="scene-tool" id="scene-code" data-scene-control>⌘ 코드</button><button class="scene-tool" id="scene-fullscreen" data-scene-control>⛶ 크게 보기</button></div></div><div class="scene-location"><span>CHAPTER 0${current+1}</span><strong>${scene.place}</strong></div><div class="scene-objective"><span>지금의 작은 목표</span><strong>${steps[stage]}</strong></div><div class="scene-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i></div><button class="scene-item" id="scene-item"><span>!</span>${scene.item} 살펴보기</button><div id="scene-window-slot"></div><section class="dialogue-box" aria-label="캐릭터 대화"><div id="speaker-portrait" class="speaker-portrait"></div><div class="dialogue-main"><div class="speaker-line"><b id="speaker-name"></b><span id="dialogue-count"></span><button class="dialogue-replay" id="dialogue-replay">대화 다시 보기 ↺</button></div><p id="dialogue-text" aria-live="polite"></p><div class="dialogue-controls" id="dialogue-controls"></div><details class="dialogue-log"><summary>지난 대화 보기</summary><div id="dialogue-log"></div></details></div></section><span id="scene-status" class="sr-only" role="status"></span></section>`;
  $('#scene-steps').append($('#lab>.steps'));
  const workbench=$('#workbench'),workspace=$('#workbench .workspace'),guide=workspace.firstElementChild,record=workspace.lastElementChild,code=$('#code-panel'),quiz=$('#quiz');
  const challenge=document.createElement('div');challenge.append(quiz);
  const panes=[guide,record,code,challenge],names=['action','record','code','challenge'];
  workbench.replaceChildren();workbench.className='scene-window';workbench.setAttribute('aria-label','탐험 수첩');
  workbench.innerHTML=`<div class="scene-window-heading"><strong>▤ ${scene.item}</strong><button id="scene-close" data-scene-control aria-label="수첩 닫고 장면 보기">✕</button></div><div class="scene-tabs" role="tablist" aria-label="수첩 내용">${['할 일','발견한 기록','컴퓨터의 방법','다음 의뢰'].map((name,i)=>`<button id="tab-${names[i]}" role="tab" aria-controls="pane-${names[i]}" aria-selected="false" data-pane="${names[i]}" data-scene-control>${name}</button>`).join('')}</div><div class="scene-panes"></div><div class="scene-window-footer"><span id="scene-window-hint"></span><button class="primary" id="scene-task-next">계속하기 →</button></div>`;
  panes.forEach((pane,i)=>{pane.id='pane-'+names[i];pane.classList.add('scene-pane');pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','tab-'+names[i]);pane.hidden=true;$('#workbench .scene-panes').append(pane);});
  // Preserve the code-panel ID used by analysis updates inside its tab panel.
  code.id='code-panel';const codeWrapper=document.createElement('div');codeWrapper.id='pane-code';codeWrapper.className='scene-pane';codeWrapper.setAttribute('role','tabpanel');codeWrapper.setAttribute('aria-labelledby','tab-code');code.replaceWith(codeWrapper);codeWrapper.append(code);code.classList.remove('scene-pane');code.hidden=false;code.removeAttribute('role');code.removeAttribute('aria-labelledby');
  $('#peek').open=true;
  $('#scene-window-slot').append(workbench);
  document.querySelectorAll('[data-pane]').forEach(button=>{button.onclick=()=>openSceneWindow(button.dataset.pane);button.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const available=Array.from(document.querySelectorAll('[data-pane]')).filter(b=>!b.disabled);const index=available.indexOf(button),next=event.key==='Home'?0:event.key==='End'?available.length-1:(index+(event.key==='ArrowRight'?1:-1)+available.length)%available.length;available[next].click();available[next].focus();};});
  $('#scene-close').onclick=closeSceneWindow;
  $('#scene-back').onclick=()=>{if(!busy)map();};
  $('#scene-notebook').onclick=()=>openSceneWindow(results[current][stage]?'record':'action');
  $('#scene-code').onclick=()=>openSceneWindow('code');
  $('#scene-fullscreen').onclick=async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else if(target.requestFullscreen){await target.requestFullscreen();}else{$('#scene-status').textContent='이 브라우저에서는 크게 보기를 지원하지 않아요.';}}catch{$('#scene-status').textContent='크게 보기를 열지 못했어요. 현재 화면에서 계속 진행할 수 있어요.';}};
  target.onkeydown=event=>{if(event.key==='Escape'&&!workbench.hidden){event.preventDefault();closeSceneWindow();}};
  $('#dialogue-replay').onclick=()=>{if(!busy)startStageStory(true);};
  $('#scene-item').onclick=()=>{if(!busy)unlockWorkbench(true);};
  refreshSceneActions();startStageStory(false);if(!briefingSeen[current])showBriefing();
}
function openSceneWindow(pane='record'){
  if(!$('#workbench'))return;
  if(pane==='challenge'&&!$('#quiz').textContent.trim())pane='record';
  if(pane==='record'||pane==='challenge')$('#pane-'+pane).append($('#quiz'));
  $('#workbench').hidden=false;
  document.querySelectorAll('[data-pane]').forEach(button=>{const selected=button.dataset.pane===pane;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
  document.querySelectorAll('.scene-pane').forEach(element=>{element.hidden=element.id!=='pane-'+pane;});
  if(pane==='code')$('#peek').open=true;
  $('.game-scene').classList.add('window-open');$('#scene-notebook').setAttribute('aria-expanded','true');
  refreshSceneActions();
}
function closeSceneWindow(){
  if(!$('#workbench'))return;$('#workbench').hidden=true;$('.game-scene').classList.remove('window-open');$('#scene-notebook').setAttribute('aria-expanded','false');$('#scene-notebook').focus();
}
function refreshSceneActions(){
  if(!$('#scene-task-next'))return;
  if(passengerMode){refreshPassengerActions();return;}
  const button=$('#scene-task-next'),hint=$('#scene-window-hint'),ready=Boolean(results[current][stage]);
  $('#tab-challenge').disabled=!$('#quiz').textContent.trim();
  button.disabled=busy;
  if(busy){button.textContent='계산 중…';hint.textContent='루미가 기록을 살펴보고 있어요.';button.onclick=null;}
  else if($('#next')){button.textContent=$('#next').textContent;hint.textContent='잘했어요! 다음 탐험을 시작해요.';button.onclick=()=>$('#next').click();}
  else if(!ready){button.textContent=beginner[current].actions[stage]+' →';hint.textContent='준비되면 부탁해보세요.';button.onclick=()=>{openSceneWindow('action');$('#guided-run').click();};}
  else if(stage===0){button.textContent='빈칸 찾아보기 →';hint.textContent='명단 안의 작은 단서를 찾아요.';button.onclick=()=>{openSceneWindow('record');$('#find-blanks')?.click();};}
  else{button.textContent=$('#investigate')?.textContent||'다음 의뢰 살펴보기 →';hint.textContent='기록을 직접 펼쳐 단서를 찾아요.';button.onclick=()=>{openSceneWindow('challenge');$('#investigate')?.click();};}
}
function startStageStory(replay){
  closeSceneWindow();
  const seen=storySeen[current][stage]||results[current][stage];
  if(seen&&!replay){setDialogue([['lumi',results[current][stage]?'발견한 내용을 수첩에 정리해뒀어. 이 화면에서 함께 살펴보자!':'준비되면 수첩을 열어봐. 한 번에 한 가지씩 해보면 돼.']],()=>unlockWorkbench(false),'수첩 펼치기 →');return;}
  setDialogue(stageLines(),()=>unlockWorkbench(true),stage===0?'좋아요, 같이 볼게요 →':'좋아요, 해볼게요 →');
}
function unlockWorkbench(autorun){
  storySeen[current][stage]=true;
  const hasResult=Boolean(results[current][stage]);
  setDialogue([['lumi',hasResult?'수첩에 결과가 있어. 발견한 단서를 같이 살펴보자!':'좋아, 네가 부탁한 일을 해볼게. 여기 열린 수첩에서 결과를 확인해보자.']],()=>openSceneWindow(hasResult?'record':'action'),'수첩 펼치기 →');
  openSceneWindow(hasResult?'record':'action');
  if(autorun&&!hasResult)$('#guided-run').click();
}
function gameResult(){
  if(!$('#story-mount'))return;
  storySeen[current][stage]=true;playChime(true);
  const line=['명단을 펼쳤어! 한 줄이 한 사람의 기록이야. 수첩에서 빈칸도 같이 찾아보자.','비어 있던 칸을 채웠어. 진짜 값을 알아낸 건 아니고, 계산을 위한 값을 넣은 거야.','기록에서 규칙을 배웠어! 아직 보여주지 않은 기록으로 얼마나 잘 배웠는지 확인해보자.','봉인한 명단을 열었어. 예상과 실제 기록을 대조해보자. 컴퓨터의 예상도 틀릴 수 있다는 단서를 찾을 거야.'][stage];
  setDialogue([['lumi',current===2&&stage===0?'이동 일지를 펼쳤어! 한 줄이 한 번의 이동이야. 수첩에서 빈칸을 같이 찾아보자.':line]],()=>openSceneWindow(stage===0?'record':'challenge'),stage===0?'발견한 기록 보기 →':'다음 의뢰 살펴보기 →');
  openSceneWindow('record');
}
function gameDiscovery(){
  if(!$('#story-mount'))return;
  playChime(true);setDialogue([['lumi','첫 번째 단서 발견! 이렇게 값이 적혀 있지 않은 칸을 ‘결측치’라고 불러. 어려운 이름이지만, 그냥 빈칸이라는 뜻이야.']],()=>openSceneWindow('record'),'빈칸 확인하기 →');
  openSceneWindow('record');
  // Keep the discovered clue near the top inside the notebook, never scroll the page.
  $('#pane-record').scrollTop=$('#blank-discovery').offsetTop||0;
}
