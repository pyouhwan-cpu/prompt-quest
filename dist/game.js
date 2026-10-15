'use strict';

const stageEnvironments = [
  // Chapter 0: Titanic (타이타닉)
  [
    { name: '별빛 갑판', place: '타이타닉 · 별빛 갑판', sub: 'CASE 01 · 승객 명단의 빈칸 사건', image: 'assets/titanic-lumi.png', theme: 'env-deck', mood: 'starry', badge: '📜 결측치 수사', item: '승객 명단' },
    { name: '선실 서재 / 기록보관소', place: '타이타닉 · 선실 서재', sub: 'CASE 02 · 컴퓨터의 비밀 암호', image: 'assets/titanic-pixel.png', theme: 'env-cabin', mood: 'warm-amber', badge: '⚡ 인코딩 수사', item: '기록 보관함' },
    { name: '중앙 조타실 & 연산실', place: '타이타닉 · 중앙 조타실', sub: 'CASE 03 · 8:2 비밀 모의고사', image: 'assets/titanic-pixel.png', theme: 'env-engine', mood: 'cyan-matrix', badge: '🔒 분할·학습 수사', item: '규칙 분석기' },
    { name: '새벽 바다 & 구명보트 갑판', place: '타이타닉 · 새벽 바다', sub: 'CASE 04 · 최후의 생존자 추리', image: 'assets/titanic-lumi.png', theme: 'env-dawn', mood: 'misty-blue', badge: '🎯 AI 예측 & 빙산 결전', item: '비교 보고서' }
  ],
  // Chapter 1: Store VIP (백화점 VIP)
  [
    { name: '로비 안내 데스크', place: '백화점 · 1층 로비', sub: 'CASE 01 · 고객 장부 열기', image: 'assets/store-lumi.png', theme: 'env-store-lobby', mood: 'neon-purple', badge: '🛍️ 장부 조사', item: '고객 수첩' },
    { name: 'VIP 라운지 서재', place: '백화점 · VIP 라운지', sub: 'CASE 02 · 결측치 & 표준화', image: 'assets/store-pixel.png', theme: 'env-store-vip', mood: 'warm-gold', badge: '✨ 데이터 스케일링', item: '구매 장부' },
    { name: '마케팅 데이터 연구실', place: '백화점 · 분석 연구실', sub: 'CASE 03 · 로지스틱 회귀 학습', image: 'assets/store-pixel.png', theme: 'env-store-lab', mood: 'cyan-matrix', badge: '📊 VIP 분류 모델', item: '분류 분석기' },
    { name: '내일의 초대장 발송실', place: '백화점 · VIP 연회장', sub: 'CASE 04 · VIP 적중률 확인', image: 'assets/store-lumi.png', theme: 'env-store-party', mood: 'golden-celebration', badge: '💌 최종 검증', item: '초대 명단' }
  ],
  // Chapter 2: Smart Navigation (스마트 내비게이션)
  [
    { name: '비 내리는 심야 차고', place: '도시 · 야간 차고', sub: 'CASE 01 · 이동 일지 조사', image: 'assets/city-lumi.png', theme: 'env-city-garage', mood: 'rainy-night', badge: '🌧️ 일지 수색', item: '이동 일지' },
    { name: '차량 관제 모니터링 룸', place: '도시 · 통합 관제실', sub: 'CASE 02 · 이상치 & 결측치 정제', image: 'assets/city-pixel.png', theme: 'env-city-control', mood: 'cyber-orange', badge: '🔧 데이터 정제', item: '주행 로그' },
    { name: '알고리즘 관제탑', place: '도시 · 알고리즘 센터', sub: 'CASE 03 · 이동시간 회귀 학습', image: 'assets/city-pixel.png', theme: 'env-city-algo', mood: 'cyan-matrix', badge: '🏎️ 회귀 모델 훈련', item: '네비 엔진' },
    { name: '심야 고속도로 주행', place: '도시 · 심야 고속도로', sub: 'CASE 04 · 도착 시간 오차 대조', image: 'assets/city-lumi.png', theme: 'env-city-highway', mood: 'speed-lines', badge: '⏱️ MAE 오차 확인', item: '도착 시뮬레이터' }
  ]
];

const questScenes = [
  { image: 'assets/titanic-lumi.png', place: '타이타닉 · 별빛 갑판', chapter: '타이타닉: 마지막 승객의 확률', npc: '기록관 레오', icon: '◈', color: '#f3cc87', item: '승객 명단', desc: '1912년 타이타닉의 승객 기록을 조사하고, AI와 함께 생존 규칙을 추리하는 모험입니다.', intro: [['lumi', '안녕! 나는 여우 탐정 루미. 승객 명단을 입수했어! 수사 보드를 보며 단서를 하나씩 풀어보자!']] },
  { image: 'assets/store-lumi.png', place: '백화점 · 불 켜진 안내 데스크', chapter: '다음 VIP를 찾아서', npc: '매니저 유나', icon: '◇', color: '#d6b2ed', item: '고객 수첩', desc: '문을 닫은 백화점에 도착한 의뢰. 지난 구매 기록에서 다음 VIP 고객을 예측합니다.', intro: [['lumi', '안녕! 고객 수첩을 입수했어. 수사 보드를 보며 단서를 하나씩 풀어보자!']] },
  { image: 'assets/city-lumi.png', place: '도시 · 야간 모빌리티 차고', chapter: '도착 시간을 부탁해', npc: '엔지니어 준', icon: '⌖', color: '#91d4dd', item: '이동 일지', desc: '비 내리는 도시의 주행 일지에서 목적지까지 걸리는 시간을 예측하는 모험입니다.', intro: [['lumi', '안녕! 심야 이동 일지를 입수했어. 수사 보드를 보며 단서를 하나씩 풀어보자!']] }
];

let dialogueState = null, dialogueTimer = null, soundEnabled = true, soundContext = null;
const storySeen = [[], [], []];

function stopDialogue() {
  clearInterval(dialogueTimer);
  dialogueTimer = null;
  dialogueState = null;
}

function initAudio() {
  try {
    soundContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (soundContext.state === 'suspended') {
      soundContext.resume().catch(() => {});
    }
  } catch {}
}

