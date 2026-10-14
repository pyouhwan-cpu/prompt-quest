'use strict';

const stageEnvironments = [
  // Chapter 0: Titanic (타이타닉)
  [
    { name: '별빛 갑판', place: '타이타닉 · 별빛 갑판', sub: 'STAGE 01 · 승객 명단 조사', image: 'assets/titanic-lumi.png', theme: 'env-deck', mood: 'starry', badge: '📜 명단 수색', item: '승객 명단' },
    { name: '선실 서재 / 기록보관소', place: '타이타닉 · 선실 서재', sub: 'STAGE 02 · 빈칸 데이터 복구', image: 'assets/titanic-pixel.png', theme: 'env-cabin', mood: 'warm-amber', badge: '🔍 결측치 보정', item: '기록 보관함' },
    { name: '중앙 조타실 & 연산실', place: '타이타닉 · 중앙 조타실', sub: 'STAGE 03 · AI 생존 규칙 학습', image: 'assets/titanic-pixel.png', theme: 'env-engine', mood: 'cyan-matrix', badge: '⚡ 머신러닝 학습', item: '규칙 분석기' },
    { name: '새벽 바다 & 구명보트 갑판', place: '타이타닉 · 새벽 바다', sub: 'STAGE 04 · 최후의 생존자 대조', image: 'assets/titanic-lumi.png', theme: 'env-dawn', mood: 'misty-blue', badge: '🎯 생존 확률 판정', item: '비교 보고서' }
  ],
  // Chapter 1: Store VIP (백화점 VIP)
  [
    { name: '로비 안내 데스크', place: '백화점 · 1층 로비', sub: 'STAGE 01 · 고객 장부 열기', image: 'assets/store-lumi.png', theme: 'env-store-lobby', mood: 'neon-purple', badge: '🛍️ 장부 조사', item: '고객 수첩' },
    { name: 'VIP 라운지 서재', place: '백화점 · VIP 라운지', sub: 'STAGE 02 · 결측치 & 표준화', image: 'assets/store-pixel.png', theme: 'env-store-vip', mood: 'warm-gold', badge: '✨ 데이터 스케일링', item: '구매 장부' },
    { name: '마케팅 데이터 연구실', place: '백화점 · 분석 연구실', sub: 'STAGE 03 · 로지스틱 회귀 학습', image: 'assets/store-pixel.png', theme: 'env-store-lab', mood: 'cyan-matrix', badge: '📊 VIP 분류 모델', item: '분류 분석기' },
    { name: '내일의 초대장 발송실', place: '백화점 · VIP 연회장', sub: 'STAGE 04 · VIP 적중률 확인', image: 'assets/store-lumi.png', theme: 'env-store-party', mood: 'golden-celebration', badge: '💌 최종 검증', item: '초대 명단' }
  ],
  // Chapter 2: Smart Navigation (스마트 내비게이션)
  [
    { name: '비 내리는 심야 차고', place: '도시 · 야간 차고', sub: 'STAGE 01 · 이동 일지 조사', image: 'assets/city-lumi.png', theme: 'env-city-garage', mood: 'rainy-night', badge: '🌧️ 일지 수색', item: '이동 일지' },
    { name: '차량 관제 모니터링 룸', place: '도시 · 통합 관제실', sub: 'STAGE 02 · 이상치 & 결측치 정제', image: 'assets/city-pixel.png', theme: 'env-city-control', mood: 'cyber-orange', badge: '🔧 데이터 정제', item: '주행 로그' },
    { name: '알고리즘 관제탑', place: '도시 · 알고리즘 센터', sub: 'STAGE 03 · 이동시간 회귀 학습', image: 'assets/city-pixel.png', theme: 'env-city-algo', mood: 'cyan-matrix', badge: '🏎️ 회귀 모델 훈련', item: '네비 엔진' },
    { name: '심야 고속도로 주행', place: '도시 · 심야 고속도로', sub: 'STAGE 04 · 도착 시간 오차 대조', image: 'assets/city-lumi.png', theme: 'env-city-highway', mood: 'speed-lines', badge: '⏱️ MAE 오차 확인', item: '도착 시뮬레이터' }
  ]
];

