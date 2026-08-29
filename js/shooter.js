// Shooter Game Engine
class ShooterGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.menuMode = true;
        this.loopRunning = false;
        this.loopToken = 0;
        this.currentLevel = 0;
        this.wave = 1;
        this.score = 0;
        this.health = CONFIG.maxHealth;
        
        // Player
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            width: 40,
            height: 50,
            speed: 5,
            color: '#4a9eff'
        };
        this.shipShape = 'arrow';
        this.shield = 0;
        this.bombs = 1;
        this.bombKeyHeld = false;
        this.flashScreen = 0;
        
        // Arrays
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.stars = [];
        this.pickups = [];
        this.shootingStars = [];
        
        // Boss
        this.boss = null;
        this.bossActive = false;
        this.bossSpawned = false;
        
        // Timing
        this.lastShot = 0;
        this.lastSpawn = 0;
        this.waveEnemiesSpawned = 0;
        this.totalEnemies = CONFIG.enemiesPerWave;
        this.levelCleared = false;
        
        // Input
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height - 80;
        this.isMouseDown = false;
        this.pointerId = null;
        this.keys = {};
        
        // Difficulty scale based on screen size (small screens get calmer play)
        this.speedScale = 1;
        this.hudHeight = 0;
        
        // Enemy bullets (fired by the boss)
        this.enemyBullets = [];
        
        // Effects
        this.shakeTime = 0;
        this.shakeMax = 10;
        this.shakeMag = 0;
        this.invincibleUntil = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.rapidUntil = 0;
        this.lastTrail = 0;
        this.bgTop = '#0a0a1a';
        this.bgBottom = '#1a1a3a';
        this.bgColor = '#4a9eff';
        
        // Background values
        this.bg = {
            nebulaX: 0,
            nebulaY: 0,
            planetX: 0,
            planetY: 0,
            planetR: 0
        };
        