function playSfx(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!soundContext) return;
    const ctx = soundContext;
    const now = ctx.currentTime;
    
    if (type === 'stamp') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      const slap = ctx.createOscillator(), sGain = ctx.createGain();
      slap.type = 'triangle';
      slap.frequency.setValueAtTime(900, now);
      slap.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      sGain.gain.setValueAtTime(0.2, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      slap.connect(sGain);
      sGain.connect(ctx.destination);
      slap.start(now);
      slap.stop(now + 0.08);
    } else if (type === 'laser') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.13);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'slice') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'lock') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'cannon') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'hit') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'combo') {
      [587.33, 880, 1174.66].forEach((f, idx) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.08, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.11);
      });
    } else if (type === 'victory') {
      [261.63, 329.63, 392.00, 523.25, 659.25].forEach((f, idx) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        const start = now + idx * 0.09;
        const dur = idx === 4 ? 0.5 : 0.15;
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } else {
      playChime(true);
    }
  } catch {}
}

function playChime(success = false) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!soundContext) return;
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
  $('#game-xp').textContent = `✦ ${count} / 5 단서 해결`;
  $('#level').textContent = titanicFinished ? '전설의 데이터 탐정' : '타이타닉 · 수사관';
}

function renderQuestMap() {
  updateGameHud();
  const count = progress.filter(p => p.length === 4).length;
  $('#cards').innerHTML = questScenes.map((scene, i) => `
    <article class="card quest-card">
      <button class="quest-image-button" data-mission="${i}" aria-label="${esc(missions[i].title)} 시작">
        <img src="${scene.image}" alt="${esc(scene.place)}의 도트 그래픽 게임 장면" loading="lazy">
        <span class="quest-num">CHAPTER 0${i + 1}</span>
        <span class="badge">${progress[i].length === 4 ? '✦ 모험 완료' : `${progress[i].length} / 4 수사`}</span>
      </button>
      <div class="card-body">
        <span class="tag">${scene.place}</span>
        <h3>${scene.chapter}</h3>
        <p>${scene.desc}</p>
        <div class="quest-track" aria-label="${progress[i].length}단계 완료">
          ${steps.map((name, j) => `<span class="${progress[i].includes(j) ? 'earned' : ''}" title="${name}">${progress[i].includes(j) ? '✦' : '◇'}</span>`).join('')}
          <small>스토리를 따라 한 걸음씩</small>
        </div>
        <button class="card-action" data-mission="${i}">
          <span>${progress[i].length ? '수사 이어가기' : '이곳으로 떠나기'}</span>
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
      state.shown = Math.min(state.shown + 4, line.length);
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
    </button>`;
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
  triggerFloatingToast('수사 성공! 탐정 배지 획득!', '🏆');
}

function applyStageEnvironment(env) {
  const scene = $('.game-scene');
  if (!scene) return;
  
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
      
      <!-- Top Stage Toolbar -->
      <div class="scene-toolbar">
        <button class="scene-tool" id="scene-back">← 모험 지도</button>
        <div id="scene-steps"></div>
        <div class="scene-tools">
          <span class="scene-badge-indicator" id="stage-badge-indicator">${env.badge}</span>
          <button class="scene-tool" id="scene-notebook" data-scene-control>▤ 수첩 열기</button>
          <button class="scene-tool" id="scene-fullscreen" data-scene-control>⛶ 크게 보기</button>
        </div>
      </div>
      
      <div class="scene-location">
        <span>CHAPTER 0${current + 1}</span>
        <strong>${env.place}</strong>
      </div>
      <div class="scene-objective">
        <span>현재 수사 목표</span>
        <strong>${steps[stage]}</strong>
      </div>
      <div class="scene-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      
      <!-- Central Master Clue Stage -->
      <div class="investigation-stage" id="investigation-stage"></div>

      <div id="scene-window-slot"></div>
      
      <!-- Dialogue Box -->
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
  
  // Clean, optional notebook drawer for users who want to see raw python/data
  const workbench = $('#workbench');
  if (workbench) {
    workbench.className = 'scene-window';
    $('#scene-window-slot').append(workbench);
  }

  $('#scene-back').onclick = () => { if (!busy) map(); };
  $('#scene-notebook').onclick = () => {
    if (workbench) {
      workbench.hidden = !workbench.hidden;
      $('.game-scene').classList.toggle('window-open', !workbench.hidden);
    }
  };
  $('#scene-fullscreen').onclick = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (target.requestFullscreen) {
        await target.requestFullscreen();
      }
    } catch {}
  };

  $('#dialogue-replay').onclick = () => { if (!busy) startStageStory(true); };

  // Render the clear, unified Detective Investigation Board!
  renderInvestigationBoard();

  if (!briefingSeen[current]) {
    showBriefing();
  } else {
    triggerStageTransition(stage, () => {
      startStageStory(false);
    });
  }
}

function renderInvestigationBoard() {
  const mount = $('#investigation-stage');
  if (!mount) return;

  if (current === 0) {
    renderTitanicCaseBoard(mount);
  } else {
    renderGenericCaseBoard(mount);
  }
}