const questScenes = [
  { image: 'assets/titanic-lumi.png', place: '타이타닉 · 별빛 갑판', chapter: '별빛 아래 남겨진 명단', npc: '기록관 레오', icon: '◈', color: '#f3cc87', item: '승객 명단', desc: '별빛이 내려앉은 갑판. 낡은 명단 속 작은 빈칸에서 탐정의 첫 이야기가 시작됩니다.', intro: [['lumi', '안녕! 나는 여우 탐정 루미. 승객 명단을 찾았어! 누가 배에 탔는지 5명만 먼저 펼쳐보자!']] },
  { image: 'assets/store-lumi.png', place: '백화점 · 불 켜진 안내 데스크', chapter: '다음 VIP를 찾아서', npc: '매니저 유나', icon: '◇', color: '#d6b2ed', item: '고객 수첩', desc: '문을 닫은 백화점에 도착한 작은 의뢰. 손님들이 남긴 기록에서 다음 VIP의 단서를 찾아요.', intro: [['lumi', '안녕! 고객 수첩을 발견했어. 누가 얼마나 자주 방문했는지 발자취를 읽어보자!']] },
  { image: 'assets/city-lumi.png', place: '도시 · 야간 모빌리티 차고', chapter: '도착 시간을 부탁해', npc: '엔지니어 준', icon: '⌖', color: '#91d4dd', item: '이동 일지', desc: '비 내리는 도시, 늦은 밤의 차고. 지난 이동 기록을 단서 삼아 목적지까지 걸리는 시간을 알아봐요.', intro: [['lumi', '안녕! 심야 이동 일지를 찾았어. 지난번 얼마나 멀리 달렸는지 일지부터 펼쳐보자!']] }
];

let dialogueState = null, dialogueTimer = null, soundEnabled = false, soundContext = null;
const storySeen = [[], [], []];
let lastRenderedStage = -1;

function stopDialogue() {
  clearInterval(dialogueTimer);
  dialogueTimer = null;
  dialogueState = null;
}

function playChime(success = false) {
  if (!soundEnabled) return;
  try {
    soundContext ??= new (window.AudioContext || window.webkitAudioContext)();
    soundContext.resume().catch(() => {});
    const now = soundContext.currentTime;
    [0, 1, ...(success ? [2, 3] : [])].forEach((n) => {
      const tone = soundContext.createOscillator(), gain = soundContext.createGain();
      tone.type = success ? 'triangle' : 'square';
      tone.frequency.value = [523.25, 659.25, 783.99, 1046.5][n];
      gain.gain.setValueAtTime(.03, now + n * .08);
      gain.gain.exponentialRampToValueAtTime(.001, now + n * .08 + .15);
      tone.connect(gain);
      gain.connect(soundContext.destination);
      tone.start(now + n * .08);
      tone.stop(now + n * .08 + .16);
    });
  } catch {}
}

function updateGameHud() {
  const count = Math.min(progress[0].length, 4) + (titanicFinished ? 1 : 0);
  $('#game-xp').textContent = `✦ ${count} / 5 발견`;
  $('#level').textContent = titanicFinished ? '생존 확률 탐정' : '타이타닉 · 탐정 수련 중';
}

