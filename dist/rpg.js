'use strict';

// ========================================================
// RPG EXPLORATION & BOSS BATTLE ENGINE (Prompt Quest)
// ========================================================

const RPG = {
  canvas: null,
  ctx: null,
  active: false,
  width: 800,
  height: 450,
  scale: 1,

  // Room state: 0: Deck, 1: Cabin Library, 2: Engine Room, 3: Boss Arena
  currentRoom: 0,

  // Player state
  player: {
    x: 180,
    y: 270,
    targetX: 180,
    targetY: 270,
    speed: 3.5,
    dir: 'right', // 'down', 'up', 'left', 'right'
    moving: false,
    walkFrame: 0,
    walkTimer: 0,
    size: 26
  },

  // Companion (Fox Lumi) trailing history
  lumi: {
    x: 140,
    y: 270,
    dir: 'right',
    trail: []
  },

  // Input states
  keys: {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false
  },

  // Interactive hotspots per room
  rooms: [
    // Room 0: 별빛 야간 갑판 (Starry Deck)
    {
      id: 0,
      name: '별빛 갑판',
      theme: 'deck',
      bgType: 'deck',
      hotspots: [
        {
          id: 'ledger',
          x: 230,
          y: 260,
          radius: 45,
          icon: '📜',
          label: '승객 명부 펼치기',
          stage: 0,
          action: () => {
            if (typeof openSceneWindow === 'function') openSceneWindow('record');
            if (typeof triggerFloatingToast === 'function') triggerFloatingToast('승객 명부 발견! 빈칸을 확인해보세요.', '📜');
            $('#find-blanks')?.click();
          }
        },
        {
          id: 'door_cabin',
          x: 740,
          y: 230,
          radius: 40,
          icon: '🚪',
          label: '선실 서재로 들어가기',
          action: () => RPG.switchRoom(1, 100, 260)
        }
      ]
    },

    // Room 1: 선실 서재 / 기록보관소 (Cabin Library)
    {
      id: 1,
      name: '선실 서재',
      theme: 'cabin',
      bgType: 'cabin',
      hotspots: [
        {
          id: 'door_deck',
          x: 60,
          y: 230,
          radius: 40,
          icon: '🚪',
          label: '갑판으로 나가기',
          action: () => RPG.switchRoom(0, 700, 230)
        },
        {
          id: 'safe_records',
          x: 380,
          y: 210,
          radius: 45,
          icon: '🔍',
          label: '누락된 나이 장부 복구',
          stage: 1,
          action: () => {
            if (typeof openSceneWindow === 'function') openSceneWindow('challenge');
            if (typeof triggerFloatingToast === 'function') triggerFloatingToast('선실 비밀 장부 발견! 결측치를 복구합니다.', '🔍');
            $('#investigate')?.click();
          }
        },
        {
          id: 'door_engine',
          x: 740,
          y: 230,
          radius: 40,
          icon: '🚪',
          label: '기관실로 내려가기',
          action: () => RPG.switchRoom(2, 100, 260)
        }
      ]
    },

    // Room 2: 증기 기관실 & 조타실 (Engine Room & Wheelhouse)
    {
      id: 2,
      name: '중앙 조타실',
      theme: 'engine',
      bgType: 'engine',
      hotspots: [
        {
          id: 'door_cabin_back',
          x: 60,
          y: 230,
          radius: 40,
          icon: '🚪',
          label: '선실로 돌아가기',
          action: () => RPG.switchRoom(1, 700, 230)
        },
        {
          id: 'ai_console',
          x: 400,
          y: 210,
          radius: 45,
          icon: '⚡',
          label: '랜덤 포레스트 AI 가동',
          stage: 2,
          action: () => {
            if (typeof openSceneWindow === 'function') openSceneWindow('challenge');
            if (typeof triggerFloatingToast === 'function') triggerFloatingToast('AI 연산 콘솔 가동! 규칙을 학습합니다.', '⚡');
            $('#investigate')?.click();
          }
        },
        {
          id: 'door_boss',
          x: 740,
          y: 230,
          radius: 40,
          icon: '⚔️',
          label: '최상층 구명보트 갑판 (결전의 바다)',
          action: () => RPG.switchRoom(3, 150, 280)
        }
      ]
    },

    // Room 3: 최상층 구명보트 갑판 & 빙산 해역 (Boss Arena)
    {
      id: 3,
      name: '안개 낀 빙산 해역',
      theme: 'boss',
      bgType: 'boss',
      hotspots: [
        {
          id: 'door_engine_back',
          x: 60,
          y: 230,
          radius: 40,
          icon: '🚪',
          label: '조타실로 돌아가기',
          action: () => RPG.switchRoom(2, 700, 230)
        },
        {
          id: 'start_boss',
          x: 420,
          y: 240,
          radius: 60,
          icon: '🔥',
          label: '운명의 빙산 망령과 결전 시작!',
          action: () => RPG.startBossBattle()
        }
      ]
    }
  ],

  // Boss Battle System
  boss: {
    active: false,
    name: '빙산의 망령 · THE PHANTOM ICEBERG',
    maxHp: 2000,
    hp: 2000,
    playerHp: 100,
    playerMaxHp: 100,
    shield: false,
    shieldTimer: 0,
    ultimate: 0, // 0 to 100%
    attackTimer: 0,
    phase: 1,
    hitFlash: 0,
    shake: 0,
    floatTexts: [] // {x, y, text, color, life, vy}
  },

  // Particles
  particles: [],

  init(container) {
    if ($('#rpg-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'rpg-canvas';
    canvas.className = 'rpg-viewport';
    canvas.width = this.width;
    canvas.height = this.height;
    container.prepend(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.bindEvents();
    this.active = true;

    // Start in room matching current stage
    this.currentRoom = Math.min(stage, 3);
    this.player.x = 200;
    this.player.y = 260;
    this.player.targetX = 200;
    this.player.targetY = 260;

    requestAnimationFrame(() => this.loop());
  },

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['Space', 'Enter'].includes(e.code)) {
        this.interactNear();
        if (this.boss.active) this.useSkill('slash');
      }
      if (this.boss.active) {
        if (e.key === '1') this.useSkill('slash');
        if (e.key === '2') this.useSkill('shield');
        if (e.key === '3') this.useSkill('tree');
        if (e.key === '4') this.useSkill('ultimate');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.active) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
    });

    // Mouse / Touch click to walk or click hotspot / skill
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.width / rect.width);
      const y = (e.clientY - rect.top) * (this.height / rect.height);

      if (this.boss.active) {
        // Check skill button clicks
        const btnY = this.height - 52;
        if (y >= btnY) {
          if (x >= 80 && x <= 220) this.useSkill('slash');
          else if (x >= 230 && x <= 370) this.useSkill('shield');
          else if (x >= 380 && x <= 520) this.useSkill('tree');
          else if (x >= 530 && x <= 720) this.useSkill('ultimate');
          return;
        }
      }

      // Check click on hotspots directly
      const room = this.rooms[this.currentRoom];
      for (const h of room.hotspots) {
        const dist = Math.hypot(x - h.x, y - h.y);
        if (dist <= h.radius + 20) {
          this.player.targetX = h.x;
          this.player.targetY = h.y + 20;
          h.action();
          return;
        }
      }

      // Move player to target
      this.player.targetX = Math.max(50, Math.min(this.width - 50, x));
      this.player.targetY = Math.max(160, Math.min(this.height - 40, y));
    });
  },

  switchRoom(roomId, spawnX, spawnY) {
    this.currentRoom = roomId;
    this.player.x = spawnX;
    this.player.y = spawnY;
    this.player.targetX = spawnX;
    this.player.targetY = spawnY;
    this.lumi.trail = [];
    this.playAudio('transition');

    const env = stageEnvironments[0]?.[roomId] || stageEnvironments[0][0];
    if (typeof applyStageEnvironment === 'function') {
      applyStageEnvironment(env);
    }
    if (typeof triggerStageTransition === 'function') {
      triggerStageTransition(roomId);
    }
  },

  interactNear() {
    const room = this.rooms[this.currentRoom];
    for (const h of room.hotspots) {
      const dist = Math.hypot(this.player.x - h.x, this.player.y - h.y);
      if (dist <= h.radius + 35) {
        h.action();
        this.playAudio('chime');
        break;
      }
    }
  },

  startBossBattle() {
    this.boss.active = true;
    this.boss.hp = this.boss.maxHp;
    this.boss.playerHp = this.boss.playerMaxHp;
    this.boss.ultimate = 20;
    this.boss.shield = false;
    this.boss.attackTimer = 0;
    this.boss.floatTexts = [];
    this.playAudio('alert');

    if (typeof triggerScreenShake === 'function') triggerScreenShake();
    if (typeof triggerFloatingToast === 'function') triggerFloatingToast('⚠️ 경보! 거대한 빙산의 망령 출현!', '🔥');
  },

  useSkill(skill) {
    if (!this.boss.active || this.boss.hp <= 0) return;

    if (skill === 'slash') {
      const dmg = 250 + Math.floor(Math.random() * 50);
      this.boss.hp = Math.max(0, this.boss.hp - dmg);
      this.boss.hitFlash = 12;
      this.boss.shake = 8;
      this.boss.ultimate = Math.min(100, this.boss.ultimate + 25);
      this.addDamageText(620, 180, `-${dmg}!`, '#ffec8b');
      this.spawnSlashParticles(620, 190, '#66f5ff');
      this.playAudio('slash');

      if (typeof triggerScreenShake === 'function') triggerScreenShake();
    } else if (skill === 'shield') {
      this.boss.shield = true;
      this.boss.shieldTimer = 240; // 4 seconds at 60fps
      this.boss.ultimate = Math.min(100, this.boss.ultimate + 20);
      this.addDamageText(this.player.x, this.player.y - 35, '방어막 전개!', '#7df5b8');
      this.playAudio('shield');
    } else if (skill === 'tree') {
      const dmg = 580 + Math.floor(Math.random() * 80);
      this.boss.hp = Math.max(0, this.boss.hp - dmg);
      this.boss.hitFlash = 16;
      this.boss.shake = 14;
      this.boss.ultimate = Math.min(100, this.boss.ultimate + 30);
      this.addDamageText(620, 160, `-${dmg}! 다수결 강타!`, '#89f582');
      this.spawnSlashParticles(620, 190, '#9eff78');
      this.playAudio('tree');

      if (typeof triggerScreenShake === 'function') triggerScreenShake();
    } else if (skill === 'ultimate') {
      if (this.boss.ultimate < 100) {
        this.addDamageText(this.player.x, this.player.y - 35, '게이지 부족! (100% 필요)', '#ff9696');
        return;
      }
      this.boss.ultimate = 0;
      const dmg = 9999;
      this.boss.hp = 0;
      this.boss.hitFlash = 40;
      this.boss.shake = 25;
      this.addDamageText(620, 140, `CRITICAL OVERKILL! -${dmg}!`, '#fff275');
      this.spawnLaserParticles();
      this.playAudio('laser');

      if (typeof triggerScreenShake === 'function') triggerScreenShake();
      setTimeout(() => this.bossVictory(), 1600);
    }

    if (this.boss.hp <= 0 && skill !== 'ultimate') {
      setTimeout(() => this.bossVictory(), 1200);
    }
  },

  bossVictory() {
    this.boss.active = false;
    this.playAudio('victory');
    if (typeof triggerFloatingToast === 'function') triggerFloatingToast('🏆 보스 격파! 전설의 타이타닉 보고서 획득!', '👑');

    if (typeof finishTitanic === 'function') {
      finishTitanic();
    }
    this.switchRoom(0, 300, 260);
  },

  addDamageText(x, y, text, color) {
    this.boss.floatTexts.push({
      x,
      y,
      text,
      color,
      life: 60,
      vy: -1.6
    });
  },

  spawnSlashParticles(x, y, color) {
    for (let i = 0; i < 18; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 4 + 2,
        color,
        life: 25
      });
    }
  },

  spawnLaserParticles() {
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: this.player.x + (620 - this.player.x) * Math.random(),
        y: 190 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.3) * 12,
        vy: (Math.random() - 0.5) * 6,
        size: Math.random() * 6 + 3,
        color: Math.random() > 0.5 ? '#fff48f' : '#69f0ff',
        life: 40
      });
    }
  },

  update() {
    // Player keyboard movement
    let dx = 0, dy = 0;
    if (this.keys.up) dy -= 1;
    if (this.keys.down) dy += 1;
    if (this.keys.left) dx -= 1;
    if (this.keys.right) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      this.player.x += dx * this.player.speed;
      this.player.y += dy * this.player.speed;
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.moving = true;

      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.dir = dx > 0 ? 'right' : 'left';
      } else {
        this.player.dir = dy > 0 ? 'down' : 'up';
      }
    } else {
      // Mouse click movement
      const tdx = this.player.targetX - this.player.x;
      const tdy = this.player.targetY - this.player.y;
      const tdist = Math.hypot(tdx, tdy);

      if (tdist > 4) {
        this.player.x += (tdx / tdist) * this.player.speed;
        this.player.y += (tdy / tdist) * this.player.speed;
        this.player.moving = true;
        if (Math.abs(tdx) > Math.abs(tdy)) {
          this.player.dir = tdx > 0 ? 'right' : 'left';
        } else {
          this.player.dir = tdy > 0 ? 'down' : 'up';
        }
      } else {
        this.player.moving = false;
      }
    }

    // Keep player in bounds
    this.player.x = Math.max(50, Math.min(this.width - 50, this.player.x));
    this.player.y = Math.max(160, Math.min(this.height - 40, this.player.y));

    // Walk frame animation
    if (this.player.moving) {
      this.player.walkTimer++;
      if (this.player.walkTimer > 6) {
        this.player.walkTimer = 0;
        this.player.walkFrame = (this.player.walkFrame + 1) % 4;
      }
    } else {
      this.player.walkFrame = 0;
    }

    // Companion Lumi trailing history
    this.lumi.trail.push({ x: this.player.x, y: this.player.y, dir: this.player.dir });
    if (this.lumi.trail.length > 14) {
      const pos = this.lumi.trail.shift();
      this.lumi.x = pos.x;
      this.lumi.y = pos.y;
      this.lumi.dir = pos.dir;
    }

    // Boss Battle Loop
    if (this.boss.active && this.boss.hp > 0) {
      if (this.boss.shieldTimer > 0) {
        this.boss.shieldTimer--;
        if (this.boss.shieldTimer <= 0) this.boss.shield = false;
      }

      this.boss.attackTimer++;
      if (this.boss.attackTimer > 180) { // Boss attacks every 3 seconds
        this.boss.attackTimer = 0;
        if (!this.boss.shield) {
          const dmg = 15;
          this.boss.playerHp = Math.max(0, this.boss.playerHp - dmg);
          this.addDamageText(this.player.x, this.player.y - 30, `-${dmg}!`, '#ff5959');
          if (typeof triggerScreenShake === 'function') triggerScreenShake();
        } else {
          this.addDamageText(this.player.x, this.player.y - 30, '실드 방어 성공!', '#92f5ff');
        }
      }

      if (this.boss.hitFlash > 0) this.boss.hitFlash--;
      if (this.boss.shake > 0) this.boss.shake--;
    }

    // Particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Float texts update
    for (let i = this.boss.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.boss.floatTexts[i];
      ft.y += ft.vy;
      ft.life--;
      if (ft.life <= 0) this.boss.floatTexts.splice(i, 1);
    }
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Room Environment
    this.drawRoomBackground(ctx);

    // 2. Draw Hotspots
    const room = this.rooms[this.currentRoom];
    for (const h of room.hotspots) {
      this.drawHotspot(ctx, h);
    }

    // 3. Draw Boss if in Boss Arena
    if (this.currentRoom === 3) {
      this.drawBossMonster(ctx);
    }

    // 4. Draw Characters (Lumi first, then Player)
    this.drawLumi(ctx, this.lumi.x, this.lumi.y, this.lumi.dir);
    this.drawDetective(ctx, this.player.x, this.player.y, this.player.dir, this.player.walkFrame);

    // 5. Draw Shield Effect if active
    if (this.boss.shield) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y - 12, 34, 0, Math.PI * 2);
      ctx.strokeStyle = '#62f0ff';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(98, 240, 255, 0.15)';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    // 7. Draw Floating Damage / Dialog Texts
    for (const ft of this.boss.floatTexts) {
      ctx.save();
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // 8. Draw HUD (Exploration HUD or Boss Battle HUD)
    if (this.boss.active) {
      this.drawBossHUD(ctx);
    } else {
      this.drawExplorationHUD(ctx);
    }
  },

  drawRoomBackground(ctx) {
    const r = this.rooms[this.currentRoom];

    if (r.bgType === 'deck') {
      // Starry sky
      ctx.fillStyle = '#0a1426';
      ctx.fillRect(0, 0, this.width, 160);
      // Stars
      ctx.fillStyle = '#fce4a6';
      for (let i = 0; i < 25; i++) {
        ctx.fillRect((i * 37) % this.width, (i * 19) % 130 + 10, 2, 2);
      }
      // Ocean horizon
      ctx.fillStyle = '#06101d';
      ctx.fillRect(0, 140, this.width, 30);

      // Wooden Deck Floor
      ctx.fillStyle = '#3a2717';
      ctx.fillRect(0, 160, this.width, this.height - 160);

      // Deck Planks lines
      ctx.strokeStyle = '#281a0e';
      ctx.lineWidth = 1;
      for (let y = 160; y < this.height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }

      // Ship Railing
      ctx.strokeStyle = '#d7c7a3';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 150, this.width, 18);
      for (let x = 0; x < this.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 150);
        ctx.lineTo(x, 168);
        ctx.stroke();
      }
    } else if (r.bgType === 'cabin') {
      // Warm wallpaper
      ctx.fillStyle = '#2d1b18';
      ctx.fillRect(0, 0, this.width, this.height);

      // Bookshelves on the back wall
      ctx.fillStyle = '#1c0f0e';
      ctx.fillRect(40, 40, this.width - 80, 120);
      for (let x = 60; x < this.width - 80; x += 14) {
        ctx.fillStyle = ['#7c2b2b', '#b38842', '#2a5542', '#40567e'][(x / 14) % 4];
        ctx.fillRect(x, 60, 10, 85);
      }

      // Carpet floor
      ctx.fillStyle = '#4a2422';
      ctx.fillRect(0, 160, this.width, this.height - 160);
      ctx.strokeStyle = '#b8944d';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 180, this.width - 80, this.height - 210);
    } else if (r.bgType === 'engine') {
      // Metallic Steampunk Engine room
      ctx.fillStyle = '#111b24';
      ctx.fillRect(0, 0, this.width, this.height);

      // Copper Pipes
      ctx.fillStyle = '#7a4e28';
      ctx.fillRect(0, 50, this.width, 16);
      ctx.fillRect(0, 90, this.width, 12);

      // Steampunk Gears
      ctx.strokeStyle = '#b8864a';
      ctx.lineWidth = 4;
      ctx.strokeRect(180, 50, 60, 60);
      ctx.strokeRect(520, 50, 60, 60);

      // Metal grid floor
      ctx.fillStyle = '#182430';
      ctx.fillRect(0, 160, this.width, this.height - 160);
      ctx.strokeStyle = '#223648';
      for (let x = 0; x < this.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 160);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
    } else if (r.bgType === 'boss') {
      // Stormy sea
      ctx.fillStyle = '#060d19';
      ctx.fillRect(0, 0, this.width, this.height);

      // Dark waves
      ctx.fillStyle = '#0b192e';
      ctx.fillRect(0, 140, this.width, this.height - 140);

      // Icy mist overlay
      ctx.fillStyle = 'rgba(140, 215, 255, 0.08)';
      ctx.fillRect(0, 0, this.width, this.height);
    }
  },

  drawHotspot(ctx, h) {
    const isNear = Math.hypot(this.player.x - h.x, this.player.y - h.y) <= h.radius + 30;

    // Glowing circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
    ctx.fillStyle = isNear ? 'rgba(245, 210, 130, 0.25)' : 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = isNear ? '#fce79f' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = isNear ? 2 : 1;
    ctx.fill();
    ctx.stroke();

    // Hotspot Icon
    ctx.font = '22px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(h.icon, h.x, h.y);

    // Prompt badge when near
    if (isNear) {
      ctx.font = 'bold 11px sans-serif';
      const text = `${h.label} [SPACE / 클릭]`;
      const w = ctx.measureText(text).width + 16;
      ctx.fillStyle = 'rgba(12, 22, 38, 0.95)';
      ctx.fillRect(h.x - w / 2, h.y - h.radius - 22, w, 20);
      ctx.strokeStyle = '#edd59b';
      ctx.strokeRect(h.x - w / 2, h.y - h.radius - 22, w, 20);
      ctx.fillStyle = '#fff4d8';
      ctx.fillText(text, h.x, h.y - h.radius - 12);
    }
    ctx.restore();
  },

  drawDetective(ctx, x, y, dir, frame) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 2, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    const legOffset = frame === 1 ? -3 : frame === 3 ? 3 : 0;

    // Legs
    ctx.fillStyle = '#222831';
    ctx.fillRect(-6, -6 + legOffset, 4, 7);
    ctx.fillRect(2, -6 - legOffset, 4, 7);

    // Trench Coat Body
    ctx.fillStyle = '#8f653b';
    ctx.fillRect(-8, -22, 16, 17);
    // Coat collar & tie
    ctx.fillStyle = '#aa3333';
    ctx.fillRect(-2, -20, 4, 6);

    // Face / Head
    ctx.fillStyle = '#fedcb3';
    ctx.fillRect(-6, -31, 12, 10);

    // Eyes
    ctx.fillStyle = '#1c1c1c';
    if (dir === 'right') {
      ctx.fillRect(1, -27, 2, 2);
    } else if (dir === 'left') {
      ctx.fillRect(-3, -27, 2, 2);
    } else {
      ctx.fillRect(-4, -27, 2, 2);
      ctx.fillRect(2, -27, 2, 2);
    }

    // Deerstalker Hat (Classic Detective Cap)
    ctx.fillStyle = '#634423';
    ctx.fillRect(-10, -36, 20, 6);
    ctx.fillRect(-7, -40, 14, 5);
    // Flap
    ctx.fillStyle = '#4a3219';
    ctx.fillRect(-4, -41, 8, 3);

    // Magnifying Glass
    if (dir === 'right') {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(10, -16, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(180, 240, 255, 0.5)';
      ctx.fill();
    }

    ctx.restore();
  },

  drawLumi(ctx, x, y, dir) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 2, 9, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Fox Body (Orange)
    ctx.fillStyle = '#e6732b';
    ctx.fillRect(-6, -14, 12, 12);

    // White Chest
    ctx.fillStyle = '#fff4e6';
    ctx.fillRect(-4, -10, 8, 8);

    // Teal Scarf
    ctx.fillStyle = '#2db8aa';
    ctx.fillRect(-7, -15, 14, 4);

    // Fox Head
    ctx.fillStyle = '#e6732b';
    ctx.fillRect(-5, -22, 10, 8);

    // Ears
    ctx.fillStyle = '#2b1b17';
    ctx.fillRect(-6, -26, 3, 4);
    ctx.fillRect(3, -26, 3, 4);

    // Eyes
    ctx.fillStyle = '#1c1c1c';
    if (dir === 'right') {
      ctx.fillRect(1, -19, 2, 2);
    } else {
      ctx.fillRect(-3, -19, 2, 2);
    }

    // Bushy Tail
    ctx.fillStyle = '#e6732b';
    ctx.fillRect(dir === 'right' ? -12 : 7, -10, 6, 6);
    ctx.fillStyle = '#fff4e6';
    ctx.fillRect(dir === 'right' ? -14 : 9, -10, 3, 4);

    ctx.restore();
  },

  drawBossMonster(ctx) {
    const bossX = 620 + (this.boss.shake ? (Math.random() - 0.5) * this.boss.shake : 0);
    const bossY = 190;

    ctx.save();
    ctx.translate(bossX, bossY);

    if (this.boss.hitFlash > 0) {
      ctx.filter = 'brightness(2) drop-shadow(0 0 15px #ff5959)';
    }

    // Giant Iceberg Mountain Body
    ctx.beginPath();
    ctx.moveTo(-90, 80);
    ctx.lineTo(-40, -110);
    ctx.lineTo(0, -140);
    ctx.lineTo(45, -95);
    ctx.lineTo(95, 80);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, -140, 0, 80);
    grad.addColorStop(0, '#daf4ff');
    grad.addColorStop(0.4, '#76c4e8');
    grad.addColorStop(1, '#1b4b73');
    ctx.fillStyle = grad;
    ctx.fill();

    // Crystal Shard Facets
    ctx.strokeStyle = '#b8e9ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -140);
    ctx.lineTo(-20, -40);
    ctx.lineTo(-70, 80);
    ctx.moveTo(0, -140);
    ctx.lineTo(25, -20);
    ctx.lineTo(60, 80);
    ctx.stroke();

    // Glowing Frosty Eyes
    ctx.fillStyle = '#5efff2';
    ctx.shadowColor = '#5efff2';
    ctx.shadowBlur = 12;
    ctx.fillRect(-22, -45, 10, 8);
    ctx.fillRect(12, -45, 10, 8);

    // Boss Name Tag
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000';
    ctx.fillText('THE PHANTOM ICEBERG', 0, 105);

    ctx.restore();
  },

  drawExplorationHUD(ctx) {
    // Top-Left Location Pill
    ctx.save();
    ctx.fillStyle = 'rgba(10, 18, 30, 0.9)';
    ctx.strokeStyle = '#c4a675';
    ctx.lineWidth = 1;
    ctx.fillRect(15, 15, 230, 32);
    ctx.strokeRect(15, 15, 230, 32);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#fce4a6';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 ${this.rooms[this.currentRoom].name}`, 26, 36);

    // On-screen navigation hint
    ctx.fillStyle = 'rgba(10, 18, 30, 0.85)';
    ctx.fillRect(this.width - 240, 15, 225, 32);
    ctx.strokeRect(this.width - 240, 15, 225, 32);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#a8cdd8';
    ctx.fillText('⌨️ 방향키 / WASD / 클릭 이동', this.width - 228, 35);

    // Mini on-screen touch arrows in bottom-left
    const padX = 35, padY = this.height - 70;
    ctx.fillStyle = 'rgba(18, 32, 50, 0.7)';
    ctx.strokeStyle = '#5a7899';
    // Left, Right, Up, Down buttons
    [
      { x: padX, y: padY + 22, label: '◀', k: 'left' },
      { x: padX + 38, y: padY + 22, label: '▶', k: 'right' },
      { x: padX + 19, y: padY, label: '▲', k: 'up' },
      { x: padX + 19, y: padY + 44, label: '▼', k: 'down' }
    ].forEach(btn => {
      ctx.fillRect(btn.x, btn.y, 22, 20);
      ctx.strokeRect(btn.x, btn.y, 22, 20);
      ctx.fillStyle = '#edd59b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(btn.label, btn.x + 11, btn.y + 14);
      ctx.fillStyle = 'rgba(18, 32, 50, 0.7)';
    });

    ctx.restore();
  },

  drawBossHUD(ctx) {
    ctx.save();

    // 1. Top Boss Health Bar
    const hpRatio = Math.max(0, this.boss.hp / this.boss.maxHp);
    ctx.fillStyle = 'rgba(8, 14, 25, 0.95)';
    ctx.fillRect(160, 15, 480, 42);
    ctx.strokeStyle = '#f0c678';
    ctx.lineWidth = 2;
    ctx.strokeRect(160, 15, 480, 42);

    // Boss Name
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#ffdede';
    ctx.textAlign = 'left';
    ctx.fillText(`👑 ${this.boss.name}`, 172, 31);
    ctx.textAlign = 'right';
    ctx.fillText(`${this.boss.hp} / ${this.boss.maxHp} HP`, 628, 31);

    // HP Bar Track
    ctx.fillStyle = '#220b0b';
    ctx.fillRect(172, 38, 456, 12);
    // HP Bar Fill
    const hpGrad = ctx.createLinearGradient(172, 0, 628, 0);
    hpGrad.addColorStop(0, '#ff3b3b');
    hpGrad.addColorStop(1, '#ff914d');
    ctx.fillStyle = hpGrad;
    ctx.fillRect(172, 38, 456 * hpRatio, 12);

    // 2. Player HP & Ultimate Bar (Left side)
    ctx.fillStyle = 'rgba(8, 14, 25, 0.9)';
    ctx.fillRect(20, this.height - 110, 200, 48);
    ctx.strokeStyle = '#5a7899';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, this.height - 110, 200, 48);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#8ce7ff';
    ctx.textAlign = 'left';
    ctx.fillText(`탐정 HP: ${this.boss.playerHp}%`, 28, this.height - 94);
    ctx.fillStyle = '#ffdf7a';
    ctx.fillText(`궁극 게이지: ${this.boss.ultimate}%`, 28, this.height - 72);

    // 3. Bottom 4 Skill Command Buttons
    const btnY = this.height - 52;
    const skills = [
      { id: 'slash', name: '[1] 🗡️ 데이터 정제 베기', desc: '데미지 250', x: 80, w: 140, active: true },
      { id: 'shield', name: '[2] 🛡️ 평균값 실드', desc: '4초 무적 방어', x: 230, w: 140, active: true },
      { id: 'tree', name: '[3] 🌲 랜덤 포레스트', desc: '다수결 600 타격', x: 380, w: 140, active: true },
      { id: 'ultimate', name: `[4] 🎯 생존확률 포격 (${this.boss.ultimate}%)`, desc: '9999 피니시', x: 530, w: 190, active: this.boss.ultimate >= 100 }
    ];

    for (const sk of skills) {
      ctx.fillStyle = sk.active ? 'rgba(24, 42, 65, 0.95)' : 'rgba(15, 20, 28, 0.85)';
      ctx.fillRect(sk.x, btnY, sk.w, 42);
      ctx.strokeStyle = sk.id === 'ultimate' && sk.active ? '#ffd700' : sk.active ? '#ecd59b' : '#4a596a';
      ctx.lineWidth = sk.id === 'ultimate' && sk.active ? 2 : 1;
      ctx.strokeRect(sk.x, btnY, sk.w, 42);

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = sk.id === 'ultimate' && sk.active ? '#fff275' : sk.active ? '#f5eedc' : '#718090';
      ctx.textAlign = 'center';
      ctx.fillText(sk.name, sk.x + sk.w / 2, btnY + 18);
      ctx.font = '9px monospace';
      ctx.fillStyle = '#9cb8c9';
      ctx.fillText(sk.desc, sk.x + sk.w / 2, btnY + 34);
    }

    ctx.restore();
  },

  playAudio(type) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (type === 'slash') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'shield') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.28);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
      } else if (type === 'tree') {
        [0, 1, 2].forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = 440 + n * 120;
          gain.gain.setValueAtTime(0.12, now + n * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, now + n * 0.07 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n * 0.07);
          osc.stop(now + n * 0.07 + 0.13);
        });
      } else if (type === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.51);
      } else if (type === 'alert') {
        [0, 0.15, 0.3].forEach(t => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now + t);
          osc.frequency.setValueAtTime(660, now + t + 0.07);
          gain.gain.setValueAtTime(0.15, now + t);
          gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.13);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.14);
        });
      } else if (type === 'victory') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.36);
        });
      }
    } catch {}
  },

  loop() {
    if (!this.active) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
};

window.RPG = RPG;