function renderTitanicCaseBoard(mount) {
  if (stage === 0) {
    // ========================================================
    // CASE 01: [EDA 탐색] 승객 360명 전수 조사 & 생존율 충격 발견
    // ========================================================
    let discoveredTabs = new Set(['gender']);

    function getEDAHtml(tab) {
      if (tab === 'gender') {
        return `
          <div class="eda-visual-panel">
            <div class="eda-group-row">
              <span class="eda-group-label">👩 여성 승객 (180명)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill female-fill" style="width: 76.7%;">76.7% 생존 (138명 구조)</div>
              </div>
              <span class="eda-group-stat">76.7%</span>
            </div>
            <div class="eda-group-row">
              <span class="eda-group-label">👨 남성 승객 (180명)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill male-fill" style="width: 23.3%;">23.3% 생존 (42명 구조)</div>
              </div>
              <span class="eda-group-stat">23.3%</span>
            </div>
          </div>
          <div class="deduction-note-card">
            <span class="deduction-icon">💡</span>
            <div class="deduction-body">
              <strong>[탐정 추리 제1호] 성별과 생존율의 결정적 상관관계</strong>
              <p>여성 생존율(76.7%)이 남성(23.3%)의 <b>3.3배 이상</b>에 달합니다! 당시 선원들이 구명보트에 사람을 태울 때 철저하게 지켰던 <b>"여성과 어린이를 먼저(Women and Children First)"</b>라는 실제 역사의 구조 철칙이 데이터에 그대로 각인되어 있습니다.</p>
            </div>
          </div>`;
      } else if (tab === 'cabin') {
        return `
          <div class="eda-visual-panel">
            <div class="eda-group-row">
              <span class="eda-group-label">👑 1등실 (78명)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill p1-fill" style="width: 66.7%;">66.7% 생존 (52명 구조)</div>
              </div>
              <span class="eda-group-stat">66.7%</span>
            </div>
            <div class="eda-group-row">
              <span class="eda-group-label">💼 2등실 (82명)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill p2-fill" style="width: 50.0%;">50.0% 생존 (41명 구조)</div>
              </div>
              <span class="eda-group-stat">50.0%</span>
            </div>
            <div class="eda-group-row">
              <span class="eda-group-label">🎒 3등실 (200명)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill p3-fill" style="width: 23.5%;">23.5% 생존 (47명 구조)</div>
              </div>
              <span class="eda-group-stat">23.5%</span>
            </div>
          </div>
          <div class="deduction-note-card">
            <span class="deduction-icon">💡</span>
            <div class="deduction-body">
              <strong>[탐정 추리 제2호] 객실 등급에 따른 구조 불평등</strong>
              <p>1등실 승객의 생존율(66.7%)이 3등실(23.5%)의 <b>거의 3배</b>입니다! 1등실은 구명보트가 비치된 최상층 갑판(Sun Deck)과 바로 연결되어 있었으나, 3등실은 배 밑바닥 하층부에 위치하여 비상 통로 철문이 닫혀 탈출 기회조차 얻기 어려웠습니다.</p>
            </div>
          </div>`;
      } else {
        return `
          <div class="eda-visual-panel">
            <div class="eda-group-row">
              <span class="eda-group-label">👶 어린이 (15세 미만)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill p1-fill" style="width: 70.5%;">70.5% 생존 (우선 구조)</div>
              </div>
              <span class="eda-group-stat">70.5%</span>
            </div>
            <div class="eda-group-row">
              <span class="eda-group-label">🧑 성인 (15세 이상)</span>
              <div class="eda-bar-track">
                <div class="eda-bar-fill male-fill" style="width: 34.2%;">34.2% 생존</div>
              </div>
              <span class="eda-group-stat">34.2%</span>
            </div>
          </div>
          <div class="deduction-note-card">
            <span class="deduction-icon">💡</span>
            <div class="deduction-body">
              <strong>[탐정 추리 제3호] 어린이 승객 우선 구조의 증거</strong>
              <p>나이가 어린 승객 역시 우선 구조 대상이었습니다. 따라서 생존 여부를 예측하는 데 가장 중요한 3대 특성(Feature)은 <b>[성별, 객실 등급, 나이]</b>로 좁혀졌습니다!</p>
            </div>
          </div>`;
      }
    }

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>📜</span> CASE 01: 승객 360명 전수 조사 & 생존율 충격 발견</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="eda-progress-pill">단서 수집: 1 / 2</span>
            <span class="arcade-score-pill" style="color:#ffd32a;">탐색적 데이터 분석 (EDA)</span>
          </div>
        </div>
        <div class="arcade-goal-banner">
          <span>🎯 <strong>수사 목표:</strong> 아래 탭을 클릭하여 <strong>성별과 객실 등급에 따른 생존율 차이</strong>의 숨겨진 원인을 밝혀내세요!</span>
        </div>
        
        <div class="eda-tabs-bar">
          <button class="eda-tab-btn active" id="tab-gender">👩 vs 👨 성별 기준 생존율</button>
          <button class="eda-tab-btn" id="tab-cabin">👑 객실 등급별 생존율</button>
          <button class="eda-tab-btn" id="tab-age">👶 나이대별 생존율</button>
        </div>

        <div id="eda-content-container">
          ${getEDAHtml('gender')}
        </div>

        <div id="eda-clear-slot" style="margin-top: 8px;">
          <button class="primary" id="btn-to-stage2" style="width:100%; padding:12px; font-size:14px; font-weight:800; background:linear-gradient(90deg, #2ed573, #00d2d3); color:#111;">
            🔍 핵심 생존 원인(성별·등실·나이) 입증 완료! ➔ 제2장: 오염된 기록 복구로 이동 ▶
          </button>
        </div>
      </div>`;

    setDialogue([['lumi', '성별과 등실 탭을 눌러서 생존율 차이를 눈으로 직접 확인해봐!']], () => {}, '조사하기!');

    function switchEda(tab) {
      discoveredTabs.add(tab);
      $('#tab-gender').classList.toggle('active', tab === 'gender');
      $('#tab-cabin').classList.toggle('active', tab === 'cabin');
      $('#tab-age').classList.toggle('active', tab === 'age');
      $('#eda-content-container').innerHTML = getEDAHtml(tab);
      $('#eda-progress-pill').textContent = `단서 수집: ${Math.min(3, discoveredTabs.size)} / 2`;
      playSfx('combo');
    }

    $('#tab-gender').onclick = () => switchEda('gender');
    $('#tab-cabin').onclick = () => switchEda('cabin');
    $('#tab-age').onclick = () => switchEda('age');

    $('#btn-to-stage2').onclick = () => {
      playSfx('victory');
      triggerScreenShake();
      completeStage();
      stage = 1;
      renderLab();
    };

  } else if (stage === 1) {
    // ========================================================
    // CASE 02: [데이터 전처리] 오염된 기록 복구 실험실 & 이진수 인코딩
    // ========================================================
    let missingResolved = false;
    let encodedCount = 0;

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>🔧</span> CASE 02: 오염된 기록 복구 & 이진수 인코딩</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="prep-pill">수사 진행: 0 / 2</span>
            <span class="arcade-score-pill" style="color:#5effd8;">데이터 전처리 (Preprocessing)</span>
          </div>
        </div>
        <div class="arcade-goal-banner">
          <span>🎯 <strong>수사 목표:</strong> 360명 중 48명의 나이(Age)가 비어 있습니다. 기록을 삭제할지, 평균으로 채울지 선택하세요!</span>
        </div>

        <div style="background:#132235; border:1px solid #415e80; border-radius:6px; padding:12px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#ffd32a; font-size:13px;">실험 1: 48명의 나이 결측치(NaN) 처리 딜레마</strong>
            <span style="font-size:11px; color:#8faac4;">전체 360명 중 결측치 48명 (13.3%)</span>
          </div>
          <div style="display:flex; gap:10px;" id="impute-btn-row">
            <button class="secondary" id="btn-drop-rows" style="flex:1; border-color:#ff4757; color:#ff6b81; padding:8px; font-weight:700;">
              ❌ 결측치 48명 통째로 삭제하기 (Row Drop)
            </button>
            <button class="primary" id="btn-impute-mean" style="flex:1; background:linear-gradient(90deg, #2ed573, #1e90ff); padding:8px; font-weight:800; color:#fff;">
              ✅ 승객 평균 나이(39.4세)로 채워넣기 (Mean Imputation)
            </button>
          </div>
          <div id="impute-feedback-slot" style="margin-top:8px;"></div>
        </div>

        <div id="encoding-section" style="opacity:0.4; pointer-events:none; transition:opacity 0.3s;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="color:#5effd8; font-size:13px;">실험 2: 범주형 글자('여성', '남성')를 0과 1 숫자로 원-핫 인코딩</strong>
            <span style="font-size:11px; color:#8faac4;">카드를 클릭해 번역하세요</span>
          </div>
          <div class="binary-cards-grid">
            <div class="binary-flip-card" id="bcard-1" data-flipped="false">
              <div class="binary-card-inner">
                <div class="binary-face-front">
                  <span style="font-size:11px; color:#92a9bf;">승객 #01</span>
                  <strong style="font-size:15px; color:#ff9ff3;">👩 여성 (1등실)</strong>
                  <small style="color:#74b9ff; font-size:10px;">[클릭하여 인코딩 ⚡]</small>
                </div>
                <div class="binary-face-back">
                  <div class="binary-cube-symbol">[ 1, 0 ]</div>
                  <strong style="font-size:11px; color:#5effd8;">Sex_female=1, Sex_male=0</strong>
                  <small style="color:#a8ff78; font-size:10px;">숫자 행렬 변환 완료</small>
                </div>
              </div>
            </div>
            <div class="binary-flip-card" id="bcard-2" data-flipped="false">
              <div class="binary-card-inner">
                <div class="binary-face-front">
                  <span style="font-size:11px; color:#92a9bf;">승객 #02</span>
                  <strong style="font-size:15px; color:#70a1ff;">👨 남성 (3등실)</strong>
                  <small style="color:#74b9ff; font-size:10px;">[클릭하여 인코딩 ⚡]</small>
                </div>
                <div class="binary-face-back male-back">
                  <div class="binary-cube-symbol">[ 0, 1 ]</div>
                  <strong style="font-size:11px; color:#ffd32a;">Sex_female=0, Sex_male=1</strong>
                  <small style="color:#ffa502; font-size:10px;">숫자 행렬 변환 완료</small>
                </div>
              </div>
            </div>
            <div class="binary-flip-card" id="bcard-3" data-flipped="false">
              <div class="binary-card-inner">
                <div class="binary-face-front">
                  <span style="font-size:11px; color:#92a9bf;">승객 #03</span>
                  <strong style="font-size:15px; color:#70a1ff;">👨 남성 (1등실)</strong>
                  <small style="color:#74b9ff; font-size:10px;">[클릭하여 인코딩 ⚡]</small>
                </div>
                <div class="binary-face-back male-back">
                  <div class="binary-cube-symbol">[ 0, 1 ]</div>
                  <strong style="font-size:11px; color:#ffd32a;">Sex_female=0, Sex_male=1</strong>
                  <small style="color:#ffa502; font-size:10px;">숫자 행렬 변환 완료</small>
                </div>
              </div>
            </div>
            <div class="binary-flip-card" id="bcard-4" data-flipped="false">
              <div class="binary-card-inner">
                <div class="binary-face-front">
                  <span style="font-size:11px; color:#92a9bf;">승객 #04</span>
                  <strong style="font-size:15px; color:#ff9ff3;">👩 여성 (2등실)</strong>
                  <small style="color:#74b9ff; font-size:10px;">[클릭하여 인코딩 ⚡]</small>
                </div>
                <div class="binary-face-back">
                  <div class="binary-cube-symbol">[ 1, 0 ]</div>
                  <strong style="font-size:11px; color:#5effd8;">Sex_female=1, Sex_male=0</strong>
                  <small style="color:#a8ff78; font-size:10px;">숫자 행렬 변환 완료</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="prep-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '결측치를 삭제해보고, 평균으로도 채워보면서 차이점을 확인해봐!']], () => {}, '실험하기!');

    $('#btn-drop-rows').onclick = () => {
      playSfx('hit');
      triggerScreenShake();
      $('#impute-feedback-slot').innerHTML = `
        <div style="background:#2d1419; border:1px solid #ff4757; border-radius:4px; padding:8px 12px; font-size:12px; color:#ffb3ba;">
          ⚠️ <strong>치명적 손실 발생:</strong> 나이가 없다고 48명의 승객을 삭제하면, 그 승객들의 귀중한 성별('여성')과 등실('1등실') 데이터까지 영구히 사라져 전체 데이터의 13.3%가 손실됩니다! 우측의 [평균으로 채워넣기]를 선택하세요!
        </div>`;
    };

    $('#btn-impute-mean').onclick = () => {
      if (missingResolved) return;
      missingResolved = true;
      playSfx('stamp');
      triggerScreenShake();
      triggerFloatingToast('39.4세 평균 대체 완료! 승객 360명 100% 보존!', '✨');

      $('#impute-btn-row').innerHTML = `
        <div style="width:100%; background:#103525; border:1px solid #2ed573; border-radius:4px; padding:8px 12px; color:#5effd8; font-size:12px; font-weight:700;">
          ★ 보정 성공: 승객 평균 나이(39.4세)로 빈칸을 채워 데이터 손실을 0%로 완벽 방어했습니다!
        </div>`;
      $('#impute-feedback-slot').innerHTML = '';

      $('#encoding-section').style.opacity = '1';
      $('#encoding-section').style.pointerEvents = 'auto';
      $('#prep-pill').textContent = '수사 진행: 1 / 2';
      setDialogue([['lumi', '잘했어! 이제 아래 카드들을 클릭해서 글자를 컴퓨터용 0과 1 숫자로 번역해줘!']], () => {}, '인코딩!');
    };

    [1, 2, 3, 4].forEach(id => {
      const card = $(`#bcard-${id}`);
      if (!card) return;
      card.onclick = () => {
        if (!missingResolved || card.dataset.flipped === 'true') return;
        card.dataset.flipped = 'true';
        card.classList.add('is-flipped');
        encodedCount++;

        playSfx('laser');
        triggerScreenShake();

        const combo = document.createElement('span');
        combo.className = 'floating-combo-text';
        combo.textContent = `+150 ENCODED!`;
        card.append(combo);

        if (encodedCount === 4) {
          playSfx('victory');
          $('#prep-pill').textContent = '수사 진행: 2 / 2 (완료)';
          triggerFloatingToast('🎉 전 승객 수치형 행렬 변환 완료!', '⚡');
          $('#prep-clear-slot').innerHTML = `
            <div class="arcade-clear-card">
              <div class="clear-title">🏆 STAGE CLEAR! 데이터 전처리 완료</div>
              <p class="clear-insight">
                💡 <b>전처리의 핵심 깨달음:</b><br>
                1. 결측치(Age)를 지우지 않고 평균값으로 채워 <b>데이터 손실을 100% 방지</b>했습니다.<br>
                2. 컴퓨터가 이해하지 못하는 텍스트(Sex)를 <b>[0, 1] 원-핫 인코딩 행렬로 번역</b>하여 AI 알고리즘에 입력할 수 있는 완벽한 수학 테이블을 완성했습니다!
              </p>
              <button class="primary clear-next-btn" id="next-to-stage3">🌲 제3장: 8:2 모의고사 & 의사결정나무 AI 두뇌 훈련 ▶</button>
            </div>`;
          $('#next-to-stage3').onclick = () => {
            completeStage();
            stage = 2;
            renderLab();
          };
          setDialogue([['lumi', '데이터 준비 완료! 이제 AI에게 8:2 비율로 모의고사를 학습시켜보자!']], () => {}, '다음으로!');
        }
      };
    });

  } else if (stage === 2) {
    // ========================================================
    // CASE 03: [모델 학습] 8:2 분할과 의사결정나무(Decision Tree) 성장
    // ========================================================
    let splitRatio = 60;

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>🌲</span> CASE 03: 8:2 비밀 모의고사 & AI 의사결정나무</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="slice-ratio-pill">분할 비율: 60% : 40%</span>
            <span class="arcade-score-pill" style="color:#ffd32a;">과적합(Overfitting) 방지</span>
          </div>
        </div>
        <div class="arcade-goal-banner">
          <span>🎯 <strong>수사 목표:</strong> 정답을 통째로 외우는 과적합을 막기 위해 데이터를 <strong>80% 문제집</strong>과 <strong>20% 시험지</strong>로 나누세요!</span>
        </div>
        <div class="slicer-arena">
          <div class="slice-meter-wrapper">
            <div class="slice-fill-train" id="slice-fill-train" style="width: 60%;">📘 훈련 문제집 60%</div>
            <div class="slice-fill-test" id="slice-fill-test" style="width: 40%;">🔒 시험지 40%</div>
            <div class="slice-laser-line" id="slice-laser-line" style="left: 60%;"></div>
          </div>
          <div class="slice-controls-row">
            <button class="secondary" id="slice-btn-down" style="padding:6px 12px; font-weight:700;">◀ -5%</button>
            <input type="range" min="50" max="95" step="5" value="60" class="slice-range-input" id="slice-slider">
            <button class="secondary" id="slice-btn-up" style="padding:6px 12px; font-weight:700;">+5% ▶</button>
            <span class="slice-target-badge" id="slice-badge">목표: 80% (미달성)</span>
          </div>
          <button class="primary" id="slice-action-btn" style="padding:12px; font-size:14px; font-weight:800; background:#243b54;">⚡ 80% 골든 슬라이스 실행!</button>
          
          <div id="tree-reveal-slot" style="display:none; margin-top:10px;">
            <div class="decision-tree-container">
              <div style="font-size:11px; color:#92a9bf; margin-bottom:4px;">✦ 288명의 데이터를 학습하여 AI가 스스로 구축한 [의사결정나무(Decision Tree)]</div>
              <div class="tree-node-root">
                ❓ 승객의 성별이 [여성(Female)]인가?
              </div>
              <div class="tree-branches-split">
                <div class="tree-branch-col">
                  <span class="tree-condition-tag yes-tag">YES (여성)</span>
                  <div class="tree-leaf-result survive-leaf">
                    ★ 생존 예측: 76.7% 확률 생존<br>
                    <small style="color:#b2d2e3;">(여성·어린이 우선 구조 철칙)</small>
                  </div>
                </div>
                <div class="tree-branch-col">
                  <span class="tree-condition-tag no-tag">NO (남성)</span>
                  <div class="tree-node-root" style="font-size:11px; padding:6px 10px;">
                    ❓ 객실 등급이 [1등실]이거나 [어린이]인가?
                  </div>
                  <div style="display:flex; gap:6px; width:100%; margin-top:4px;">
                    <div style="flex:1;" class="tree-leaf-result survive-leaf">
                      <span style="font-size:10px;">YES: 60.8% 생존</span>
                    </div>
                    <div style="flex:1;" class="tree-leaf-result perish-leaf">
                      <span style="font-size:10px;">NO: 15.2% 생존 (3등실 남성)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="deduction-note-card" style="margin-top:8px;">
              <span class="deduction-icon">💡</span>
              <div class="deduction-body">
                <strong>[인과관계 입증] 우리가 발견한 역사적 사실 = AI가 학습한 알고리즘!</strong>
                <p>보세요! 1장에서 우리가 발견했던 규칙(여성 우선, 1등실 우선, 어린이 우선)을 <b>AI 모델이 288명의 데이터를 분석하여 스스로 정확한 의사결정나무(Decision Tree)로 정립</b>했습니다! 정답이 우연히 나온 것이 아니라 데이터의 명백한 인과관계입니다.</p>
              </div>
            </div>
          </div>
        </div>
        <div id="slice-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '슬라이더를 80%에 맞추고 절단해서 AI가 만드는 규칙 나무를 확인해봐!']], () => {}, '자르기!');

    function updateSliceView() {
      $('#slice-fill-train').style.width = splitRatio + '%';
      $('#slice-fill-train').textContent = `📘 훈련 문제집 ${splitRatio}% (${Math.round(360 * splitRatio / 100)}명)`;
      $('#slice-fill-test').style.width = (100 - splitRatio) + '%';
      $('#slice-fill-test').textContent = `🔒 시험지 ${100 - splitRatio}% (${360 - Math.round(360 * splitRatio / 100)}명)`;
      $('#slice-laser-line').style.left = splitRatio + '%';
      $('#slice-slider').value = splitRatio;
      $('#slice-ratio-pill').textContent = `분할 비율: ${splitRatio}% : ${100 - splitRatio}%`;

      const badge = $('#slice-badge');
      const actionBtn = $('#slice-action-btn');
      if (splitRatio === 80) {
        badge.className = 'slice-target-badge locked';
        badge.textContent = '🎯 TARGET LOCKED: 80% : 20%!';
        actionBtn.style.background = 'linear-gradient(90deg, #00d2d3, #2ed573)';
        actionBtn.style.color = '#111';
      } else {
        badge.className = 'slice-target-badge';
        badge.textContent = `목표: 80% (${splitRatio < 80 ? '더 높이세요' : '더 낮추세요'})`;
        actionBtn.style.background = '#243b54';
        actionBtn.style.color = '#fff';
      }
    }

    $('#slice-slider').oninput = (e) => {
      splitRatio = Number(e.target.value);
      playSfx('combo');
      updateSliceView();
    };
    $('#slice-btn-down').onclick = () => {
      splitRatio = Math.max(50, splitRatio - 5);
      playSfx('combo');
      updateSliceView();
    };
    $('#slice-btn-up').onclick = () => {
      splitRatio = Math.min(95, splitRatio + 5);
      playSfx('combo');
      updateSliceView();
    };

    $('#slice-action-btn').onclick = () => {
      if (splitRatio !== 80) {
        playSfx('combo');
        triggerFloatingToast('💡 슬라이더를 정확히 80% 지점에 맞춰주세요!', '🎯');
        return;
      }

      playSfx('slice');
      setTimeout(() => playSfx('lock'), 250);
      triggerScreenShake();
      triggerFloatingToast('✂️ 8:2 데이터 분할 및 AI 의사결정나무 훈련 성공!', '🌲');

      $('#slice-action-btn').style.display = 'none';
      $('#tree-reveal-slot').style.display = 'block';

      playSfx('victory');
      $('#slice-clear-slot').innerHTML = `
        <div class="arcade-clear-card">
          <div class="clear-title">🏆 STAGE CLEAR! 머신러닝 의사결정나무 학습 완료</div>
          <p class="clear-insight">
            💡 <b>과적합 방지의 원리:</b><br>
            AI가 288명의 문제집으로만 규칙을 학습했고, <b>20%(72명)의 시험지는 아직 한 번도 보지 않았습니다!</b><br>
            이제 제4장에서 이 봉인된 시험지를 열어 AI의 진짜 예측 실력을 채점하고, 빙산과의 최종 결전에 나섭니다!
          </p>
          <button class="primary clear-next-btn" id="next-to-stage4">🎯 제4장: 봉인된 시험지 채점 & 데이터 기반 빙산 결전 ▶</button>
        </div>`;
      $('#next-to-stage4').onclick = () => {
        completeStage();
        stage = 3;
        renderLab();
      };
      setDialogue([['lumi', 'AI가 완벽한 규칙 나무를 만들었어! 이제 봉인된 72명의 시험지를 채점하고 빙산을 부수러 가자!']], () => {}, '결전으로!');
    };

  } else if (stage === 3) {
    // ========================================================
    // CASE 04: [실전 검증 & 결전] 봉인 시험지 채점 ➔ 데이터 기반 빙산 함포전
    // ========================================================
    let testScored = false;
    let bossHp = 1000;
    let dialSex = 'female';
    let dialCabin = 1;
    let dialAge = 10;

    function getProbabilityAndReason() {
      let prob = 0.5;
      let reason = '';
      if (dialSex === 'female') {
        if (dialCabin === 1) {
          prob = dialAge === 10 ? 99.1 : dialAge === 28 ? 90.6 : 88.3;
          reason = '여성 + 1등실(상층 갑판 보트 탑승) ➔ 의사결정나무 최고 생존 확률!';
        } else if (dialCabin === 2) {
          prob = dialAge === 10 ? 97.2 : dialAge === 28 ? 74.6 : 62.2;
          reason = '여성 + 2등실 ➔ 여성 우선 구조 철칙 적용!';
        } else {
          prob = dialAge === 10 ? 97.3 : dialAge === 28 ? 92.7 : 56.6;
          reason = '여성 + 3등실 ➔ 여성 우선 구조이나 3등실 구획 지연';
        }
      } else {
        if (dialCabin === 1) {
          prob = dialAge === 10 ? 37.0 : dialAge === 28 ? 61.8 : 28.7;
          reason = dialAge === 10 ? '어린이 우선 구조 적용' : '1등실 성인 남성 (선박 잔류 원칙으로 생존율 제한)';
        } else if (dialCabin === 2) {
          prob = dialAge === 10 ? 10.9 : dialAge === 28 ? 10.2 : 6.1;
          reason = '2등실 성인 남성 ➔ 보트 탑승 순위 최후순위 (낮은 생존율)';
        } else {
          prob = dialAge === 10 ? 37.0 : dialAge === 28 ? 25.1 : 0.7;
          reason = dialAge === 60 ? '3등실 노인 남성 ➔ 탈출 불가능 최저 생존율' : '3등실 남성 ➔ 하층부 격리로 인한 최저 생존율';
        }
      }
      return { prob: prob.toFixed(1), reason };
    }

    function getDmg() {
      const { prob } = getProbabilityAndReason();
      const p = parseFloat(prob);
      if (p >= 85) return 250;
      if (p >= 60) return 160;
      if (p >= 30) return 80;
      return 25;
    }

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>🎯</span> CASE 04: 실전 시험 채점 & 타이타닉 빙산 결전</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="stage4-phase-pill">1단계: 시험지 채점</span>
            <span class="arcade-score-pill" style="color:#ff6b81;">FINAL CLIMAX</span>
          </div>
        </div>

        <div id="test-eval-phase" style="background:#132032; border:1px solid #4a6788; border-radius:6px; padding:12px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#ffd32a; font-size:13px;">1단계: 20% 봉인 시험지(72명의 낯선 승객) 채점하기</strong>
            <span style="font-size:11px; color:#8faac4;">AI가 한 번도 보지 못한 실제 승객 기록</span>
          </div>
          <p style="font-size:12px; color:#cddce8; margin:0 0 10px 0;">
            AI가 훈련 때 엿보지 않은 72명의 비밀 승객에게 의사결정나무 규칙을 적용해 생존 여부를 예측하고 실제 정답과 대조합니다!
          </p>
          <div class="eval-matrix-box" id="eval-matrix-slot" style="display:none;">
            <div class="eval-stat-tile">
              <strong>66.7% (48명)</strong>
              <span>72명 중 적중한 승객 수 (정확도 Accuracy)</span>
            </div>
            <div class="eval-stat-tile">
              <strong style="color:#ffd32a;">25명 / 23명</strong>
              <span>실제 생존 적중(TP) / 실제 사망 적중(TN)</span>
            </div>
          </div>
          <button class="primary" id="btn-score-test" style="width:100%; padding:10px; font-weight:800; background:#243b54;">
            🔓 20% 봉인 시험지 자물쇠 해제 및 AI 채점 시작!
          </button>
        </div>

        <div id="boss-battle-phase" style="display:none;" class="boss-battle-arena">
          <div class="boss-hud-top">
            <div class="boss-header-row">
              <span class="boss-name-title" id="boss-name-label">🧊 거대 빙산 괴수 (TITANIC APOCALYPSE ICEBERG)</span>
              <span class="boss-hp-counter" id="boss-hp-text">1,000 / 1,000 HP</span>
            </div>
            <div class="boss-hp-track">
              <div class="boss-hp-bar" id="boss-hp-bar" style="width: 100%;"></div>
            </div>
          </div>
          
          <div class="boss-visual-stage" id="boss-visual-stage">
            <div class="iceberg-monster" id="iceberg-target">🧊</div>
          </div>

          <div class="cannon-dials-grid">
            <div class="cannon-dial-col">
              <label>1. 성별 규칙 모듈</label>
              <div class="dial-btns-row">
                <button class="dial-btn selected" id="c-sex-f">여성 👸 (규칙1: 76.7%)</button>
                <button class="dial-btn" id="c-sex-m">남성 🤵</button>
              </div>
            </div>
            <div class="cannon-dial-col">
              <label>2. 객실 규칙 모듈</label>
              <div class="dial-btns-row">
                <button class="dial-btn selected" id="c-cab-1">1등실 👑 (규칙2: 66.7%)</button>
                <button class="dial-btn" id="c-cab-2">2등실 💼</button>
                <button class="dial-btn" id="c-cab-3">3등실 🎒</button>
              </div>
            </div>
            <div class="cannon-dial-col">
              <label>3. 나이 규칙 모듈</label>
              <div class="dial-btns-row">
                <button class="dial-btn selected" id="c-age-10">아이 👶 (규칙3: 70.5%)</button>
                <button class="dial-btn" id="c-age-28">청년 🧑</button>
                <button class="dial-btn" id="c-age-60">노인 🧓</button>
              </div>
            </div>
          </div>

          <div class="cannon-core-indicator">
            <span style="font-size:12px; color:#cbdce8;">AI 예측 생존 확률: <strong id="cannon-power-text" style="color:#5effd8; font-size:14px;">99.1% [초임계 출력!]</strong></span>
            <span style="font-size:12px; color:#ffd32a;">타격 위력: <strong id="cannon-dmg-text" style="font-size:14px;">250 DMG</strong></span>
          </div>

          <div class="cannon-proof-tag" id="cannon-proof-reason">
            📊 <strong>데이터 증명 근거:</strong> 여성 + 1등실(상층 갑판 보트 탑승) ➔ 최고 생존 확률!
          </div>

          <button class="cannon-fire-action-btn" id="cannon-fire-btn">🔥 플라즈마 함포 발사! (CLICK TO SHOOT! 연타 가능!)</button>
        </div>

        <div id="boss-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '먼저 20% 봉인 시험지를 열어 AI의 진짜 실력을 채점해봐!']], () => {}, '채점하기!');

    $('#btn-score-test').onclick = () => {
      if (testScored) return;
      testScored = true;
      playSfx('lock');
      setTimeout(() => playSfx('victory'), 250);
      triggerScreenShake();

      $('#eval-matrix-slot').style.display = 'grid';
      $('#btn-score-test').style.display = 'none';
      $('#stage4-phase-pill').textContent = '2단계: 빙산 결전';

      $('#boss-battle-phase').style.display = 'flex';
      triggerFloatingToast('🎯 시험 채점 완료: 정확도 66.7%! 실전 검증 성공!', '🏆');

      setDialogue([['lumi', '검증 완료! 우리가 데이터에서 찾아낸 최고 확률 조건을 세팅하고 빙산을 격파해!']], () => {}, '전투 개시!');
      updateDials();
    };

    function updateDials() {
      const { prob, reason } = getProbabilityAndReason();
      const dmg = getDmg();
      const p = parseFloat(prob);

      const txt = $('#cannon-power-text');
      const dmgTxt = $('#cannon-dmg-text');
      const reasonEl = $('#cannon-proof-reason');

      if (txt) {
        txt.textContent = `${prob}% [${p >= 80 ? '🔥 HYPER OVERDRIVE!' : p >= 50 ? '정상 출력' : '⚠️ 출력 부족'}]`;
        txt.style.color = p >= 80 ? '#5effd8' : p >= 50 ? '#ffd32a' : '#ff6b81';
      }
      if (dmgTxt) dmgTxt.textContent = `${dmg} DMG`;
      if (reasonEl) {
        reasonEl.innerHTML = `📊 <strong>데이터 증명 근거:</strong> ${reason}`;
      }
    }

    $('#c-sex-f').onclick = () => {
      dialSex = 'female';
      $('#c-sex-f').classList.add('selected');
      $('#c-sex-m').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-sex-m').onclick = () => {
      dialSex = 'male';
      $('#c-sex-m').classList.add('selected');
      $('#c-sex-f').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-cab-1').onclick = () => {
      dialCabin = 1;
      $('#c-cab-1').classList.add('selected');
      $('#c-cab-2').classList.remove('selected');
      $('#c-cab-3').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-cab-2').onclick = () => {
      dialCabin = 2;
      $('#c-cab-2').classList.add('selected');
      $('#c-cab-1').classList.remove('selected');
      $('#c-cab-3').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-cab-3').onclick = () => {
      dialCabin = 3;
      $('#c-cab-3').classList.add('selected');
      $('#c-cab-1').classList.remove('selected');
      $('#c-cab-2').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-age-10').onclick = () => {
      dialAge = 10;
      $('#c-age-10').classList.add('selected');
      $('#c-age-28').classList.remove('selected');
      $('#c-age-60').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-age-28').onclick = () => {
      dialAge = 28;
      $('#c-age-28').classList.add('selected');
      $('#c-age-10').classList.remove('selected');
      $('#c-age-60').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };
    $('#c-age-60').onclick = () => {
      dialAge = 60;
      $('#c-age-60').classList.add('selected');
      $('#c-age-10').classList.remove('selected');
      $('#c-age-28').classList.remove('selected');
      playSfx('combo');
      updateDials();
    };

    const fireBtn = $('#cannon-fire-btn');
    fireBtn.onclick = () => {
      if (bossHp <= 0) return;
      const dmg = getDmg();
      bossHp = Math.max(0, bossHp - dmg);

      playSfx('cannon');
      setTimeout(() => playSfx('hit'), 80);
      triggerScreenShake();

      // Damage popup
      const popup = document.createElement('span');
      popup.className = 'damage-popup';
      popup.style.left = (35 + Math.random() * 30) + '%';
      popup.style.top = (25 + Math.random() * 30) + '%';
      popup.textContent = `-${dmg} ${dmg >= 200 ? 'CRITICAL!' : 'HIT!'}`;
      $('#boss-visual-stage').append(popup);
      setTimeout(() => popup.remove(), 600);

      const target = $('#iceberg-target');
      if (target) {
        target.classList.remove('damaged');
        void target.offsetWidth;
        target.classList.add('damaged');
      }

      const bar = $('#boss-hp-bar');
      if (bar) bar.style.width = (bossHp / 10) + '%';
      const text = $('#boss-hp-text');
      if (text) text.textContent = `${bossHp} / 1,000 HP`;

      if (bossHp <= 0) {
        playSfx('cannon');
        setTimeout(() => playSfx('cannon'), 150);
        setTimeout(() => playSfx('victory'), 350);

        if (target) {
          target.innerHTML = '💥';
          target.style.fontSize = '100px';
        }
        $('#boss-name-label').innerHTML = '🎉 💥 거대 빙산 괴수 대폭파 격파 성공!';
        fireBtn.style.display = 'none';

        triggerFloatingToast('🎯 빙산 완벽 격파! 타이타닉 구출 성공!', '🏆');

        $('#boss-clear-slot').innerHTML = `
          <div class="arcade-clear-card" style="border-color:#ffd32a; box-shadow:0 0 30px rgba(255,211,42,0.4);">
            <div class="clear-title" style="color:#ffd32a; font-size:16px;">🏆 MISSION COMPLETE! 타이타닉 데이터 수사 종결 리포트</div>
            <div class="clear-insight" style="line-height:1.8;">
              <strong>🔍 사건의 전모와 데이터 과학의 인과관계 총정리:</strong><br>
              1. <b>데이터 탐색(EDA)</b>: 전체 승객 조사에서 여성(76.7%)과 1등실(66.7%)의 생존율이 압도적임을 발견함.<br>
              2. <b>결측치 & 인코딩</b>: 48명의 나이를 지우지 않고 평균(39.4세)으로 채워 데이터를 보존하고, 글자를 0과 1 숫자로 번역함.<br>
              3. <b>과적합 방지 & 학습</b>: 80% 문제집으로 훈련시켜 [여성 우선 ➔ 1등실·어린이 우선]이라는 AI 의사결정나무를 정립함.<br>
              4. <b>실전 검증 & 승리</b>: 봉인된 72명의 시험지에서 정확도 66.7%를 입증하고, 입증된 최고 확률 빔으로 빙산을 격파함!<br>
              <i>"정답은 우연히 나타난 것이 아니라, 데이터 속에 숨겨진 역사적 진실과 논리적 인과관계의 결실이었습니다!"</i>
            </div>
            <button class="primary clear-next-btn" id="finish-titanic-btn" style="background:linear-gradient(90deg, #ffd32a, #ff9f43); color:#111;">🏆 전설의 데이터 탐정 배지 수령 & 모험 지도 복귀 ▶</button>
          </div>`;

        $('#finish-titanic-btn').onclick = () => {
          completeStage();
          titanicFinished = true;
          try { localStorage.setItem('promptQuest.titanicComplete', 'yes'); } catch {}
          map();
        };

        setDialogue([['lumi', '완벽한 논리와 추리로 사건을 해결했어! 너는 이제 진정한 데이터 과학자야!']], () => {}, '수사 완료!');
      }
    };
  }
}