function renderQuestMap() {
  updateGameHud();
  const count = progress.filter(p => p.length === 4).length;
  $('#cards').innerHTML = questScenes.map((scene, i) => `
    <article class="card quest-card">
      <button class="quest-image-button" data-mission="${i}" aria-label="${esc(missions[i].title)} 시작">
        <img src="${scene.image}" alt="${esc(scene.place)}의 도트 그래픽 게임 장면" loading="lazy">
        <span class="quest-num">CHAPTER 0${i + 1}</span>
        <span class="badge">${progress[i].length === 4 ? '✦ 모험 완료' : `${progress[i].length} / 4 발견`}</span>
      </button>
      <div class="card-body">
        <span class="tag">${scene.place}</span>
        <h3>${scene.chapter}</h3>
        <p>${scene.desc}</p>
        <div class="quest-track" aria-label="${progress[i].length}단계 완료">
          ${steps.map((name, j) => `<span class="${progress[i].includes(j) ? 'earned' : ''}" title="${name}">${progress[i].includes(j) ? '✦' : '◇'}</span>`).join('')}
          <small>대화를 따라 한 걸음씩</small>
        </div>
        <button class="card-action" data-mission="${i}">
          <span>${progress[i].length ? '이야기 이어가기' : '이곳으로 떠나기'}</span>
          <span>→</span>
        </button>
      </div>
    </article>`).join('');
  $('#overall').textContent = `${count} / 3 이야기 완료`;
  document.querySelectorAll('[data-mission]').forEach(button => button.onclick = () => {
    playChime();
    openMission(Number(button.dataset.mission));
  });
}

function speakerMarkup(speaker) {
  const emotion = ['💡', '🔍', '⚡', '🎯', '✨'][Math.floor(Math.random() * 5)];
  if (speaker === 'lumi') {
    return `<div class="portrait-box"><img class="lumi-portrait" src="assets/lumi-portrait.png" alt="청록 목도리를 두른 여우 탐정 루미"><span class="emotion-bubble">${emotion}</span></div>`;
  }
  return `<div class="portrait-box"><span class="human-portrait" aria-hidden="true" style="--portrait:url('${questScenes[current].image}')"></span><span class="emotion-bubble">💬</span></div>`;
}

function stageLines() {
  if (stage === 0) return questScenes[current].intro;
  return storyLessons[current][stage - 1];
}

function setDialogue(lines, onDone, label) {
  stopDialogue();
  dialogueState = { lines, index: 0, onDone, label, typing: false, text: '', shown: 0 };
  $('#dialogue-log').innerHTML = lines.map(([who, line]) => `<p><b>${who === 'lumi' ? '루미' : questScenes[current].npc}</b> ${esc(line)}</p>`).join('');
  showDialogueLine();
}

function showDialogueLine() {
  const state = dialogueState;
  if (!state) return;
  const [who, line] = state.lines[state.index];
  state.text = line;
  state.shown = 0;
  $('#speaker-name').textContent = who === 'lumi' ? '루미 · 여우 탐정' : questScenes[current].npc;
  $('#speaker-portrait').innerHTML = speakerMarkup(who);
  $('#dialogue-count').textContent = `${state.index + 1} / ${state.lines.length}`;
  $('#dialogue-text').innerHTML = `<span class="sr-only">${esc(line)}</span><span id="typed-line" aria-hidden="true"></span>`;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  state.typing = !reduced;
  if (reduced) {
    $('#typed-line').textContent = line;
    state.shown = line.length;
  } else {
    dialogueTimer = setInterval(() => {
      if (dialogueState !== state || !$('#typed-line')) {
        clearInterval(dialogueTimer);
        return;
      }
      state.shown = Math.min(state.shown + 3, line.length);
      $('#typed-line').textContent = line.slice(0, state.shown);
      if (state.shown === line.length) {
        clearInterval(dialogueTimer);
        dialogueTimer = null;
        state.typing = false;
        drawDialogueControls();
      }
    }, 12);
  }
  drawDialogueControls();
}

