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

let dialogueState = null, dialogueTimer = null, soundEnabled = false, soundContext = null;
const storySeen = [[], [], []];

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
    // Case 1: 결측치 수사
    mount.innerHTML = `
      <div class="clue-board">
        <div class="board-header">
          <h2><span>📜</span> CASE 01: 승객 명단의 빈칸 사건</h2>
          <span class="board-case-tag">결측치(Missing Values) 수사</span>
        </div>
        <div class="case-story-box">
          <b>📖 사건 브리핑:</b> 1912년 4월, 타이타닉의 탑승 명단 5명을 입수했습니다. 그런데 <b>3번째 승객의 나이 칸</b>이 비어 있습니다! 컴퓨터는 빈칸이 남아 있으면 학습을 시작하지 못합니다. 기록을 다 버려야 할까요, 아니면 평균 나이로 채워야 할까요?
        </div>
        <div class="clue-cards-grid">
          <div class="clue-passenger-card">
            <span class="clue-card-num">승객 #01</span>
            <div class="clue-card-info">남성 · 3등실</div>
            <div class="clue-card-age">22.0세</div>
          </div>
          <div class="clue-passenger-card">
            <span class="clue-card-num">승객 #02</span>
            <div class="clue-card-info">여성 · 1등실</div>
            <div class="clue-card-age">38.0세</div>
          </div>
          <div class="clue-passenger-card has-missing" id="case1-card">
            <span class="clue-card-num">승객 #03</span>
            <div class="clue-card-info">여성 · 3등실</div>
            <div class="clue-card-age" id="case1-val"><span class="missing-badge">⚠️ 빈칸 (NaN)</span></div>
          </div>
          <div class="clue-passenger-card">
            <span class="clue-card-num">승객 #04</span>
            <div class="clue-card-info">여성 · 1등실</div>
            <div class="clue-card-age">35.0세</div>
          </div>
          <div class="clue-passenger-card">
            <span class="clue-card-num">승객 #05</span>
            <div class="clue-card-info">남성 · 3등실</div>
            <div class="clue-card-age">35.0세</div>
          </div>
        </div>
        <div id="case1-insight-slot"></div>
        <button class="primary clue-action-btn" id="case1-btn">🔍 승객 평균 나이(28.0세)로 빈칸 채우기 쾅! →</button>
      </div>`;

    $('#case1-btn').onclick = () => {
      playChime(true);
      triggerScreenShake();
      triggerFloatingToast('빈칸 보정 완료! 데이터 복구 성공!', '✨');
      $('#case1-val').innerHTML = '<span class="stamped-badge">✓ 28.0세 (보정 완료)</span>';
      $('#case1-card').classList.remove('has-missing');
      $('#case1-insight-slot').innerHTML = `
        <div class="detective-insight-card">
          <span class="insight-icon">💡</span>
          <div class="insight-body">
            <b>탐정 노트 · 결측치(Missing Values) 처리의 핵심</b>
            <p>나이가 빠졌다고 승객 기록 전체를 지워버리면, 그 승객의 귀중한 성별과 등실 정보까지 모두 잃게 됩니다! 그래서 공부할 기록들의 <b>평균값으로 빈칸을 채워 넣어(결측치 대체)</b> 데이터 손실을 방지합니다.</p>
          </div>
        </div>`;
      $('#case1-btn').textContent = 'CASE 02로 전진하기: 컴퓨터의 비밀 암호 →';
      $('#case1-btn').onclick = () => {
        completeStage();
        stage = 1;
        renderLab();
      };
      setDialogue([['lumi', '완벽해! 빈칸을 채웠으니 이제 컴퓨터가 명단을 읽을 수 있어. 다음 수사로 가보자!']], () => {}, '좋아요!');
    };
  } else if (stage === 1) {
    // Case 2: 범주형 인코딩
    mount.innerHTML = `
      <div class="clue-board">
        <div class="board-header">
          <h2><span>⚡</span> CASE 02: 컴퓨터의 비밀 암호 (인코딩)</h2>
          <span class="board-case-tag">원-핫 인코딩(Encoding) 수사</span>
        </div>
        <div class="case-story-box">
          <b>📖 사건 브리핑:</b> 빈칸은 채웠지만 컴퓨터가 멈춰버렸습니다! 컴퓨터는 '여성', '남성'이라는 한글 문자를 전혀 읽지 못합니다. 컴퓨터는 오직 0과 1의 전기 신호(숫자)만 이해할 수 있습니다. 문자를 숫자로 번역해야 합니다!
        </div>
        <div class="flip-cards-container">
          <div class="flip-card" id="card-female">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="flip-card-title">👩 여성</div>
                <div class="flip-card-sub">글자 데이터 (컴퓨터 인식 불가)</div>
              </div>
              <div class="flip-card-back">
                <div class="flip-card-title">여성: 1 · 남성: 0</div>
                <div class="flip-card-sub">이진수 숫자 신호 (변환 완료)</div>
              </div>
            </div>
          </div>
          <div class="flip-card" id="card-male">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="flip-card-title">👨 남성</div>
                <div class="flip-card-sub">글자 데이터 (컴퓨터 인식 불가)</div>
              </div>
              <div class="flip-card-back">
                <div class="flip-card-title">여성: 0 · 남성: 1</div>
                <div class="flip-card-sub">이진수 숫자 신호 (변환 완료)</div>
              </div>
            </div>
          </div>
        </div>
        <div id="case2-insight-slot"></div>
        <button class="primary clue-action-btn" id="case2-btn">⚡ 글자를 컴퓨터용 숫자(0과 1)로 인코딩하기! →</button>
      </div>`;

    $('#case2-btn').onclick = () => {
      playChime(true);
      triggerScreenShake();
      triggerFloatingToast('문자 ➔ 이진수 숫자 인코딩 완료!', '⚡');
      $('#card-female').classList.add('flipped');
      $('#card-male').classList.add('flipped');
      $('#case2-insight-slot').innerHTML = `
        <div class="detective-insight-card">
          <span class="insight-icon">💡</span>
          <div class="insight-body">
            <b>탐정 노트 · 원-핫 인코딩(One-Hot Encoding)의 핵심</b>
            <p>컴퓨터는 '여성'이라는 단어를 모릅니다. 그래서 여성은 1, 남성은 0처럼 <b>컴퓨터가 연산할 수 있는 숫자 행렬로 번역해주는 작업</b>을 '범주형 인코딩'이라고 부릅니다!</p>
          </div>
        </div>`;
      $('#case2-btn').textContent = 'CASE 03으로 전진하기: 8:2 비밀 모의고사 →';
      $('#case2-btn').onclick = () => {
        completeStage();
        stage = 2;
        renderLab();
      };
      setDialogue([['lumi', '멋지다! 이제 모든 글자가 숫자로 바뀌었어. 드디어 AI에게 학습을 시킬 준비가 끝났어!']], () => {}, '좋아요!');
    };
  } else if (stage === 2) {
    // Case 3: 훈련/검증 분할
    mount.innerHTML = `
      <div class="clue-board">
        <div class="board-header">
          <h2><span>🔒</span> CASE 03: 8:2 비밀 모의고사 (분할과 학습)</h2>
          <span class="board-case-tag">과적합 방지(Train/Test Split) 수사</span>
        </div>
        <div class="case-story-box">
          <b>📖 사건 브리핑:</b> 360명의 승객 기록과 생존 정답을 컴퓨터에게 한 번에 전부 보여주면 안 됩니다! 컴퓨터가 답을 통째로 외워버려(과적합), 정작 새로운 승객을 만났을 때 엉터리 답을 낼 수 있기 때문입니다. 기록을 어떻게 나눌까요?
        </div>
        <div class="split-visual-container">
          <div class="split-bundle train-bundle">
            <div class="bundle-icon">📘</div>
            <div class="bundle-title">공부용 훈련 데이터 (80%)</div>
            <div class="bundle-desc">288명의 승객 기록<br>컴퓨터에게 보여주고 규칙을 학습시킬 문제집!</div>
          </div>
          <div class="split-bundle test-bundle" id="test-bundle">
            <div class="bundle-icon">🔒</div>
            <div class="bundle-title">봉인된 검증 시험지 (20%)</div>
            <div class="bundle-desc">72명의 승객 기록<br>절대 엿보지 않고, 나중에 실력을 채점할 비밀 시험지!</div>
          </div>
        </div>
        <div id="case3-insight-slot"></div>
        <button class="primary clue-action-btn" id="case3-btn">🤖 80% 문제집으로 랜덤 포레스트 AI 훈련 시작! →</button>
      </div>`;

    $('#case3-btn').onclick = () => {
      playChime(true);
      triggerScreenShake();
      triggerFloatingToast('머신러닝 학습 완료! 비밀 시험지 채점 준비!', '🌲');
      $('#case3-insight-slot').innerHTML = `
        <div class="detective-insight-card">
          <span class="insight-icon">💡</span>
          <div class="insight-body">
            <b>탐정 노트 · 데이터 분할(Train / Test Split)의 핵심</b>
            <p>학생이 시험 문제와 정답을 미리 보고 100점을 맞으면 진짜 실력을 알 수 없습니다. 인공지능도 <b>공부할 때 보지 않은 20%의 비밀 기록으로 시험을 쳐야</b> 모델의 진짜 예측 실력을 공정하게 평가할 수 있습니다!</p>
          </div>
        </div>`;
      $('#case3-btn').textContent = 'CASE 04로 전진하기: 최후의 생존자 추리 & 빙산 결전 →';
      $('#case3-btn').onclick = () => {
        completeStage();
        stage = 3;
        renderLab();
      };
      setDialogue([['lumi', 'AI가 수많은 결정 나무(랜덤 포레스트)로 생존 규칙을 완벽하게 학습했어! 이제 빙산 앞에서 실력을 시험해보자!']], () => {}, '좋아요!');
    };
  } else if (stage === 3) {
    // Case 4: 최후의 생존자 추리 & 보스전
    let testAge = 28, testSex = 'female', testCabin = 1;

    function calcP() {
      const r = results[0]?.[3];
      const key = `${testAge}:${testSex}:${testCabin}`;
      if (r?.passengerProbabilities?.[key] !== undefined) {
        return (r.passengerProbabilities[key] * 100).toFixed(1);
      }
      let p = 0.38;
      if (testSex === 'female') p += 0.42;
      else p -= 0.18;
      if (testCabin === 1) p += 0.22;
      else if (testCabin === 3) p -= 0.15;
      if (testAge < 15) p += 0.18;
      return (Math.max(0.05, Math.min(0.96, p)) * 100).toFixed(1);
    }

    function updateRadar() {
      const pct = calcP();
      const el = $('#radar-pct-val');
      if (el) el.textContent = pct + '%';
    }

    mount.innerHTML = `
      <div class="clue-board">
        <div class="board-header">
          <h2><span>🎯</span> CASE 04: 최후의 생존자 추리 & 빙산 결전</h2>
          <span class="board-case-tag">AI 모델 예측(Prediction) 실전</span>
        </div>
        <div class="case-story-box">
          <b>📖 사건 브리핑:</b> 공부를 마친 AI에게 새로운 승객 조건을 주고 생존 확률을 실시간으로 추리해 보세요! 전방에 다가오는 거대한 빙산을 향해 생존 확률의 진실을 발사하세요!
        </div>
        <div class="probability-radar-box">
          <div class="radar-controls">
            <div class="radar-control-group">
              <label>승객 나이</label>
              <div class="radar-btn-group">
                <button class="radar-choice-btn" id="btn-age-down">- 10세</button>
                <span id="label-age" style="min-width:55px; text-align:center; font-weight:700; color:#fce79f; padding:6px 0;">28세</span>
                <button class="radar-choice-btn" id="btn-age-up">+ 10세</button>
              </div>
            </div>
            <div class="radar-control-group">
              <label>승객 성별</label>
              <div class="radar-btn-group">
                <button class="radar-choice-btn active" id="btn-sex-f">여성 👸</button>
                <button class="radar-choice-btn" id="btn-sex-m">남성 🤵</button>
              </div>
            </div>
            <div class="radar-control-group">
              <label>객실 등급</label>
              <div class="radar-btn-group">
                <button class="radar-choice-btn active" id="btn-cab-1">1등실 👑</button>
                <button class="radar-choice-btn" id="btn-cab-2">2등실 💼</button>
                <button class="radar-choice-btn" id="btn-cab-3">3등실 🎒</button>
              </div>
            </div>
          </div>
          <div class="radar-gauge-display">
            <span class="radar-pct" id="radar-pct-val">82.4%</span>
            <span class="radar-label">AI 추정 생존 확률</span>
          </div>
        </div>
        <div id="case4-insight-slot"></div>
        <button class="primary clue-action-btn pulse-btn" id="case4-fire">🔥 생존 확률 포격 발사! (빙산 괴수 격파) →</button>
      </div>`;

    updateRadar();

    $('#btn-age-down').onclick = () => {
      testAge = Math.max(8, testAge - 10);
      $('#label-age').textContent = testAge + '세';
      updateRadar();
    };
    $('#btn-age-up').onclick = () => {
      testAge = Math.min(68, testAge + 10);
      $('#label-age').textContent = testAge + '세';
      updateRadar();
    };
    $('#btn-sex-f').onclick = () => {
      testSex = 'female';
      $('#btn-sex-f').classList.add('active');
      $('#btn-sex-m').classList.remove('active');
      updateRadar();
    };
    $('#btn-sex-m').onclick = () => {
      testSex = 'male';
      $('#btn-sex-m').classList.add('active');
      $('#btn-sex-f').classList.remove('active');
      updateRadar();
    };
    $('#btn-cab-1').onclick = () => {
      testCabin = 1;
      $('#btn-cab-1').classList.add('active');
      $('#btn-cab-2').classList.remove('active');
      $('#btn-cab-3').classList.remove('active');
      updateRadar();
    };
    $('#btn-cab-2').onclick = () => {
      testCabin = 2;
      $('#btn-cab-2').classList.add('active');
      $('#btn-cab-1').classList.remove('active');
      $('#btn-cab-3').classList.remove('active');
      updateRadar();
    };
    $('#btn-cab-3').onclick = () => {
      testCabin = 3;
      $('#btn-cab-3').classList.add('active');
      $('#btn-cab-1').classList.remove('active');
      $('#btn-cab-2').classList.remove('active');
      updateRadar();
    };

    $('#case4-fire').onclick = () => {
      playChime(true);
      triggerScreenShake();
      triggerFloatingToast('🎯 생존 확률 포격 발사! 빙산 괴수 대격파!', '💥');
      $('#case4-insight-slot').innerHTML = `
        <div class="detective-insight-card">
          <span class="insight-icon">🏆</span>
          <div class="insight-body">
            <b>탐정 노트 · 머신러닝 예측(Prediction)의 진실</b>
            <p>여성과 1등실 승객의 생존 확률이 높게 추정되는 이유는, 당시 역사 속 <b>'여성과 아이 우선 구조', '상층 갑판의 구명보트 접근성'</b>이라는 실제 데이터의 숨은 규칙을 AI가 스스로 찾아냈기 때문입니다!</p>
          </div>
        </div>`;
      $('#case4-fire').textContent = '🏆 탐정 보고서 완성 및 모험 지도 복귀 →';
      $('#case4-fire').classList.remove('pulse-btn');
      $('#case4-fire').onclick = () => {
        completeStage();
        titanicFinished = true;
        try { localStorage.setItem('promptQuest.titanicComplete', 'yes'); } catch {}
        map();
      };
      setDialogue([['lumi', '보스 격파 완료! 데이터 준비부터 머신러닝 예측까지, 이제 너는 진짜 데이터 탐정이야!']], () => {}, '최고예요!');
    };
  }
}