// Initialize stars
        this.initStars();
        
        // Event listeners
        this.setupEventListeners();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const minDimension = Math.min(this.canvas.width, this.canvas.height);
        this.speedScale = Math.max(0.6, Math.min(1, minDimension / 700));
        const hudEl = document.getElementById('hud');
        this.hudHeight = hudEl ? hudEl.offsetHeight : 0;
        if (this.player) {
            this.player.y = this.canvas.height - 80;
        }
        if (this.bg) {
            this.bg.nebulaX = window.innerWidth * 0.72;
            this.bg.nebulaY = window.innerHeight * 0.2;
            this.bg.planetX = window.innerWidth * 0.18;
            this.bg.planetY = window.innerHeight * 0.18;
            this.bg.planetR = Math.min(window.innerWidth, window.innerHeight) * 0.13;
        }
    }
    
    initStars() {
        this.stars = [];
        for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < 45; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: 0.6 + layer * 1.0,
                    speed: 0.5 + layer * 0.7,
                    alpha: 0.35 + layer * 0.3,
                    layer: layer,
                    twinkle: Math.random() * Math.PI * 2
                });
            }
        }
        this.shootingStars = [];
    }
    
    setupEventListeners() {
        const canvas = this.canvas;
        
        // Unified pointer input (mouse + touch + pen). Pointer capture keeps the
        // loop receiving events even when the cursor/finger leaves the window,
        // so the ship never stops responding mid-drag.
        const handleMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            if (this.menuMode || !this.isPlaying) return;
            this.player.x = this.mouseX;
            this.player.y = Math.min(Math.max(this.mouseY, this.hudHeight + 16), canvas.height - 60);
        };
        
        const handleDown = (e) => {
            e.preventDefault();
            this.isMouseDown = true;
            if (typeof canvas.setPointerCapture === 'function') {
                try {
                    canvas.setPointerCapture(e.pointerId);
                    this.pointerId = e.pointerId;
                } catch (err) { /* already captured elsewhere */ }
            }
            // On touch, move the ship straight to the touch point
            if (e.pointerType === 'touch') {
                handleMove(e);
            }
        };
        
        const handleUp = () => {
            this.isMouseDown = false;
            if (this.pointerId !== null && typeof canvas.releasePointerCapture === 'function') {
                try {
                    canvas.releasePointerCapture(this.pointerId);
                } catch (err) { /* pointer gone */ }
            }
            this.pointerId = null;
        };
        
        canvas.addEventListener('pointerdown', handleDown);
        canvas.addEventListener('pointermove', handleMove);
        canvas.addEventListener('pointerup', handleUp);
        canvas.addEventListener('pointercancel', handleUp);
        
        // Keyboard (desktop): arrows/WASD to move, Space to fire
        const mapKey = (e) => e.key === ' ' ? 'space' : e.key.toLowerCase();
        window.addEventListener('keydown', (e) => {
            this.keys[mapKey(e)] = true;
            if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
        });
        window.addEventListener('keyup', (e) => {
            this.keys[mapKey(e)] = false;
        });
        window.addEventListener('blur', () => {
            this.keys = {};
        });
        
        // Resize
        window.addEventListener('resize', () => this.resize());
    }
    
    startMenu() {
        this.menuMode = true;
        this.isPlaying = true;
        this.isPaused = false;
        this.levelCleared = false;
        this.initStars();
        const level = LEVELS[0];
        this.setBackground(level);
        this.beginLoop();
    }
    
    startLevel(levelId) {
        this.currentLevel = levelId;
        this.menuMode = false;
        this.wave = 1;
        this.score = 0;
        this.health = CONFIG.maxHealth;
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.pickups = [];
        this.boss = null;
        this.bossActive = false;
        this.bossSpawned = false;
        this.waveEnemiesSpawned = 0;
        this.totalEnemies = CONFIG.enemiesPerWave;
        this.levelCleared = false;
        this.combo = 0;
        this.comboTimer = 0;
        this.rapidUntil = 0;
        this.invincibleUntil = 0;
        this.shakeTime = 0;
        this.shield = 0;
        this.bombs = 1;
        this.bombKeyHeld = false;
        this.flashScreen = 0;
        this.isPlaying = true;
        this.isPaused = false;
        this.lastShot = 0;
        this.lastSpawn = 0;
        
        // Apply selected ship skin
        const skin = (typeof SHIP_SKINS !== 'undefined' && SHIP_SKINS[Game.selectedShip]) ? SHIP_SKINS[Game.selectedShip] : null;
        if (skin) {
            this.player.color = skin.color;
            this.shipShape = skin.shape;
        }
        
        const bossWarning = document.getElementById('boss-warning');
        if (bossWarning) bossWarning.classList.add('hidden');
        
        // Re-measure now that the HUD is visible and the viewport is settled
        const minDimension = Math.min(this.canvas.width, this.canvas.height);
        this.speedScale = Math.max(0.6, Math.min(1, minDimension / 700));
        const hudEl = document.getElementById('hud');
        this.hudHeight = hudEl ? hudEl.offsetHeight : 0;
        
        const level = LEVELS[levelId];
        this.setBackground(level);
        this.updateHUD();
        this.initStars();
        this.beginLoop();
    }
    
    setBackground(level) {
        this.bgTop = level.bgTop || '#0a0a1a';
        this.bgBottom = level.bgBottom || '#1a1a3a';
        this.bgColor = level.color || '#4a9eff';
        this.canvas.style.background = `linear-gradient(180deg, ${this.bgTop}, ${this.bgBottom})`;
    }
    
    beginLoop() {
        // Each beginLoop bumps the token so any stale frames from a previous
        // loop immediately bail out, guaranteeing exactly one active loop.
        const token = ++this.loopToken;
        this.loopRunning = true;
        const step = () => {
            if (!this.isPlaying) {
                this.loopRunning = false;
                return;
            }
            if (token !== this.loopToken) {
                return; // stale frame from a previous loop: die quietly
            }
            this.loopRunning = true;
            if (!this.isPaused) {
                if (this.menuMode) {
                    this.updateMenu();
                    this.renderMenu();
                } else {
                    this.update();
                    this.render();
                }
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
    
    updateMenu() {
        this.updateStars();
    }
    
    renderMenu() {
        this.drawBackground();
        this.drawStars();
    }
    
    update() {
        const now = Date.now();
        
        this.updateStars();
        this.handleKeyboardMovement();
        
        // Bomb (edge-triggered on the X key)
        if (this.keys['x'] && !this.bombKeyHeld) {
            this.useBomb();
            this.bombKeyHeld = true;
        } else if (!this.keys['x']) {
            this.bombKeyHeld = false;
        }
        
        // Player engine trail
        if (now - this.lastTrail > 16) {
            this.particles.push({
                x: this.player.x + (Math.random() - 0.5) * 8,
                y: this.player.y + 22,
                vx: (Math.random() - 0.5) * 0.6,
                vy: Math.random() * 1.5 + 1.5,
                life: 14,
                maxLife: 14,
                color: Math.random() < 0.5 ? 'rgba(255,150,50,0.9)' : 'rgba(120,200,255,0.9)',
                size: Math.random() * 2 + 1.5,
                alpha: 1
            });
            this.lastTrail = now;
        }
        if (this.particles.length > 400) {
            this.particles.splice(0, this.particles.length - 400);
        }
        
        // Combo timer
        if (now > this.comboTimer) {
            this.combo = 0;
        }
        
        // Shooting (respect rapid-fire power-up)
        const fireRate = now < this.rapidUntil ? 60 : CONFIG.fireRate;
        if ((this.isMouseDown || this.keys['space']) && now - this.lastShot > fireRate) {
            this.shoot();
            this.lastShot = now;
        }
        
        // Spawn enemies
        if (this.levelCleared) {
            // Level already finished (boss defeated), no more spawning
        } else if (this.bossActive) {
            // Boss logic handled below
        } else if (this.enemies.length === 0 && this.waveEnemiesSpawned >= this.totalEnemies) {
            // Wave cleared
            const flawlessWave = this.health >= CONFIG.maxHealth && typeof Game !== 'undefined';
            if (flawlessWave) Game.bumpStat('flawlessWaves', 1);
            this.wave++;
            this.waveEnemiesSpawned = 0;
            if (this.wave > CONFIG.wavesBeforeBoss) {
                this.showCallout('⚠ BOSS APPROACHING ⚠');
                this.spawnBoss();
            } else if (flawlessWave) {
                this.showCallout('FLAWLESS WAVE!');
            } else {
                this.showCallout('WAVE ' + this.wave);
            }
        } else if (this.waveEnemiesSpawned < this.totalEnemies && now - this.lastSpawn > CONFIG.enemySpawnRate) {
            this.spawnEnemy();
            this.waveEnemiesSpawned++;
            this.lastSpawn = now;
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= CONFIG.bulletSpeed;
            return bullet.y > -10;
        });
        
        // Update enemy bullets (fired by the boss, move downwards)
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.y += bullet.speed;
            bullet.x += bullet.vx || 0;
            if (this.checkCollision(this.player, bullet) && !this.isInvincible()) {
                this.takeDamage(8);
                this.createExplosion(bullet.x, bullet.y, '#ff2a2a');
                return false;
            }
            return bullet.y < this.canvas.height + 20;
        });
        
        // Update pickups
        this.pickups = this.pickups.filter(pickup => {
            pickup.y += pickup.vy;
            pickup.time++;
            if (this.checkCollision(this.player, pickup)) {
                this.applyPowerup(pickup.type);
                return false;
            }
            return pickup.y < this.canvas.height + 20;
        });
        
        // Update enemies
        this.enemies = this.enemies.filter(enemy => {
            enemy.y += enemy.speed;
            enemy.x += Math.sin(enemy.y * 0.05) * enemy.wobble;
            if (enemy.flash > 0) enemy.flash--;
            
            // Check collision with player
            if (this.checkCollision(enemy, this.player) && !this.isInvincible()) {
                this.takeDamage(10);
                this.createExplosion(enemy.x, enemy.y, '#ff6b6b');
                AudioSystem.playHit();
                return false;
            }
            
            // Check collision with bullets
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.checkCollision(enemy, this.bullets[i])) {
                    enemy.health--;
                    enemy.flash = 3;
                    this.bullets.splice(i, 1);
                    if (enemy.health <= 0) {
                        this.createExplosion(enemy.x, enemy.y, '#ffaa00');
                        this.onEnemyKilled(enemy);
                        return false;
                    }
                }
            }
            
            return enemy.y < this.canvas.height + 50;
        });
        
        // Update boss
        if (this.bossActive && this.boss) {
            if (this.boss.flash > 0) this.boss.flash--;
            this.boss.x += this.boss.speedX;
            this.boss.y += this.boss.speedY;
            
            // Bounce off walls
            if (this.boss.x <= 50 || this.boss.x >= this.canvas.width - 50) {
                this.boss.speedX *= -1;
            }
            if (this.boss.y <= 100 || this.boss.y >= this.canvas.height - 200) {
                this.boss.speedY *= -1;
            }
            
            // Boss shooting: aimed volleys on a cooldown, calmer on small screens
            if (now >= this.boss.nextShotAt) {
                this.bossShoot();
                const enraged = this.boss.health < this.boss.maxHealth * 0.5;
                const baseInterval = enraged ? 1100 : 1500;
                const jitter = 0.75 + Math.random() * 0.5;
                this.boss.nextShotAt = now + (baseInterval * jitter) / this.speedScale;
            }
            
            // Check collision with player
            if (this.checkCollision(this.boss, this.player) && !this.isInvincible()) {
                this.takeDamage(CONFIG.bossDamage);
            }
            
            // Check collision with bullets
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.checkCollision(this.boss, this.bullets[i])) {
                    const bullet = this.bullets[i];
                    this.boss.health--;
                    this.boss.flash = 2;
                    this.bullets.splice(i, 1);
                    this.createExplosion(bullet.x, bullet.y, '#ff00ff');
                    
                    if (this.boss.health <= 0) {
                        this.bossDefeated();
                        break;
                    }
                }
            }
        }
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
        
        if (this.shakeTime > 0) this.shakeTime--;
        if (this.flashScreen > 0) this.flashScreen--;
        
        this.updateHUD();
    }
    
    handleKeyboardMovement() {
        if (!this.isPlaying || this.menuMode || this.isPaused) return;
        const k = this.keys;
        let dx = 0;
        let dy = 0;
        if (k['arrowleft'] || k['a']) dx -= 1;
        if (k['arrowright'] || k['d']) dx += 1;
        if (k['arrowup'] || k['w']) dy -= 1;
        if (k['arrowdown'] || k['s']) dy += 1;
        if (dx || dy) {
            const speed = 6.5 * this.speedScale;
            this.player.x = Math.max(25, Math.min(this.canvas.width - 25, this.player.x + dx * speed));
            this.player.y = Math.max(this.hudHeight + 16, Math.min(this.canvas.height - 60, this.player.y + dy * speed));
        }
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        // Shooting star spawn
        if (this.shootingStars.length < 2 && Math.random() < 0.002) {
            this.shootingStars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.4,
                vx: Math.random() * 4 + 6,
                vy: Math.random() * 3 + 4,
                life: 50
            });
        }
        
        // Update shooting stars
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += star.vx;
            star.y += star.vy;
            star.life--;
            return star.life > 0 && star.y < this.canvas.height;
        });
    }
    
    render() {
        // Screen shake
        this.ctx.save();
        if (this.shakeTime > 0) {
            const mag = this.shakeMag * (this.shakeTime / this.shakeMax);
            this.ctx.translate((Math.random() - 0.5) * 2 * mag, (Math.random() - 0.5) * 2 * mag);
        }
        
        this.drawBackground();
        this.drawStars();
        
        // Draw player (flicker while invincible)
        if (!this.isInvincible() || Math.floor(Date.now() / 80) % 2 === 0) {
            this.drawPlayer();
        }
        
        // Draw bullets
        this.ctx.fillStyle = '#4a9eff';
        this.bullets.forEach(bullet => {
            this.ctx.shadowColor = '#4a9eff';
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.shadowBlur = 0;
        
        // Draw enemy bullets
        this.ctx.fillStyle = '#ff2a2a';
        this.enemyBullets.forEach(bullet => {
            this.ctx.shadowColor = '#ff2a2a';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.shadowBlur = 0;
        
        // Draw pickups
        this.pickups.forEach(pickup => this.drawPickup(pickup));
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.flash > 0 ? '#ffffff' : (enemy.color || '#ff6b6b');
            this.drawEnemyShape(enemy);
        });
        
        // Draw boss
        if (this.bossActive && this.boss) {
            this.ctx.fillStyle = this.boss.flash > 0 ? '#ffffff' : '#ff00ff';
            this.ctx.shadowColor = '#ff00ff';
            this.ctx.shadowBlur = 20;
            this.ctx.beginPath();
            this.ctx.arc(this.boss.x, this.boss.y, 40, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Inner ring
            this.ctx.globalAlpha = 0.5;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.boss.x, this.boss.y, 30, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
            
            // Boss health bar
            const bossHealthPercent = Math.max(0, this.boss.health / this.boss.maxHealth);
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fillRect(this.boss.x - 45, this.boss.y - 55, 90, 8);
            this.ctx.fillStyle = '#00ff9d';
            this.ctx.fillRect(this.boss.x - 45, this.boss.y - 55, 90 * bossHealthPercent, 8);
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Bomb flash
        if (this.flashScreen > 0) {
            this.ctx.globalAlpha = (this.flashScreen / 12) * 0.5;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(-20, -20, this.canvas.width + 40, this.canvas.height + 40);
            this.ctx.globalAlpha = 1;
        }
        this.ctx.restore();
    }
    
    drawBackground() {
        // Gradient sky
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.bgTop || '#0a0a1a');
        gradient.addColorStop(1, this.bgBottom || '#1a1a3a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawNebula();
        this.drawPlanet();
    }
    
    drawNebula() {
        const color = this.bgColor || '#4a9eff';
        const nx = this.bg.nebulaX || this.canvas.width * 0.72;
        const ny = this.bg.nebulaY || this.canvas.height * 0.2;
        const r = this.canvas.width * 0.45;
        const glow = this.ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
        glow.addColorStop(0, this.hexToRgba(color, 0.16));
        glow.addColorStop(0.6, this.hexToRgba(color, 0.06));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawPlanet() {
        const color = this.bgColor || '#4a9eff';
        const px = this.bg.planetX || this.canvas.width * 0.18;
        const py = this.bg.planetY || this.canvas.height * 0.18;
        const r = this.bg.planetR || Math.min(this.canvas.width, this.canvas.height) * 0.13;
        
        // Atmosphere glow
        const glow = this.ctx.createRadialGradient(px, py, r * 0.6, px, py, r * 2);
        glow.addColorStop(0, this.hexToRgba(color, 0.28));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(px, py, r * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Body
        const body = this.ctx.createRadialGradient(px - r * 0.3, py - r * 0.3, r * 0.1, px, py, r);
        body.addColorStop(0, '#ffffff');
        body.addColorStop(0.18, color);
        body.addColorStop(1, '#050b14');
        this.ctx.fillStyle = body;
        this.ctx.beginPath();
        this.ctx.arc(px, py, r, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Craters
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        for (let i = 0; i < 5; i++) {
            const a = i * 2.399;
            const cr = r * (0.32 - i * 0.04);
            const cx = px + Math.cos(a) * r * 0.45;
            const cy = py + Math.sin(a) * r * 0.45;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, cr, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawStars() {
        // Stars with twinkle
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.alpha * (0.7 + 0.3 * Math.sin(Date.now() * 0.002 + star.twinkle));
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Shooting stars
        this.shootingStars.forEach(star => {
            this.ctx.globalAlpha = Math.max(0, star.life / 50);
            this.ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(star.x - star.vx * 4, star.y - star.vy * 4);
            this.ctx.stroke();
        });
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 1;
    }
    
    drawPlayer() {
        const p = this.player;
        const shape = this.shipShape || 'arrow';
        const flicker = this.isInvincible() && Math.floor(Date.now() / 90) % 2 === 0;
        this.ctx.globalAlpha = flicker ? 0.4 : 1;
        
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 15;
        this.drawShipShape(shape, p.color, p.x, p.y, 1);
        this.ctx.shadowBlur = 0;
        
        // Cockpit (arrow only)
        if (shape === 'arrow') {
            this.ctx.fillStyle = '#6abfff';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y - 5, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Engine glow
        const eBase = shape === 'heart' ? 12 : shape === 'star' ? 10 : 20;
        this.ctx.fillStyle = `rgba(255, 150, 50, ${Math.random() * 0.5 + 0.5})`;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x - 10, p.y + eBase - 2);
        this.ctx.lineTo(p.x, p.y + eBase + 12);
        this.ctx.lineTo(p.x + 10, p.y + eBase - 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
        
        // Shield bubble
        if (this.shield > 0) {
            const alpha = 0.35 + 0.15 * Math.sin(Date.now() * 0.01);
            this.ctx.strokeStyle = `rgba(61, 214, 255, ${alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = '#3dd6ff';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 34, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawShipShape(shape, color, x, y, scale) {
        const s = scale || 1;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        if (shape === 'heart') {
            this.ctx.moveTo(x, y + 12 * s);
            this.ctx.bezierCurveTo(x - 22 * s, y - 4 * s, x - 11 * s, y - 26 * s, x, y - 9 * s);
            this.ctx.bezierCurveTo(x + 11 * s, y - 26 * s, x + 22 * s, y - 4 * s, x, y + 12 * s);
        } else if (shape === 'star') {
            for (let i = 0; i < 10; i++) {
                const a = (Math.PI / 5) * i - Math.PI / 2;
                const rad = (i % 2 === 0 ? 24 : 10) * s;
                const vx = x + Math.cos(a) * rad;
                const vy = y + Math.sin(a) * rad;
                if (i === 0) this.ctx.moveTo(vx, vy); else this.ctx.lineTo(vx, vy);
            }
        } else {
            this.ctx.moveTo(x, y - 25 * s);
            this.ctx.lineTo(x - 20 * s, y + 20 * s);
            this.ctx.lineTo(x, y + 10 * s);
            this.ctx.lineTo(x + 20 * s, y + 20 * s);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawShipPreview(ctx, skin, width, height) {
        const saved = this.ctx;
        this.ctx = ctx;
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2 + 2);
        this.ctx.shadowColor = skin.color;
        this.ctx.shadowBlur = 12;
        this.drawShipShape(skin.shape, skin.color, 0, 0, 0.9);
        this.ctx.restore();
        this.ctx = saved;
    }
    
    drawEnemyShape(enemy) {
        const x = enemy.x, y = enemy.y;
        this.ctx.beginPath();
        switch (enemy.type) {
            case 'pattern': // Diamond
                this.ctx.moveTo(x, y - 16);
                this.ctx.lineTo(x + 16, y);
                this.ctx.lineTo(x, y + 16);
                this.ctx.lineTo(x - 16, y);
                this.ctx.closePath();
                break;
            case 'smart': // Triangle pointing down
                this.ctx.moveTo(x, y + 16);
                this.ctx.lineTo(x - 16, y - 12);
                this.ctx.lineTo(x + 16, y - 12);
                this.ctx.closePath();
                break;
            case 'variable': // Hexagon
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI / 3) * i - Math.PI / 2;
                    const vx = x + Math.cos(a) * 16;
                    const vy = y + Math.sin(a) * 16;
                    if (i === 0) this.ctx.moveTo(vx, vy); else this.ctx.lineTo(vx, vy);
                }
                this.ctx.closePath();
                break;
            case 'function': // Square
                this.ctx.rect(x - 12, y - 12, 24, 24);
                break;
            case 'bug': // X shape
                this.ctx.moveTo(x - 14, y - 14);
                this.ctx.lineTo(x + 14, y + 14);
                this.ctx.moveTo(x + 14, y - 14);
                this.ctx.lineTo(x - 14, y + 14);
                this.ctx.strokeStyle = this.ctx.fillStyle;
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
                return;
            case 'elite': // Spiky star
                for (let i = 0; i < 10; i++) {
                    const a = (Math.PI / 5) * i - Math.PI / 2;
                    const rad = i % 2 === 0 ? 20 : 10;
                    const vx = x + Math.cos(a) * rad;
                    const vy = y + Math.sin(a) * rad;
                    if (i === 0) this.ctx.moveTo(vx, vy); else this.ctx.lineTo(vx, vy);
                }
                this.ctx.closePath();
                break;
            default: // Circle
                this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        }
        this.ctx.fill();
    }
    
    drawPickup(pickup) {
        const pulse = 1 + 0.15 * Math.sin(pickup.time * 0.2);
        const r = 12 * pulse;
        let color = '#ffd700';
        if (pickup.type === 'health') color = '#ff4d8d';
        else if (pickup.type === 'rapid') color = '#ffd700';
        else if (pickup.type === 'shield') color = '#3dd6ff';
        
        // Glow aura
        this.ctx.fillStyle = this.hexToRgba(color, 0.25);
        this.ctx.beginPath();
        this.ctx.arc(pickup.x, pickup.y, r + 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 12;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        if (pickup.type === 'health') {
            this.ctx.moveTo(pickup.x, pickup.y + r * 0.6);
            this.ctx.bezierCurveTo(pickup.x - r * 1.1, pickup.y + r * 0.05, pickup.x - r * 0.5, pickup.y - r * 0.8, pickup.x, pickup.y - r * 0.15);
            this.ctx.bezierCurveTo(pickup.x + r * 0.5, pickup.y - r * 0.8, pickup.x + r * 1.1, pickup.y + r * 0.05, pickup.x, pickup.y + r * 0.6);
        } else if (pickup.type === 'shield') {
            this.ctx.moveTo(pickup.x, pickup.y - r);
            this.ctx.lineTo(pickup.x + r * 0.9, pickup.y - r * 0.45);
            this.ctx.lineTo(pickup.x + r * 0.7, pickup.y + r * 0.75);
            this.ctx.lineTo(pickup.x, pickup.y + r);
            this.ctx.lineTo(pickup.x - r * 0.7, pickup.y + r * 0.75);
            this.ctx.lineTo(pickup.x - r * 0.9, pickup.y - r * 0.45);
        } else {
            this.ctx.moveTo(pickup.x + r * 0.25, pickup.y - r);
            this.ctx.lineTo(pickup.x - r * 0.5, pickup.y + r * 0.1);
            this.ctx.lineTo(pickup.x - r * 0.1, pickup.y + r * 0.1);
            this.ctx.lineTo(pickup.x - r * 0.25, pickup.y + r);
            this.ctx.lineTo(pickup.x + r * 0.5, pickup.y - r * 0.1);
            this.ctx.lineTo(pickup.x + r * 0.1, pickup.y - r * 0.1);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    shoot() {
        const rapid = Date.now() < this.rapidUntil;
        const offsets = rapid ? [-12, 0, 12] : [0];
        for (const offset of offsets) {
            this.bullets.push({
                x: this.player.x + offset,
                y: this.player.y - 30
            });
        }
        
        // Muzzle flash
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: this.player.x + (Math.random() - 0.5) * 6,
                y: this.player.y - 25,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 1,
                life: 8,
                maxLife: 8,
                color: '#7fd4ff',
                size: Math.random() * 2 + 1,
                alpha: 1
            });
        }
        AudioSystem.playLaser();
    }
    
    spawnEnemy() {
        const level = LEVELS[this.currentLevel];
        const type = level.enemyType || 'basic';
        
        this.enemies.push({
            x: Math.random() * (this.canvas.width - 60) + 30,
            y: this.hudHeight - 60,
            speed: (CONFIG.enemyBaseSpeed + (this.currentLevel * 0.5)) * this.speedScale,
            health: CONFIG.enemyBaseHealth + Math.floor(this.currentLevel / 2),
            wobble: type === 'pattern' ? 3 : 1,
            color: level.color || '#ff6b6b',
            type: type,
            flash: 0
        });
    }
    
    onEnemyKilled(enemy) {
        this.combo++;
        this.comboTimer = Date.now() + 2000;
        const multiplier = Math.min(5, 1 + Math.floor(this.combo / 5));
        this.score += CONFIG.scorePerEnemy * multiplier;
        AudioSystem.playExplosion();
        
        if (typeof Game !== 'undefined') {
            Game.bumpStat('enemiesKilled', 1);
            Game.bumpStat('maxCombo', 0);
        }
        
        // Chance to drop a power-up
        if (Math.random() < 0.06) {
            const roll = Math.random();
            const type = roll < 0.38 ? 'health' : roll < 0.72 ? 'rapid' : 'shield';
            this.pickups.push({
                x: enemy.x,
                y: enemy.y,
                type: type,
                vy: 2,
                time: 0
            });
        }
    }
    
    applyPowerup(type) {
        if (typeof Game !== 'undefined') Game.bumpStat('powerupsCollected', 1);
        
        if (type === 'health') {
            this.health = Math.min(CONFIG.maxHealth, this.health + 15);
            this.particles.push(
                { x: this.player.x, y: this.player.y, vx: 0, vy: -2, life: 20, maxLife: 20, color: '#ff4d8d', size: 4, alpha: 1 },
                { x: this.player.x - 15, y: this.player.y, vx: -1, vy: -1, life: 20, maxLife: 20, color: '#ff4d8d', size: 3, alpha: 1 },
                { x: this.player.x + 15, y: this.player.y, vx: 1, vy: -1, life: 20, maxLife: 20, color: '#ff4d8d', size: 3, alpha: 1 }
            );
        } else if (type === 'rapid') {
            this.rapidUntil = Date.now() + 5000;
            this.particles.push(
                { x: this.player.x, y: this.player.y, vx: 0, vy: -2, life: 20, maxLife: 20, color: '#ffd700', size: 4, alpha: 1 },
                { x: this.player.x, y: this.player.y - 15, vx: 0, vy: -2, life: 20, maxLife: 20, color: '#ffd700', size: 3, alpha: 1 }
            );
        } else if (type === 'shield') {
            this.shield = 1;
            this.particles.push(
                { x: this.player.x, y: this.player.y - 30, vx: 0, vy: -2, life: 25, maxLife: 25, color: '#3dd6ff', size: 4, alpha: 1 },
                { x: this.player.x - 25, y: this.player.y - 10, vx: -1, vy: -1, life: 25, maxLife: 25, color: '#3dd6ff', size: 3, alpha: 1 },
                { x: this.player.x + 25, y: this.player.y - 10, vx: 1, vy: -1, life: 25, maxLife: 25, color: '#3dd6ff', size: 3, alpha: 1 }
            );
        }
        AudioSystem.playPowerUp();
        this.updateHUD();
    }
    
    spawnBoss() {
        if (this.bossSpawned) return;
        this.bossSpawned = true;
        
        const level = LEVELS[this.currentLevel];
        this.boss = {
            x: this.canvas.width / 2,
            y: 150,
            speedX: 3 * this.speedScale,
            speedY: 2 * this.speedScale,
            health: CONFIG.bossHealth + this.currentLevel,
            maxHealth: CONFIG.bossHealth + this.currentLevel,
            name: level.bossName,
            flash: 0,
            nextShotAt: Date.now() + 1400
        };
        this.bossActive = true;
        
        this.addShake(4, 10);
        const bossWarning = document.getElementById('boss-warning');
        if (bossWarning) bossWarning.classList.remove('hidden');
        AudioSystem.playBossWarning();
        
        setTimeout(() => {
            const warning = document.getElementById('boss-warning');
            if (warning) warning.classList.add('hidden');
        }, 3000);
    }
    
    bossShoot() {
        // Boss fires a small volley; smaller screens get fewer, slower bullets
        const count = Math.max(3, Math.round(5 * this.speedScale));
        const spread = 1.5 * this.speedScale;
        for (let i = -(count - 1) / 2; i <= (count - 1) / 2; i++) {
            this.enemyBullets.push({
                x: this.boss.x,
                y: this.boss.y + 40,
                vx: i * spread,
                speed: 5 * this.speedScale,
                isEnemy: true
            });
        }
    }
    
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const r1 = obj1.width ? obj1.width / 2 : 15;
        const r2 = obj2.width ? obj2.width / 2 : 15;
        return distance < r1 + r2;
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                maxLife: 30,
                color: color,
                size: Math.random() * 4 + 2,
                alpha: 1
            });
        }
    }
    
    isInvincible() {
        return Date.now() < this.invincibleUntil;
    }
    
    addShake(magnitude, maxShake) {
        this.shakeMag = magnitude;
        this.shakeMax = maxShake;
        this.shakeTime = maxShake;
    }
    
    takeDamage(amount) {
        if (this.isInvincible()) return;
        
        // Shield absorbs one hit
        if (this.shield > 0) {
            this.shield = 0;
            this.invincibleUntil = Date.now() + Math.round(900 / this.speedScale);
            this.addShake(3, 8);
            this.createExplosion(this.player.x, this.player.y, '#3dd6ff');
            AudioSystem.playHit();
            this.updateHUD();
            return;
        }
        
        const scaled = Math.max(1, Math.round(amount * this.speedScale));
        this.health -= scaled;
        if (this.health <= 0) {
            this.health = 0;
        }
        this.invincibleUntil = Date.now() + Math.round(1100 / this.speedScale);
        this.addShake(6, 12);
        this.updateHUD();
        
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    useBomb() {
        if (!this.isPlaying || this.menuMode || this.isPaused) return;
        if (this.bombs <= 0) return;
        
        this.bombs--;
        this.enemyBullets = [];
        
        const survivors = [];
        this.enemies.forEach(enemy => {
            enemy.health--;
            enemy.flash = 3;
            if (enemy.health <= 0) {
                this.createExplosion(enemy.x, enemy.y, enemy.color || '#ff6b6b');
                AudioSystem.playExplosion();
                this.onEnemyKilled(enemy);
            } else {
                survivors.push(enemy);
            }
        });
        this.enemies = survivors;
        
        if (this.boss && this.bossActive) {
            this.boss.health--;
            this.boss.flash = 3;
            if (this.boss.health <= 0) {
                this.bossDefeated();
            }
        }
        
        this.flashScreen = 12;
        this.addShake(8, 16);
        AudioSystem.playExplosion();
        this.updateHUD();
        
        if (typeof Game !== 'undefined') Game.bumpStat('bombsUsed', 1);
    }
    
    showCallout(text) {
        const el = document.getElementById('callout-display');
        if (!el) return;
        el.textContent = text;
        el.classList.remove('shown');
        void el.offsetWidth;
        el.classList.add('shown');
        clearTimeout(this._calloutTimer);
        this._calloutTimer = setTimeout(() => {
            el.classList.remove('shown');
        }, 1600);
    }
    
    updateHUD() {
        const healthFill = document.getElementById('player-health');
        if (healthFill) healthFill.style.width = `${Math.max(0, this.health)}%`;
        const healthText = document.getElementById('health-text');
        if (healthText) healthText.textContent = `HP: ${Math.max(0, this.health)}%`;
        const scoreEl = document.getElementById('score-display');
        if (scoreEl) scoreEl.textContent = `SCORE: ${this.score}`;
        const comboEl = document.getElementById('combo-display');
        if (comboEl) {
            if (this.combo >= 2) {
                comboEl.textContent = `COMBO x${Math.min(5, 1 + Math.floor(this.combo / 5))}`;
            } else {
                comboEl.textContent = '';
            }
        }
        const bombLabel = document.getElementById('bomb-count');
        if (bombLabel) {
            bombLabel.textContent = this.bombs;
            const bombBtn = document.getElementById('bomb-btn');
            if (bombBtn) {
                if (this.bombs > 0 && this.isPlaying && !this.menuMode) {
                    bombBtn.classList.remove('unavailable');
                } else {
                    bombBtn.classList.add('unavailable');
                }
            }
        }
        const shield = document.getElementById('shield-indicator');
        if (shield) {
            shield.textContent = this.shield > 0 ? '🛡' : '';
        }
        if (this.currentLevel >= 0 && this.currentLevel < LEVELS.length) {
            const planetEl = document.getElementById('planet-display');
            if (planetEl) planetEl.textContent = `TARGET: ${LEVELS[this.currentLevel].name.toUpperCase()}`;
        }
        const waveFill = document.getElementById('wave-fill');
        if (waveFill) {
            const levelProgress = ((this.wave - 1) + (this.waveEnemiesSpawned / this.totalEnemies)) / CONFIG.wavesBeforeBoss * 100;
            waveFill.style.width = `${Math.max(0, Math.min(100, levelProgress))}%`;
        }
        const waveLabel = document.querySelector('.wave-label');
        if (waveLabel) {
            const currentWave = Math.max(1, Math.min(this.wave, CONFIG.wavesBeforeBoss));
            waveLabel.textContent = `WAVE ${currentWave}/${CONFIG.wavesBeforeBoss}`;
        }
    }
    
    hexToRgba(hex, alpha) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#4a9eff');
        if (!m) return `rgba(74,158,255,${alpha})`;
        const r = parseInt(m[1], 16);
        const g = parseInt(m[2], 16);
        const b = parseInt(m[3], 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.pickups = [];
        this.boss = null;
        this.bossActive = false;
        const bossWarning = document.getElementById('boss-warning');
        if (bossWarning) bossWarning.classList.add('hidden');
    }
    
    bossDefeated() {
        this.bossActive = false;
        this.levelCleared = true;
        this.createExplosion(this.boss.x, this.boss.y, '#ff00ff');
        this.createExplosion(this.boss.x, this.boss.y, '#ffffff');
        this.score += CONFIG.scorePerBoss;
        this.addShake(10, 20);
        AudioSystem.playExplosion();
        AudioSystem.playVictory();
        
        // Show puzzle
        setTimeout(() => {
            Game.showPuzzleScreen();
        }, 1000);
    }
    
    gameOver() {
        this.isPlaying = false;
        this.loopRunning = false;
        AudioSystem.playDefeat();
        Game.handleLevelLoss();
    }
}