function drawDialogueControls() {
  const state = dialogueState;
  if (!state) return;
  const last = state.index === state.lines.length - 1;
  $('#dialogue-controls').innerHTML = `
    <button class="${last && !state.typing ? 'primary' : 'secondary'}" id="dialogue-next">
      ${state.typing ? '한 번에 읽기 ▸' : last ? esc(state.label) : '다음 이야기 ▸'}
    </button>
    ${last && !state.typing ? '<button class="soft-choice" id="dialogue-help">처음이라 걱정돼요</button>' : ''}`;
  $('#dialogue-next').onclick = () => {
    if (busy) return;
    playChime();
    if (state.typing) {
      clearInterval(dialogueTimer);
      dialogueTimer = null;
      state.typing = false;
      $('#typed-line').textContent = state.text;
      drawDialogueControls();
      return;
    }
    if (last) {
      const done = state.onDone;
      stopDialogue();
      done();
    } else {
      state.index++;
      showDialogueLine();
    }
  };
  if ($('#dialogue-help')) {
    $('#dialogue-help').onclick = () => {
      if (!busy) setDialogue([['lumi', '버튼 하나만 누르면 내가 옆에서 다 도와줄 테니 걱정 마!']], state.onDone, state.label);
    };
  }
}

function triggerScreenShake() {
  const scene = $('.game-scene');
  if (!scene) return;
  scene.classList.remove('screen-shake');
  void scene.offsetWidth;
  scene.classList.add('screen-shake');
  setTimeout(() => scene.classList.remove('screen-shake'), 400);
}

