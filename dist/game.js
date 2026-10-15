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
    // Mini-game 01: 결측치 스탬프 슬램 (Whack-A-Stamp Arcade)
    let stampedCount = 0;
    const required = 3;

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>🔨</span> MINI-GAME 01: 결측치 스탬프 슬램</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="stamp-score-pill">구출 완료: 0 / 3</span>
            <span class="arcade-score-pill" style="color:#ffd32a;">WHACK-A-STAMP</span>
          </div>
        </div>
        <div class="arcade-goal-banner">
          <span>🎯 <strong>미션:</strong> 붉은색으로 깜빡이는 <strong>나이 누락(NaN) 카드 3장</strong>을 직접 클릭하여 [평균 28세 도장]을 쾅! 찍어주세요!</span>
        </div>
        <div class="stamp-cards-grid">
          <div class="stamp-passenger-card">
            <span class="card-pass-id">승객 #01</span>
            <div class="card-pass-info">남성 · 3등실</div>
            <div class="card-pass-age"><span style="color:#7bed9f; font-size:12px;">✓ 22.0세 (정상)</span></div>
          </div>
          <div class="stamp-passenger-card">
            <span class="card-pass-id">승객 #02</span>
            <div class="card-pass-info">여성 · 1등실</div>
            <div class="card-pass-age"><span style="color:#7bed9f; font-size:12px;">✓ 38.0세 (정상)</span></div>
          </div>
          <div class="stamp-passenger-card clickable-target" id="target-stamp-1" data-stamped="false">
            <span class="card-pass-id">승객 #03</span>
            <div class="card-pass-info">여성 · 3등실</div>
            <div class="card-pass-age" id="target-age-1"><span class="missing-click-badge">⚠️ 나이 누락! [클릭]</span></div>
          </div>
          <div class="stamp-passenger-card clickable-target" id="target-stamp-2" data-stamped="false">
            <span class="card-pass-id">승객 #04</span>
            <div class="card-pass-info">남성 · 2등실</div>
            <div class="card-pass-age" id="target-age-2"><span class="missing-click-badge">⚠️ 나이 누락! [클릭]</span></div>
          </div>
          <div class="stamp-passenger-card clickable-target" id="target-stamp-3" data-stamped="false">
            <span class="card-pass-id">승객 #05</span>
            <div class="card-pass-info">여성 · 2등실</div>
            <div class="card-pass-age" id="target-age-3"><span class="missing-click-badge">⚠️ 나이 누락! [클릭]</span></div>
          </div>
        </div>
        <div id="stamp-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '빨간색으로 깜빡이는 카드 3장을 직접 클릭해서 [평균 28세] 도장을 쾅 찍어줘!']], () => {}, '도장 찍기!');

    [1, 2, 3].forEach(id => {
      const card = $(`#target-stamp-${id}`);
      if (!card) return;
      card.onclick = () => {
        if (card.dataset.stamped === 'true') return;
        card.dataset.stamped = 'true';
        stampedCount++;

        playSfx('stamp');
        triggerScreenShake();

        const ageEl = $(`#target-age-${id}`);
        if (ageEl) ageEl.innerHTML = '<span class="stamped-badge-slam">★ 28.0세 보정 완료 ★</span>';
        card.classList.remove('clickable-target');

        const combo = document.createElement('span');
        combo.className = 'floating-combo-text';
        combo.textContent = `+100 COMBO x${stampedCount}!`;
        card.append(combo);

        $('#stamp-score-pill').textContent = `구출 완료: ${stampedCount} / 3`;

        if (stampedCount < required) {
          triggerFloatingToast(`승객 구출 (${stampedCount}/${required})!`, '🔨');
        } else {
          playSfx('victory');
          triggerFloatingToast('🎉 승객 3명 전원 복구 성공! 결측치 완벽 해결!', '🏆');
          $('#stamp-clear-slot').innerHTML = `
            <div class="arcade-clear-card">
              <div class="clear-title">🏆 STAGE CLEAR! 승객 명단 결측치 복구 완료</div>
              <p class="clear-insight">
                💡 <b>왜 기록을 삭제하지 않고 평균(28세)으로 채울까요?</b><br>
                나이가 빠졌다고 승객 카드를 버려버리면, 그 승객의 귀중한 성별('여성')과 등실('3등실') 정보까지 모두 날아가 버립니다! 
                그래서 전체 승객의 <b>평균 나이(28.0세)로 빈칸을 채워(결측치 대체)</b> 단 한 명의 단서도 잃지 않고 머신러닝 준비를 마쳤습니다!
              </p>
              <button class="primary clear-next-btn" id="next-to-stage2">⚡ 다음 미션: 0과 1 바이너리 레이저 매칭 ▶</button>
            </div>`;
          $('#next-to-stage2').onclick = () => {
            completeStage();
            stage = 1;
            renderLab();
          };
          setDialogue([['lumi', '대단해! 빈칸 3개를 전부 복구했어. 이제 0과 1 숫자로 번역하러 가보자!']], () => {}, '다음으로!');
        }
      };
    });
  } else if (stage === 1) {
    // Mini-game 02: 0과 1 바이너리 레이저 매칭
    let flippedCount = 0;
    const required = 4;

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>⚡</span> MINI-GAME 02: 0과 1 바이너리 레이저 매칭</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="binary-score-pill">변환 완료: 0 / 4</span>
            <span class="arcade-score-pill" style="color:#5effd8;">CYBER MATRIX</span>
          </div>
        </div>
        <div class="arcade-goal-banner">
          <span>🎯 <strong>미션:</strong> 컴퓨터는 한글 문자를 모릅니다! <strong>카드를 직접 클릭</strong>하여 0과 1의 숫자 행렬로 레이저 변환하세요!</span>
        </div>
        <div class="binary-cards-grid">
          <div class="binary-flip-card" id="bcard-1" data-flipped="false">
            <div class="binary-card-inner">
              <div class="binary-face-front">
                <span style="font-size:11px; color:#92a9bf;">승객 #01</span>
                <strong style="font-size:16px; color:#ff9ff3;">👩 여성 (1등실)</strong>
                <small style="color:#74b9ff; font-size:11px;">[클릭하여 이진 변환 ⚡]</small>
              </div>
              <div class="binary-face-back">
                <div class="binary-cube-symbol">[ 1 ]</div>
                <strong style="font-size:12px; color:#5effd8;">여성: 1 · 남성: 0</strong>
                <small style="color:#a8ff78; font-size:10px;">숫자 변환 완료</small>
              </div>
            </div>
          </div>
          <div class="binary-flip-card" id="bcard-2" data-flipped="false">
            <div class="binary-card-inner">
              <div class="binary-face-front">
                <span style="font-size:11px; color:#92a9bf;">승객 #02</span>
                <strong style="font-size:16px; color:#70a1ff;">👨 남성 (3등실)</strong>
                <small style="color:#74b9ff; font-size:11px;">[클릭하여 이진 변환 ⚡]</small>
              </div>
              <div class="binary-face-back male-back">
                <div class="binary-cube-symbol">[ 0 ]</div>
                <strong style="font-size:12px; color:#ffd32a;">여성: 0 · 남성: 1</strong>
                <small style="color:#ffa502; font-size:10px;">숫자 변환 완료</small>
              </div>
            </div>
          </div>
          <div class="binary-flip-card" id="bcard-3" data-flipped="false">
            <div class="binary-card-inner">
              <div class="binary-face-front">
                <span style="font-size:11px; color:#92a9bf;">승객 #03</span>
                <strong style="font-size:16px; color:#70a1ff;">👨 남성 (1등실)</strong>
                <small style="color:#74b9ff; font-size:11px;">[클릭하여 이진 변환 ⚡]</small>
              </div>
              <div class="binary-face-back male-back">
                <div class="binary-cube-symbol">[ 0 ]</div>
                <strong style="font-size:12px; color:#ffd32a;">여성: 0 · 남성: 1</strong>
                <small style="color:#ffa502; font-size:10px;">숫자 변환 완료</small>
              </div>
            </div>
          </div>
          <div class="binary-flip-card" id="bcard-4" data-flipped="false">
            <div class="binary-card-inner">
              <div class="binary-face-front">
                <span style="font-size:11px; color:#92a9bf;">승객 #04</span>
                <strong style="font-size:16px; color:#ff9ff3;">👩 여성 (2등실)</strong>
                <small style="color:#74b9ff; font-size:11px;">[클릭하여 이진 변환 ⚡]</small>
              </div>
              <div class="binary-face-back">
                <div class="binary-cube-symbol">[ 1 ]</div>
                <strong style="font-size:12px; color:#5effd8;">여성: 1 · 남성: 0</strong>
                <small style="color:#a8ff78; font-size:10px;">숫자 변환 완료</small>
              </div>
            </div>
          </div>
        </div>
        <div id="binary-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '승객 카드를 클릭해서 문자를 0과 1 이진수로 번역해줘!']], () => {}, '변환하기!');

    [1, 2, 3, 4].forEach(id => {
      const card = $(`#bcard-${id}`);
      if (!card) return;
      card.onclick = () => {
        if (card.dataset.flipped === 'true') return;
        card.dataset.flipped = 'true';
        card.classList.add('is-flipped');
        flippedCount++;

        playSfx('laser');
        triggerScreenShake();

        const combo = document.createElement('span');
        combo.className = 'floating-combo-text';
        combo.textContent = `+150 ENCODED!`;
        card.append(combo);

        $('#binary-score-pill').textContent = `변환 완료: ${flippedCount} / 4`;

        if (flippedCount === required) {
          playSfx('victory');
          triggerFloatingToast('🎉 전 승객 0과 1 이진수 인코딩 완료!', '⚡');
          $('#binary-clear-slot').innerHTML = `
            <div class="arcade-clear-card">
              <div class="clear-title">🏆 STAGE CLEAR! 원-핫 인코딩(One-Hot Encoding) 완료</div>
              <p class="clear-insight">
                💡 <b>컴퓨터는 왜 문자를 읽지 못할까요?</b><br>
                인공지능의 연산 회로는 오직 0과 1의 전기 신호(숫자)만 계산할 수 있습니다. 
                따라서 '여성', '남성'이라는 한글 문자를 컴퓨터가 즉시 연산할 수 있는 <b>[0, 1] 숫자 행렬로 번역</b>해준 것입니다!
              </p>
              <button class="primary clear-next-btn" id="next-to-stage3">✂️ 다음 미션: 8:2 정밀 데이터 슬라이서 ▶</button>
            </div>`;
          $('#next-to-stage3').onclick = () => {
            completeStage();
            stage = 2;
            renderLab();
          };
          setDialogue([['lumi', '완벽해! 모든 문자가 숫자로 변환되었어. 이제 데이터를 황금 비율로 나눠보자!']], () => {}, '다음으로!');
        }
      };
    });
  } else if (stage === 2) {
    // Mini-game 03: 8:2 정밀 데이터 슬라이서
    let splitRatio = 60;

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>✂️</span> MINI-GAME 03: 8:2 정밀 데이터 슬라이서</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" id="slice-ratio-pill">분할 비율: 60% : 40%</span>
            <span class="arcade-score-pill" style="color:#ffd32a;">과적합 방지 수사</span>
          </div>
        </div>
        <div class="arcade-goal-banner">
          <span>🎯 <strong>미션:</strong> 360명의 데이터를 슬라이더로 조절하여 <strong>정확히 80% [골든 컷]</strong> 지점에서 절단하세요!</span>
        </div>
        <div class="slicer-arena">
          <div class="slice-meter-wrapper">
            <div class="slice-fill-train" id="slice-fill-train" style="width: 60%;">📘 훈련용 문제집 60%</div>
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
          
          <div class="split-bundles-row" id="split-bundles-slot" style="display:none;">
            <div class="bundle-box train-box">
              <div style="font-size:24px;">📘</div>
              <strong style="color:#00d2d3;">훈련 문제집 (80% · 288명)</strong>
              <p style="font-size:11px; color:#bcd; margin:4px 0;">AI 두뇌가 규칙을 학습할 예제와 정답 세트!</p>
            </div>
            <div class="bundle-box test-box" style="position:relative;">
              <div style="font-size:24px;">🔒</div>
              <strong style="color:#ff6b81;">밀봉된 시험지 (20% · 72명)</strong>
              <p style="font-size:11px; color:#bcd; margin:4px 0;">절대 미리 보지 않고 나중에 채점할 비밀 시험지!</p>
              <div class="test-locked-chains">
                <span style="font-size:22px;">⛓️ 🔒 ⛓️</span>
                <strong style="font-size:12px; color:#ffd32a;">열람 금지 봉인 완료</strong>
              </div>
            </div>
          </div>
        </div>
        <div id="slice-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '슬라이더를 조절해서 정확히 80% 지점에 맞추고 [골든 슬라이스]를 실행해줘!']], () => {}, '자르기!');

    function updateSliceView() {
      $('#slice-fill-train').style.width = splitRatio + '%';
      $('#slice-fill-train').textContent = `📘 훈련용 문제집 ${splitRatio}% (${Math.round(360 * splitRatio / 100)}명)`;
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
      triggerFloatingToast('✂️ 8:2 데이터 분할 및 20% 시험지 봉인 완료!', '🔒');

      $('#slice-action-btn').style.display = 'none';
      $('#split-bundles-slot').style.display = 'flex';

      playSfx('victory');
      $('#slice-clear-slot').innerHTML = `
        <div class="arcade-clear-card">
          <div class="clear-title">🏆 STAGE CLEAR! 8:2 분할(Train / Test Split) 완료</div>
          <p class="clear-insight">
            💡 <b>시험지를 미리 보면 왜 안 될까요? (과적합 방지)</b><br>
            수능 문제와 정답을 미리 다 외우고 시험을 치면 100점을 맞아도 진짜 실력이 아닙니다! 
            인공지능도 <b>공부할 때 전혀 보지 않은 20%의 비밀 시험지</b>로 평가해야 진짜 예측 실력을 공정하게 증명할 수 있습니다!
          </p>
          <button class="primary clear-next-btn" id="next-to-stage4">🚢 최종 결전: 타이타닉 빙산 레이저 함포전 ▶</button>
        </div>`;
      $('#next-to-stage4').onclick = () => {
        completeStage();
        stage = 3;
        renderLab();
      };
      setDialogue([['lumi', '80% 문제집으로 AI 훈련 완료! 이제 빙산 괴수를 향해 예측 함포를 발사하러 가자!']], () => {}, '결전으로!');
    };
  } else if (stage === 3) {
    // Mini-game 04: 타이타닉 빙산 보스전 (실시간 레이저 함포전)
    let bossHp = 1000;
    let dialSex = 'female';
    let dialCabin = 1;
    let dialAge = 10;

    function getOutputPower() {
      let p = 32;
      if (dialSex === 'female') p += 43;
      else p -= 18;
      if (dialCabin === 1) p += 23;
      else if (dialCabin === 3) p -= 16;
      if (dialAge === 10) p += 16;
      else if (dialAge === 60) p -= 12;
      return Math.max(10, Math.min(98, p));
    }

    function getDmg() {
      const p = getOutputPower();
      if (p >= 80) return 250;
      if (p >= 50) return 150;
      return 60;
    }

    mount.innerHTML = `
      <div class="arcade-board">
        <div class="arcade-header">
          <h2 class="arcade-title"><span>🚢</span> FINAL BOSS: 빙산 괴수 vs 타이타닉 AI 예측 함포</h2>
          <div class="arcade-hud-row">
            <span class="arcade-score-pill" style="color:#ff6b81;">BOSS BATTLE</span>
            <span class="arcade-score-pill" id="boss-score-pill">HP: 1,000 / 1,000</span>
          </div>
        </div>
        
        <div class="boss-battle-arena">
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
              <label>성별 모듈</label>
              <div class="dial-btns-row">
                <button class="dial-btn selected" id="c-sex-f">여성 👸 (+43%)</button>
                <button class="dial-btn" id="c-sex-m">남성 🤵 (-18%)</button>
              </div>
            </div>
            <div class="cannon-dial-col">
              <label>객실 등급 모듈</label>
              <div class="dial-btns-row">
                <button class="dial-btn selected" id="c-cab-1">1등실 👑 (+23%)</button>
                <button class="dial-btn" id="c-cab-2">2등실 💼</button>
                <button class="dial-btn" id="c-cab-3">3등실 🎒 (-16%)</button>
              </div>
            </div>
            <div class="cannon-dial-col">
              <label>나이 모듈</label>
              <div class="dial-btns-row">
                <button class="dial-btn selected" id="c-age-10">아이 👶 (+16%)</button>
                <button class="dial-btn" id="c-age-28">청년 🧑</button>
                <button class="dial-btn" id="c-age-60">노인 🧓 (-12%)</button>
              </div>
            </div>
          </div>

          <div class="cannon-core-indicator">
            <span style="font-size:12px; color:#cbdce8;">함포 충전 출력: <strong id="cannon-power-text" style="color:#5effd8; font-size:14px;">98% [HYPER OVERDRIVE!]</strong></span>
            <span style="font-size:12px; color:#ffd32a;">발사당 위력: <strong id="cannon-dmg-text" style="font-size:14px;">250 DMG</strong></span>
          </div>

          <button class="cannon-fire-action-btn" id="cannon-fire-btn">🔥 플라즈마 함포 발사! (CLICK TO SHOOT! 연타 가능!)</button>
        </div>
        <div id="boss-clear-slot"></div>
      </div>`;

    setDialogue([['lumi', '생존율이 높은 조건을 세팅하고 함포 버튼을 마구 연타해서 빙산을 박살내줘!']], () => {}, '발사!');

    function updateDials() {
      const p = getOutputPower();
      const dmg = getDmg();
      const txt = $('#cannon-power-text');
      const dmgTxt = $('#cannon-dmg-text');
      if (txt) {
        txt.textContent = `${p}% [${p >= 80 ? '🔥 HYPER CRITICAL OVERDRIVE!' : p >= 50 ? '정상 출력' : '⚠️ 출력 부족'}]`;
        txt.style.color = p >= 80 ? '#ff6b81' : p >= 50 ? '#5effd8' : '#ffd32a';
      }
      if (dmgTxt) dmgTxt.textContent = `${dmg} DMG`;
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

    updateDials();

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
      const pill = $('#boss-score-pill');
      if (pill) pill.textContent = `HP: ${bossHp} / 1,000`;

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
            <div class="clear-title" style="color:#ffd32a; font-size:16px;">🏆 MISSION ACCOMPLISHED! 타이타닉 구출 및 전설의 데이터 탐정 등극!</div>
            <p class="clear-insight">
              💡 <b>AI가 밝혀낸 실제 역사의 진실:</b><br>
              당시 빙산 충돌 시 승객 생존을 결정지은 핵심 규칙은 바로 <b>'여성과 아이 우선 구조 원칙'</b>과 <b>'상층 1등실의 구명보트 접근성'</b>이었습니다!<br>
              기록의 빈칸을 채우고, 0과 1로 번역하고, 공정하게 훈련시킨 AI 모델이 이 숨겨진 생존 규칙을 완벽하게 찾아내어 98% 초임계 광선포로 빙산을 파괴했습니다!
            </p>
            <button class="primary clear-next-btn" id="finish-titanic-btn" style="background:linear-gradient(90deg, #ffd32a, #ff9f43); color:#111;">🏆 탐정 보고서 완성 및 모험 지도 복귀 ▶</button>
          </div>`;

        $('#finish-titanic-btn').onclick = () => {
          completeStage();
          titanicFinished = true;
          try { localStorage.setItem('promptQuest.titanicComplete', 'yes'); } catch {}
          map();
        };

        setDialogue([['lumi', '빙산 괴수 대격파! 너는 이제 전설의 데이터 사이언티스트 탐정이야!']], () => {}, '최고예요!');
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
