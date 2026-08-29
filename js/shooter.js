// Shooter Game Engine
class ShooterGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
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
        
        // Arrays
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.stars = [];
        
        // Boss
        this.boss = null;
        this.bossActive = false;
        
        // Timing
        this.lastShot = 0;
        this.lastSpawn = 0;
        this.enemiesSpawned = 0;
        this.totalEnemies = CONFIG.enemiesPerWave * CONFIG.wavesBeforeBoss;
        
        // Input
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height - 80;
        this.isMouseDown = false;
        
        // Initialize stars
        this.initStars();
        
        // Event listeners
        this.setupEventListeners();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.player) {
            this.player.y = this.canvas.height - 80;
        }
    }
    
    initStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 2 + 0.5
            });
        }
    }
    
    setupEventListeners() {
        // Mouse/Touch movement
        const handleMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            if (e.touches) {
                this.mouseX = e.touches[0].clientX - rect.left;
                this.mouseY = e.touches[0].clientY - rect.top;
            } else {
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            }
            // Smooth player movement towards mouse
            this.player.x = this.mouseX;
            this.player.y = Math.min(this.mouseY, this.canvas.height - 60);
        };
        
        this.canvas.addEventListener('mousemove', handleMove);
        this.canvas.addEventListener('touchmove', handleMove);
        
        // Shooting
        const handleShoot = (e) => {
            e.preventDefault();
            this.isMouseDown = true;
        };
        
        const handleShootEnd = () => {
            this.isMouseDown = false;
        };
        
        this.canvas.addEventListener('mousedown', handleShoot);
        this.canvas.addEventListener('touchstart', handleShoot);
        this.canvas.addEventListener('mouseup', handleShootEnd);
        this.canvas.addEventListener('touchend', handleShootEnd);
        
        // Pause on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPlaying) {
                this.togglePause();
            }
        });
        
        // Resize
        window.addEventListener('resize', () => this.resize());
    }
    
    startLevel(levelId) {
        this.currentLevel = levelId;
        this.wave = 1;
        this.score = 0;
        this.health = CONFIG.maxHealth;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.boss = null;
        this.bossActive = false;
        this.enemiesSpawned = 0;
        this.totalEnemies = CONFIG.enemiesPerWave * CONFIG.wavesBeforeBoss;
        this.isPlaying = true;
        this.isPaused = false;
        
        // Ensure pause overlay is hidden
        document.getElementById('pause-overlay').classList.add('hidden');
        
        this.updateHUD();
        this.initStars();
        
        // Set background color based on level
        const level = LEVELS[levelId];
        this.canvas.style.background = level.background;
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        if (!this.isPaused) {
            this.update();
            this.render();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        const now = Date.now();
        
        // Update stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        // Shooting
        if (this.isMouseDown && now - this.lastShot > CONFIG.fireRate) {
            this.shoot();
            this.lastShot = now;
        }
        
        // Spawn enemies
        if (!this.bossActive && this.enemiesSpawned < this.totalEnemies) {
            if (now - this.lastSpawn > CONFIG.enemySpawnRate) {
                this.spawnEnemy();
                this.lastSpawn = now;
            }
        } else if (!this.bossActive && this.enemies.length === 0) {
            // Wave cleared
            this.wave++;
            if (this.wave > CONFIG.wavesBeforeBoss && !this.bossActive) {
                this.spawnBoss();
            }
            this.enemiesSpawned = 0;
            this.totalEnemies = CONFIG.enemiesPerWave * CONFIG.wavesBeforeBoss;
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= CONFIG.bulletSpeed;
            return bullet.y > -10;
        });
        
        // Update enemies
        this.enemies = this.enemies.filter(enemy => {
            enemy.y += enemy.speed;
            enemy.x += Math.sin(enemy.y * 0.05) * enemy.wobble;
            
            // Check collision with player
            if (this.checkCollision(enemy, this.player)) {
                this.takeDamage(10);
                this.createExplosion(enemy.x, enemy.y, '#ff6b6b');
                AudioSystem.playHit();
                return false;
            }
            
            // Check collision with bullets
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.checkCollision(enemy, this.bullets[i])) {
                    enemy.health--;
                    this.bullets.splice(i, 1);
                    if (enemy.health <= 0) {
                        this.createExplosion(enemy.x, enemy.y, '#ffaa00');
                        this.score += CONFIG.scorePerEnemy;
                        AudioSystem.playExplosion();
                        return false;
                    }
                }
            }
            
            return enemy.y < this.canvas.height + 50;
        });
        
        // Update boss
        if (this.bossActive && this.boss) {
            this.boss.x += this.boss.speedX;
            this.boss.y += this.boss.speedY;
            
            // Bounce off walls
            if (this.boss.x <= 50 || this.boss.x >= this.canvas.width - 50) {
                this.boss.speedX *= -1;
            }
            if (this.boss.y <= 100 || this.boss.y >= this.canvas.height - 200) {
                this.boss.speedY *= -1;
            }
            
            // Boss shooting
            if (Math.random() < 0.02) {
                this.bossShoot();
            }
            
            // Check collision with player
            if (this.checkCollision(this.boss, this.player)) {
                this.takeDamage(CONFIG.bossDamage);
            }
            
            // Check collision with bullets
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.checkCollision(this.boss, this.bullets[i])) {
                    this.boss.health--;
                    this.bullets.splice(i, 1);
                    this.createExplosion(this.bullets[i].x, this.bullets[i].y, '#ff00ff');
                    
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
        
        this.updateHUD();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = LEVELS[this.currentLevel].background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.5;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw player
        this.drawPlayer();
        
        // Draw bullets
        this.ctx.fillStyle = '#4a9eff';
        this.bullets.forEach(bullet => {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color || '#ff6b6b';
            this.ctx.beginPath();
            if (enemy.type === 'pattern') {
                // Diamond shape
                this.ctx.moveTo(enemy.x, enemy.y - 15);
                this.ctx.lineTo(enemy.x + 15, enemy.y);
                this.ctx.lineTo(enemy.x, enemy.y + 15);
                this.ctx.lineTo(enemy.x - 15, enemy.y);
            } else {
                // Circle
                this.ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
            }
            this.ctx.fill();
        });
        
        // Draw boss
        if (this.bossActive && this.boss) {
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.beginPath();
            this.ctx.arc(this.boss.x, this.boss.y, 40, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Boss health bar
            const bossHealthPercent = this.boss.health / this.boss.maxHealth;
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fillRect(this.boss.x - 30, this.boss.y - 55, 60, 8);
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(this.boss.x - 30, this.boss.y - 55, 60 * bossHealthPercent, 8);
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
    }
    
    drawPlayer() {
        const p = this.player;
        this.ctx.fillStyle = p.color;
        
        // Ship body
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y - 25);
        this.ctx.lineTo(p.x - 20, p.y + 20);
        this.ctx.lineTo(p.x, p.y + 10);
        this.ctx.lineTo(p.x + 20, p.y + 20);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Cockpit
        this.ctx.fillStyle = '#6abfff';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y - 5, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Engine glow
        this.ctx.fillStyle = `rgba(255, 150, 50, ${Math.random() * 0.5 + 0.5})`;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x - 10, p.y + 20);
        this.ctx.lineTo(p.x, p.y + 35);
        this.ctx.lineTo(p.x + 10, p.y + 20);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    shoot() {
        this.bullets.push({
            x: this.player.x,
            y: this.player.y - 30
        });
        AudioSystem.playLaser();
    }
    
    spawnEnemy() {
        const level = LEVELS[this.currentLevel];
        const types = ['basic', 'pattern', 'smart', 'variable', 'function', 'bug', 'elite'];
        const type = level.enemyType || 'basic';
        
        this.enemies.push({
            x: Math.random() * (this.canvas.width - 60) + 30,
            y: -30,
            speed: CONFIG.enemyBaseSpeed + (this.currentLevel * 0.5),
            health: CONFIG.enemyBaseHealth + Math.floor(this.currentLevel / 2),
            wobble: type === 'pattern' ? 3 : 1,
            color: level.color,
            type: type
        });
        
        this.enemiesSpawned++;
    }
    
    spawnBoss() {
        const level = LEVELS[this.currentLevel];
        this.boss = {
            x: this.canvas.width / 2,
            y: 150,
            speedX: 3,
            speedY: 2,
            health: CONFIG.bossHealth + this.currentLevel,
            maxHealth: CONFIG.bossHealth + this.currentLevel,
            name: level.bossName
        };
        this.bossActive = true;
        
        document.getElementById('boss-warning').classList.remove('hidden');
        AudioSystem.playBossWarning();
        
        setTimeout(() => {
            document.getElementById('boss-warning').classList.add('hidden');
        }, 3000);
    }
    
    bossShoot() {
        // Boss shoots multiple bullets
        for (let i = -2; i <= 2; i++) {
            this.bullets.push({
                x: this.boss.x,
                y: this.boss.y + 40,
                vx: i * 2,
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
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.gameOver();
        }
        this.updateHUD();
    }
    
    updateHUD() {
        document.getElementById('health-fill').style.width = `${this.health}%`;
        document.getElementById('health-text').textContent = `HP: ${this.health}%`;
        document.getElementById('score').textContent = this.score;
        document.getElementById('current-planet').textContent = LEVELS[this.currentLevel].name;
        document.getElementById('wave-counter').textContent = `Wave: ${Math.min(this.wave, CONFIG.wavesBeforeBoss)}/${CONFIG.wavesBeforeBoss}`;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pause-overlay');
        if (this.isPaused) {
            pauseOverlay.classList.remove('hidden');
        } else {
            pauseOverlay.classList.add('hidden');
        }
    }
    
    resume() {
        this.isPaused = false;
        document.getElementById('pause-overlay').classList.add('hidden');
    }
    
    bossDefeated() {
        this.bossActive = false;
        this.createExplosion(this.boss.x, this.boss.y, '#ff00ff');
        this.createExplosion(this.boss.x, this.boss.y, '#ffffff');
        this.score += CONFIG.scorePerBoss;
        AudioSystem.playExplosion();
        AudioSystem.playVictory();
        
        // Show puzzle
        setTimeout(() => {
            Game.showPuzzleScreen();
        }, 1000);
    }
    
    gameOver() {
        this.isPlaying = false;
        AudioSystem.playDefeat();
        Game.handleLevelLoss();
    }
}