function triggerFloatingToast(message, icon = '✦') {
  const scene = $('.game-scene');
  if (!scene) return;
  const existing = $('#floating-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'floating-toast';
  toast.className = 'floating-discovery-toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <strong>${esc(message)}</strong>`;
  scene.append(toast);
  setTimeout(() => toast.remove(), 2400);
}

function gameReward() {
  updateGameHud();
  playChime(true);
  triggerScreenShake();
  triggerFloatingToast('의뢰 해결! 발견 배지 획득!', '🏆');
  const scene = $('.game-scene');
  if (scene) {
    scene.classList.remove('reward-flash');
    void scene.offsetWidth;
    scene.classList.add('reward-flash');
  }
  if (stage === 3 && $('#story-mount')) {
    setDialogue([
      ['npc', '단서를 멋지게 찾아냈어요! 오늘의 탐험 성공!'],
      ['lumi', '모험 완료! 수첩에 기록해뒀어. 다음 장소로도 함께 가자!']
    ], map, '다음 모험 고르기 →');
  }
}

function applyStageEnvironment(env) {
  const scene = $('.game-scene');
  if (!scene) return;
  
  // Clean old env classes
  ['env-deck', 'env-cabin', 'env-engine', 'env-dawn',
   'env-store-lobby', 'env-store-vip', 'env-store-lab', 'env-store-party',
   'env-city-garage', 'env-city-control', 'env-city-algo', 'env-city-highway'
  ].forEach(cls => scene.classList.remove(cls));
  scene.classList.add(env.theme);

  const art = $('.scene-art');
  if (art && art.src !== env.image) {
    art.src = env.image;
  }

  const loc = $('.scene-location strong');
  if (loc) loc.textContent = env.place;

  const obj = $('.scene-objective strong');
  if (obj) obj.textContent = steps[stage];

  const itemBtn = $('#scene-item');
  if (itemBtn) itemBtn.innerHTML = `<span>!</span>${env.item} 살펴보기`;

  const badge = $('#stage-badge-indicator');
  if (badge) badge.textContent = env.badge;
}

function triggerStageTransition(targetStage, onComplete) {
  const env = stageEnvironments[current]?.[targetStage] || stageEnvironments[0][0];
  const scene = $('.game-scene');
  if (!scene) {
    if (onComplete) onComplete();
    return;
  }

  playChime(true);
  applyStageEnvironment(env);

  const overlay = document.createElement('div');
  overlay.className = 'stage-cutscene-overlay';
  overlay.innerHTML = `
    <div class="cutscene-bar cutscene-bar-top"></div>
    <div class="cutscene-center">
      <span class="cutscene-badge">✦ CHAPTER 0${current + 1} · ${env.sub}</span>
      <h2 class="cutscene-title">${env.name}</h2>
      <p class="cutscene-place">${env.badge} &nbsp;·&nbsp; ${env.place}</p>
    </div>
    <div class="cutscene-bar cutscene-bar-bottom"></div>
  `;
  scene.append(overlay);

  setTimeout(() => {
    overlay.classList.add('cutscene-fadeout');
    setTimeout(() => {
      overlay.remove();
      if (onComplete) onComplete();
    }, 300);
  }, 950);
}

function mountStoryScene() {
  const env = stageEnvironments[current]?.[stage] || stageEnvironments[0][0];
  const target = $('#story-mount');

  target.innerHTML = `
    <section class="game-scene ${env.theme}" aria-label="${esc(env.place)}">
      <img class="scene-art" src="${env.image}" alt="${esc(env.place)} 배경 도트 그래픽">
      <div class="scene-vignette"></div>
      <div class="scene-ambient-overlay"></div>
      <div class="scene-toolbar">
        <button class="scene-tool" id="scene-back">← 모험 지도</button>
        <div id="scene-steps"></div>
        <div class="scene-tools">
          <span class="scene-badge-indicator" id="stage-badge-indicator">${env.badge}</span>
          <button class="scene-tool" id="scene-notebook" data-scene-control aria-expanded="false">▤ 수첩</button>
          <button class="scene-tool" id="scene-code" data-scene-control>⌘ 코드</button>
          <button class="scene-tool" id="scene-fullscreen" data-scene-control>⛶ 크게 보기</button>
        </div>
      </div>
      <div class="scene-location">
        <span>CHAPTER 0${current + 1}</span>
        <strong>${env.place}</strong>
      </div>
      <div class="scene-objective">
        <span>지금의 작은 목표</span>
        <strong>${steps[stage]}</strong>
      </div>
      <div class="scene-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <button class="scene-item" id="scene-item"><span>!</span>${env.item} 살펴보기</button>
      <div id="scene-window-slot"></div>
      <section class="dialogue-box" aria-label="캐릭터 대화">
        <div id="speaker-portrait" class="speaker-portrait"></div>
        <div class="dialogue-main">
          <div class="speaker-line">
            <b id="speaker-name"></b>
            <span id="dialogue-count"></span>
            <button class="dialogue-replay" id="dialogue-replay">대화 다시 보기 ↺</button>
          </div>
          <p id="dialogue-text" aria-live="polite"></p>
          <div class="dialogue-controls" id="dialogue-controls"></div>
          <details class="dialogue-log">
            <summary>지난 대화 보기</summary>
            <div id="dialogue-log"></div>
          </details>
        </div>
      </section>
      <span id="scene-status" class="sr-only" role="status"></span>
    </section>`;

  $('#scene-steps').append($('#lab>.steps'));
  const workbench = $('#workbench'), workspace = $('#workbench .workspace'), guide = workspace.firstElementChild, record = workspace.lastElementChild, code = $('#code-panel'), quiz = $('#quiz');
  const challenge = document.createElement('div');
  challenge.append(quiz);
  const panes = [guide, record, code, challenge], names = ['action', 'record', 'code', 'challenge'];
  workbench.replaceChildren();
  workbench.className = 'scene-window';
  workbench.setAttribute('aria-label', '탐험 수첩');
  workbench.innerHTML = `
    <div class="scene-window-heading">
      <strong>▤ ${env.item}</strong>
      <button id="scene-close" data-scene-control aria-label="수첩 닫고 장면 보기">✕</button>
    </div>
    <div class="scene-tabs" role="tablist" aria-label="수첩 내용">
      ${['할 일', '발견한 기록', '컴퓨터의 방법', '다음 의뢰'].map((name, i) => `<button id="tab-${names[i]}" role="tab" aria-controls="pane-${names[i]}" aria-selected="false" data-pane="${names[i]}" data-scene-control>${name}</button>`).join('')}
    </div>
    <div class="scene-panes"></div>
    <div class="scene-window-footer">
      <span id="scene-window-hint"></span>
      <button class="primary" id="scene-task-next">계속하기 →</button>
    </div>`;

  panes.forEach((pane, i) => {
    pane.id = 'pane-' + names[i];
    pane.classList.add('scene-pane');
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', 'tab-' + names[i]);
    pane.hidden = true;
    $('#workbench .scene-panes').append(pane);
  });

  code.id = 'code-panel';
  const codeWrapper = document.createElement('div');
  codeWrapper.id = 'pane-code';
  codeWrapper.className = 'scene-pane';
  codeWrapper.setAttribute('role', 'tabpanel');
  codeWrapper.setAttribute('aria-labelledby', 'tab-code');
  code.replaceWith(codeWrapper);
  codeWrapper.append(code);
  code.classList.remove('scene-pane');
  code.hidden = false;
  code.removeAttribute('role');
  code.removeAttribute('aria-labelledby');
  $('#peek').open = true;
  $('#scene-window-slot').append(workbench);

  document.querySelectorAll('[data-pane]').forEach(button => {
    button.onclick = () => openSceneWindow(button.dataset.pane);
    button.onkeydown = event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const available = Array.from(document.querySelectorAll('[data-pane]')).filter(b => !b.disabled);
      const index = available.indexOf(button), next = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length;
      available[next].click();
      available[next].focus();
    };
  });

  $('#scene-close').onclick = closeSceneWindow;
  $('#scene-back').onclick = () => { if (!busy) map(); };
  $('#scene-notebook').onclick = () => openSceneWindow(results[current][stage] ? 'record' : 'action');
  $('#scene-code').onclick = () => openSceneWindow('code');
  $('#scene-fullscreen').onclick = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else {
        $('#scene-status').textContent = '이 브라우저에서는 크게 보기를 지원하지 않아요.';
      }
    } catch {
      $('#scene-status').textContent = '크게 보기를 열지 못했어요. 현재 화면에서 계속 진행할 수 있어요.';
    }
  };

  target.onkeydown = event => {
    if (event.key === 'Escape' && !workbench.hidden) {
      event.preventDefault();
      closeSceneWindow();
    }
  };

  $('#dialogue-replay').onclick = () => { if (!busy) startStageStory(true); };
  $('#scene-item').onclick = () => { if (!busy) unlockWorkbench(true); };
  refreshSceneActions();

  if (!briefingSeen[current]) {
    showBriefing();
  } else {
    // Stage transition animation
    triggerStageTransition(stage, () => {
      startStageStory(false);
    });
  }
}

