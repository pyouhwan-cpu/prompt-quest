'use strict';
const briefingSeen = [false, false, false];
const questBriefings = [
  {
    role: '시간 여행 데이터 탐정',
    title: '타이타닉: 마지막 승객의 확률',
    tagline: '별빛 갑판에서 시작되는 미지의 승객 추적 모험',
    story: '1912년 타이타닉의 승객 명단 속 사라진 나이와 숨은 규칙을 밝혀내세요!',
    goal: '결측치 복구 → AI 모델 훈련 → 새 승객 2명의 생존 확률 예측',
    first: '승객 5명의 첫 단서부터 확인해요.'
  },
  {
    role: '백화점 마케팅 팀 분석가',
    title: '백화점 VIP 고객 예측',
    tagline: '구매와 방문 기록 속에 숨은 다음 VIP를 찾아라',
    story: '수많은 고객 기록을 표준화하고 다음 기간의 VIP를 정확하게 예측하세요!',
    goal: '결측치 & 스케일링 → 로지스틱 회귀 학습 → VIP 적중률 판별',
    first: '고객 5명의 발자취부터 살펴봐요.'
  },
  {
    role: '모빌리티 알고리즘 엔지니어',
    title: '스마트 내비게이션 도착 시간 예측',
    tagline: '거리와 시간 속 숨은 패턴으로 정확한 도착 시간을 계산하라',
    story: '비 내리는 도시의 주행 기록을 정제하고 AI 회귀 모델로 소요 시간을 예측하세요!',
    goal: '이상치 정제 → 랜덤 포레스트 회귀 → MAE 오차 검증',
    first: '이동 일지 5건을 펼쳐봐요.'
  }
];

const storyLessons = [
  [
    [['lumi', '💡 나이가 빠진 칸이 있어! 평균 나이로 채우고 성별도 숫자로 바꿔보자.']],
    [['lumi', '⚡ 80% 기록으로 AI에게 규칙을 가르치고, 20%는 검증용으로 봉인해둘게!']],
    [['lumi', '🎯 봉인했던 승객 기록 개봉! AI의 예측과 실제 생존을 직접 대조해보자!']]
  ],
  [
    [['lumi', '💡 비어 있는 구매액을 평균으로 채우고, 금액과 방문 횟수의 눈금을 맞추자!']],
    [['lumi', '⚡ 고객 기록으로 로지스틱 회귀 모델을 학습시켜 VIP 분류 규칙을 배울게!']],
    [['lumi', '🎯 새 고객 명단 오픈! 우리 AI가 VIP 손님을 얼마나 정확히 맞혔는지 확인하자!']]
  ],
  [
    [['lumi', '💡 비정상 마이너스 거리를 지우고, 평균으로 빈칸을 채워 데이터를 정제하자!']],
    [['lumi', '⚡ 이동 거리와 시간대로 소요 시간을 맞히는 랜덤 포레스트 회귀 모델 가동!']],
    [['lumi', '🎯 실제 도착 시간과 AI 예측 시간을 대조해서 평균 몇 분 차이 나는지 보자!']]
  ]
];

function showBriefing() {
  const b = questBriefings[current];
  stopDialogue();
  closeSceneWindow();
  const cover = document.createElement('section');
  cover.className = 'story-briefing';
  cover.id = 'story-briefing';
  cover.setAttribute('aria-label', '모험 시작 안내');
  cover.innerHTML = `
    <div class="briefing-card dynamic-briefing">
      <div class="briefing-header">
        <span class="guide-label">CHAPTER 0${current + 1} · 임무 브리핑</span>
        <h2>${b.title}</h2>
        <p class="briefing-tagline">${b.tagline}</p>
      </div>
      <div class="briefing-body">
        <img src="assets/lumi-portrait.png" alt="여우 탐정 루미" class="briefing-lumi">
        <div class="briefing-info">
          <div class="briefing-goal-box">
            <b>🎯 임무 목표</b>
            <p>${b.goal}</p>
          </div>
          <p class="briefing-summary">${b.story}</p>
        </div>
      </div>
      <button class="primary pulse-btn" id="briefing-start">▶ 모험 시작하기 (루미와 출항)</button>
    </div>`;
  $('.game-scene').append(cover);
  $('#briefing-start').onclick = () => {
    briefingSeen[current] = true;
    cover.remove();
    if (typeof triggerStageTransition === 'function') {
      triggerStageTransition(stage, () => {
        startStageStory(false);
      });
    } else {
      startStageStory(false);
    }
  };
  $('#briefing-start').focus();
}