function renderGenericCaseBoard(mount) {
  const m = missions[current], b = beginner[current];
  mount.innerHTML = `
    <div class="clue-board">
      <div class="board-header">
        <h2><span>🔍</span> CASE 0${stage + 1}: ${b.title[stage]}</h2>
        <span class="board-case-tag">${steps[stage]}</span>
      </div>
      <div class="case-story-box">
        <b>📖 수사 목표:</b> ${b.message[stage]}
      </div>
      <div id="generic-case-output"></div>
      <button class="primary clue-action-btn" id="generic-case-btn">${b.actions[stage]} →</button>
    </div>`;

  $('#generic-case-btn').onclick = () => {
    playChime(true);
    triggerScreenShake();
    $('#generic-case-output').innerHTML = `
      <div class="detective-insight-card">
        <span class="insight-icon">💡</span>
        <div class="insight-body">
          <b>탐정 노트 · ${steps[stage]} 완료</b>
          <p>${supportText()}</p>
        </div>
      </div>`;
    $('#generic-case-btn').textContent = stage === 3 ? '모험 완료 · 지도 복귀 →' : '다음 단계로 전진하기 →';
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
    setDialogue([['lumi', '수사 보드의 단서를 확인하고 버튼을 눌러 다음 단계로 진행해보자!']], () => {}, '확인!');
    return;
  }
  setDialogue(stageLines(), () => {}, stage === 0 ? '좋아요, 확인해볼게요 →' : '좋아요, 시작해요 →');
}

function refreshSceneActions() {}
function unlockWorkbench() {}
function gameResult() {}
function gameDiscovery() {}