function openSceneWindow(pane = 'record') {
  if (!$('#workbench')) return;
  if (pane === 'challenge' && !$('#quiz').textContent.trim()) pane = 'record';
  if (pane === 'record' || pane === 'challenge') $('#pane-' + pane).append($('#quiz'));
  $('#workbench').hidden = false;
  document.querySelectorAll('[data-pane]').forEach(button => {
    const selected = button.dataset.pane === pane;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll('.scene-pane').forEach(element => {
    element.hidden = element.id !== 'pane-' + pane;
  });
  if (pane === 'code') $('#peek').open = true;
  $('.game-scene').classList.add('window-open');
  $('#scene-notebook').setAttribute('aria-expanded', 'true');
  refreshSceneActions();
}

function closeSceneWindow() {
  if (!$('#workbench')) return;
  $('#workbench').hidden = true;
  $('.game-scene').classList.remove('window-open');
  $('#scene-notebook').setAttribute('aria-expanded', 'false');
  $('#scene-notebook').focus();
}

function refreshSceneActions() {
  if (!$('#scene-task-next')) return;
  if (passengerMode) {
    refreshPassengerActions();
    return;
  }
  const button = $('#scene-task-next'), hint = $('#scene-window-hint'), ready = Boolean(results[current][stage]);
  $('#tab-challenge').disabled = !$('#quiz').textContent.trim();
  button.disabled = busy;
  if (busy) {
    button.textContent = '계산 중…';
    hint.textContent = '루미가 기록을 살펴보고 있어요.';
    button.onclick = null;
  } else if ($('#next')) {
    button.textContent = $('#next').textContent;
    hint.textContent = '잘했어요! 다음 탐험을 시작해요.';
    button.onclick = () => $('#next').click();
  } else if (!ready) {
    button.textContent = beginner[current].actions[stage] + ' →';
    hint.textContent = '준비되면 부탁해보세요.';
    button.onclick = () => {
      openSceneWindow('action');
      $('#guided-run').click();
    };
  } else if (stage === 0) {
    button.textContent = '빈칸 찾아보기 →';
    hint.textContent = '명단 안의 작은 단서를 찾아요.';
    button.onclick = () => {
      openSceneWindow('record');
      $('#find-blanks')?.click();
    };
  } else {
    button.textContent = $('#investigate')?.textContent || '다음 의뢰 살펴보기 →';
    hint.textContent = '기록을 직접 펼쳐 단서를 찾아요.';
    button.onclick = () => {
      openSceneWindow('challenge');
      $('#investigate')?.click();
    };
  }
}

function startStageStory(replay) {
  closeSceneWindow();
  const seen = storySeen[current][stage] || results[current][stage];
  if (seen && !replay) {
    setDialogue([['lumi', results[current][stage] ? '발견한 내용을 수첩에 정리해뒀어. 함께 살펴보자!' : '준비되면 수첩을 열어봐. 한 번에 하나씩 해보자!']], () => unlockWorkbench(false), '수첩 펼치기 →');
    return;
  }
  setDialogue(stageLines(), () => unlockWorkbench(true), stage === 0 ? '좋아요, 확인해볼게요 →' : '좋아요, 시작해요 →');
}

function unlockWorkbench(autorun) {
  storySeen[current][stage] = true;
  const hasResult = Boolean(results[current][stage]);
  setDialogue([['lumi', hasResult ? '수첩에 결과가 있어. 발견한 단서를 확인해보자!' : '명단을 펼칠게! 결과를 수첩에서 바로 확인해봐.']], () => openSceneWindow(hasResult ? 'record' : 'action'), '수첩 펼치기 →');
  openSceneWindow(hasResult ? 'record' : 'action');
  if (autorun && !hasResult) $('#guided-run').click();
}

function gameResult() {
  if (!$('#story-mount')) return;
  storySeen[current][stage] = true;
  playChime(true);
  triggerScreenShake();
  triggerFloatingToast(['명단 5명 확인!', '결측치 복구 완료!', 'AI 모델 훈련 완료!', '봉인 명단 대조 완료!'][stage], '✨');
  const line = [
    '명단을 펼쳤어! 한 줄이 한 사람의 기록이야.',
    '비어 있던 칸을 평균으로 채웠어! 이제 계산이 가능해졌어.',
    '기록에서 생존 규칙을 배웠어! 이제 봉인했던 기록을 열어보자.',
    '봉인한 명단 대조 완료! AI의 예상과 실제 기록을 비교해보자.'
  ][stage];
  setDialogue([['lumi', current === 2 && stage === 0 ? '이동 일지를 펼쳤어! 한 줄이 한 번의 이동이야.' : line]], () => openSceneWindow(stage === 0 ? 'record' : 'challenge'), stage === 0 ? '발견한 기록 보기 →' : '다음 의뢰 살펴보기 →');
  openSceneWindow('record');
}

function gameDiscovery() {
  if (!$('#story-mount')) return;
  playChime(true);
  triggerScreenShake();
  triggerFloatingToast('첫 번째 단서 포착: 결측치!', '🔍');
  setDialogue([['lumi', '단서 발견! 비어 있는 칸을 ‘결측치’라고 해. 평균 나이로 채워야 기록을 살릴 수 있어!']], () => openSceneWindow('record'), '빈칸 확인하기 →');
  openSceneWindow('record');
  $('#pane-record').scrollTop = $('#blank-discovery').offsetTop || 0;
}