function renderGenericCaseBoard(mount) {
  const m = missions[current], b = beginner[current];
  mount.innerHTML = `
    <div class="arcade-board">
      <div class="arcade-header">
        <h2 class="arcade-title"><span>🔍</span> CASE 0${stage + 1}: ${b.title[stage]}</h2>
        <span class="arcade-score-pill">${steps[stage]}</span>
      </div>
      <div class="arcade-goal-banner">
        <span>📖 <strong>수사 목표:</strong> ${b.message[stage]}</span>
      </div>
      <div id="generic-case-output"></div>
      <button class="primary clue-action-btn" id="generic-case-btn" style="padding:12px; font-size:14px; font-weight:800;">${b.actions[stage]} →</button>
    </div>`;

  $('#generic-case-btn').onclick = () => {
    playSfx('victory');
    triggerScreenShake();
    $('#generic-case-output').innerHTML = `
      <div class="arcade-clear-card">
        <div class="clear-title">💡 탐정 노트 · ${steps[stage]} 완료</div>
        <p class="clear-insight">${supportText()}</p>
      </div>`;
    $('#generic-case-btn').textContent = stage === 3 ? '🏆 모험 완료 · 지도 복귀 →' : '다음 단계로 전진하기 →';
    $('#generic-case-btn').onclick = () => {
      completeStage();
      if (stage === 3) map();
      else { stage++; renderLab(); }
    };
  };
}

function startStageStory(replay) {
  const seen = storySeen[current][stage] || results[current][stage];
  if (seen && !replay) {
    setDialogue([['lumi', '단서를 확인하고 미션을 직접 플레이해보자!']], () => {}, '확인!');
    return;
  }
  setDialogue(stageLines(), () => {}, stage === 0 ? '좋아요, 확인해볼게요 →' : '좋아요, 시작해요 →');
}

function refreshSceneActions() {}
function unlockWorkbench() {}
function gameResult() {}
function gameDiscovery() {}
