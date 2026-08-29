// Main Game Controller - Code Defender
const Game = {
    currentLevel: 0,
    conqueredPlanets: [],
    totalScore: 0,
    shooter: null,
    isPaused: false,
    selectedShip: 0,
    stats: {
        enemiesKilled: 0,
        powerupsCollected: 0,
        flawlessWaves: 0,
        bombsUsed: 0,
        maxCombo: 0
    },
    unlockedMessages: [],
    achievements: [],
    lastRun: null,
    lockAchievementSave: false,

    init() {
        AudioSystem.init();
        
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        this.shooter = new ShooterGame(canvas);
        this.shooter.startMenu();
        this.loadGame();
        this.updateMainMenu();
        this.renderShipSelector();
        this.setupEventListeners();
        this.updatePlanetStatus();
    },

    updateMainMenu() {
        const config = CONFIG.playerConfig || {};
        const els = {
            commander: document.getElementById('commander-name'),
            squad: document.getElementById('squad-name'),
            ship: document.getElementById('ship-name')
        };
        
        if (els.commander) els.commander.textContent = config.commanderName || 'Ariba Zaher';
        if (els.squad) els.squad.textContent = config.squadName || 'Warbringers';
        if (els.ship) els.ship.textContent = config.shipName || 'Urran Khatola';
    },

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.shooter && this.shooter.isPlaying && !this.shooter.menuMode) {
                this.pauseGame();
            }
        });
    },

    startCampaign() {
        this.currentLevel = this.conqueredPlanets.length > 0 ? this.conqueredPlanets.length : 0;
        this.showIntro();
    },

    showIntro() {
        const cfg = CONFIG.playerConfig || {};
        const name = cfg.commanderName || 'Commander';
        const letter = document.getElementById('intro-letter');
        if (letter) {
            letter.innerHTML = `
                <div style="border-bottom: 1px solid rgba(0,243,255,0.35); padding-bottom: 10px; margin-bottom: 12px; font-style: normal;">
                    <strong>TO:</strong> Commander ${name}<br>
                    <strong>FROM:</strong> Sector Command — Eyes Only
                </div>
                <p>"The galaxy tests everyone, ${name} — but few are chosen to answer.</p>
                <p>Every line of code you write, every call you make echoes across the stars. They will test your logic and your heart.</p>
                <p>Prove that a sharp mind and a brave spirit are the most powerful weapons in the universe. Earth believes in you."</p>
                <div style="margin-top: 12px; color: var(--secondary-color); font-weight: 700; font-style: normal;">— Your Commander</div>
            `;
        }
        this.hideAllScreens();
        document.getElementById('intro-screen').classList.remove('hidden');
    },

    beginFromIntro() {
        this.showBriefing(this.currentLevel);
    },

    showBriefing(levelId) {
        if (levelId >= LEVELS.length) levelId = LEVELS.length - 1;
        
        const level = LEVELS[levelId];
        document.getElementById('level-title').textContent = `${level.name} - ${level.concept}`;
        document.getElementById('briefing-text').innerHTML = level.briefing;
        document.getElementById('concept-name').textContent = level.concept;
        document.getElementById('concept-desc').textContent = level.description;
        
        this.hideAllScreens();
        document.getElementById('briefing-screen').classList.remove('hidden');
    },

    launchMission() {
        this.startLevel(this.currentLevel);
    },

    restartLevel() {
        this.startLevel(this.currentLevel);
    },

    toggleSound() {
        AudioSystem.enabled = !AudioSystem.enabled;
        const btn = document.getElementById('settings-btn');
        if (btn) btn.textContent = AudioSystem.enabled ? 'SOUND: ON' : 'SOUND: OFF';
    },

    startLevel(levelId) {
        this.currentLevel = levelId;
        this.isPaused = false;
        
        this.closePuzzle();
        this.hideAllScreens();
        document.getElementById('hud').style.display = 'flex';
        document.getElementById('wave-progress').style.display = 'block';
        
        if (this.shooter) {
            this.shooter.startLevel(levelId);
        }
    },

    pauseGame() {
        if (!this.shooter || !this.shooter.isPlaying) return;
        
        this.isPaused = true;
        this.shooter.pause();
        
        this.hideAllScreens();
        document.getElementById('pause-menu').classList.remove('hidden');
    },

    resumeGame() {
        if (!this.shooter) return;
        
        this.isPaused = false;
        this.shooter.resume();
        
        this.hideAllScreens();
        document.getElementById('hud').style.display = 'flex';
        document.getElementById('wave-progress').style.display = 'block';
    },

    quitToMenu() {
        if (this.shooter) {
            this.shooter.stop();
            this.shooter.startMenu();
        }
        this.isPaused = false;
        
        this.closePuzzle();
        this.hideAllScreens();
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('hud').style.display = 'none';
        document.getElementById('wave-progress').style.display = 'none';
        
        this.updatePlanetStatus();
        this.saveGame();
        this.renderShipSelector();
    },

    showPuzzleScreen() {
        if (!this.shooter || !this.shooter.isPlaying) return;
        
        const puzzle = PuzzleSystem.generatePuzzle(this.currentLevel);
        if (this.shooter) this.shooter.pause();
        
        const modal = document.getElementById('puzzle-modal');
        const question = document.getElementById('puzzle-question');
        if (question) question.textContent = puzzle.instruction || puzzle.title;
        PuzzleSystem.renderPuzzle(puzzle);
        modal.classList.add('active');
    },

    closePuzzle() {
        const modal = document.getElementById('puzzle-modal');
        if (modal) modal.classList.remove('active');
    },

    submitPuzzle() {
        if (!PuzzleSystem.currentPuzzle) return;
        if (PuzzleSystem.checkAnswer()) {
            this.closePuzzle();
            this.handleLevelWin();
        }
    },

    showPuzzleHint() {
        PuzzleSystem.showHint();
    },

    handleLevelWin() {
        AudioSystem.playVictory();
        this.totalScore += (this.shooter ? this.shooter.score : 0) + CONFIG.scorePerPuzzle;
        
        if (!this.conqueredPlanets.includes(this.currentLevel)) {
            this.conqueredPlanets.push(this.currentLevel);
            if (!this.unlockedMessages.includes(this.currentLevel)) {
                this.unlockedMessages.push(this.currentLevel);
            }
        }
        
        this.evaluateAchievements();
        this.saveGame();
        this.quitToMenu();
        
        if (this.currentLevel < LEVELS.length - 1) {
            this.currentLevel++;
            setTimeout(() => this.showBriefing(this.currentLevel), 500);
        } else {
            this.showVictoryComplete();
        }
        
        this.updatePlanetStatus();
    },

    handleLevelLoss() {
        if (this.currentLevel === 0) {
            this.showGameOver(true);
        } else {
            this.handleRetreat();
        }
    },

    handleRetreat() {
        if (this.currentLevel > 0) {
            this.currentLevel = Math.max(0, this.currentLevel - 1);
            this.conqueredPlanets = this.conqueredPlanets.filter(p => p <= this.currentLevel);
            this.saveGame();
            this.quitToMenu();
            setTimeout(() => this.showBriefing(this.currentLevel), 500);
            this.updatePlanetStatus();
        }
    },

    showGameOver(isEarthLost) {
        this.quitToMenu();
        
        const endScreen = document.getElementById('end-screen');
        const endTitle = document.getElementById('end-title');
        const endMessage = document.getElementById('end-message');
        
        endScreen.classList.remove('hidden');
        endTitle.textContent = isEarthLost ? 'EARTH HAS FALLEN' : 'MISSION FAILED';
        const fallenPlanet = LEVELS[this.currentLevel] ? LEVELS[this.currentLevel].name : 'the sector';
        endMessage.textContent = isEarthLost 
            ? 'Humanity has been enslaved. The alien empire rules the universe.'
            : `The aliens have overwhelmed ${fallenPlanet}!`;
    },

    showVictoryComplete() {
        AudioSystem.playVictory();
        this.quitToMenu();
        
        const cfg = CONFIG.playerConfig || {};
        const name = cfg.commanderName || 'Commander';
        
        this.lastRun = {
            planets: this.conqueredPlanets.length,
            score: this.totalScore,
            date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        };
        
        const endScreen = document.getElementById('end-screen');
        const endTitle = document.getElementById('end-title');
        const endMessage = document.getElementById('end-message');
        
        endScreen.classList.remove('hidden');
        endTitle.textContent = 'EARTH IS FREE!';
        endMessage.innerHTML = `
            <p style="font-size: 1.3rem; color: var(--success-color);">You defeated the Alien Overlord and saved humanity!</p>
            <p style="font-size: 1rem;">
                Planets Conquered: ${this.conqueredPlanets.length}/${LEVELS.length}<br>
                Total Score: ${this.totalScore}
            </p>
            <p style="font-size: 1.1rem; margin-top: 20px; font-style: italic;">
                For ${name} — the stars bow to you, Commander. ✨
            </p>
        `;
        
        const dispatchBtn = document.getElementById('dispatch-btn');
        const certBtn = document.getElementById('cert-btn');
        if (dispatchBtn) dispatchBtn.style.display = 'inline-block';
        if (certBtn) certBtn.style.display = 'inline-block';
        
        this.conqueredPlanets = [];
        this.currentLevel = 0;
        this.saveGame();
    },

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
    },

    updatePlanetStatus() {
        if (this.currentLevel < LEVELS.length) {
            const planetDisplay = document.getElementById('planet-display');
            if (planetDisplay) {
                planetDisplay.textContent = `TARGET: ${LEVELS[this.currentLevel].name.toUpperCase()}`;
            }
        }
    },

    // Extra screens ---------------------------------------------------------

    showDispatch() {
        const cfg = CONFIG.playerConfig || {};
        const name = cfg.commanderName || 'Commander';
        const body = document.getElementById('dispatch-body');
        if (body) {
            body.innerHTML = `<h3 style="color: var(--primary-color); border-bottom: 1px solid rgba(0,243,255,0.35); padding-bottom: 10px; margin-bottom: 12px;">FINAL TRANSMISSION — FOR COMMANDER ${name.toUpperCase()}</h3>` + FINAL_MESSAGE;
        }
        this.hideAllScreens();
        document.getElementById('dispatch-screen').classList.remove('hidden');
    },

    closeDispatch() {
        this.hideAllScreens();
        const endScreen = document.getElementById('end-screen');
        if (endScreen) endScreen.classList.remove('hidden');
    },

    showLog() {
        const list = document.getElementById('planet-log-list');
        if (list) {
            const items = LEVELS.map((level, i) => {
                const unlocked = this.unlockedMessages.includes(i);
                const secret = PLANET_SECRETS[i] ? PLANET_SECRETS[i].split(':')[0] : level.name;
                const body = PLANET_SECRETS[i] ? PLANET_SECRETS[i].split(':').slice(1).join(':').trim() : '';
                return `
                    <div class="log-entry ${unlocked ? 'unlocked' : ''}">
                        <div class="log-planet" style="color: ${level.color}; font-weight: 700;">🌐 ${level.name.toUpperCase()}</div>
                        <div class="log-secret">${unlocked ? '“' + body + '”' : '🔒 ENCRYPTED — conquer this planet to unlock'}</div>
                    </div>
                `;
            }).join('');
            list.innerHTML = items;
        }
        this.renderAchievementsTab();
        this.hideAllScreens();
        const logScreen = document.getElementById('log-screen');
        logScreen.classList.remove('hidden');
        this.switchLogTab('planets');
    },

    renderAchievementsTab() {
        const list = document.getElementById('achievement-log-list');
        if (!list) return;
        const earned = new Set(this.achievements);
        const items = ACHIEVEMENTS.map(ach => {
            const got = earned.has(ach.id);
            return `
                <div class="log-entry ${got ? 'unlocked' : ''}">
                    <div class="log-planet">${got ? '🏆' : '🔒'} ${ach.title}</div>
                    <div class="log-secret">${ach.desc}</div>
                </div>
            `;
        }).join('');
        list.innerHTML = items;
    },

    switchLogTab(tab) {
        const planetsTab = document.getElementById('log-tab-planets');
        const achTab = document.getElementById('log-tab-achievements');
        const planetsList = document.getElementById('planet-log-list');
        const achList = document.getElementById('achievement-log-list');
        if (tab === 'achievements') {
            if (achTab) achTab.style.fontWeight = '700';
            if (achTab) achTab.style.borderBottom = '3px solid var(--secondary-color)';
            if (planetsTab) { planetsTab.style.fontWeight = '400'; planetsTab.style.borderBottom = 'none'; }
            if (achList) achList.style.display = 'block';
            if (planetsList) planetsList.style.display = 'none';
        } else {
            if (planetsTab) planetsTab.style.fontWeight = '700';
            if (planetsTab) planetsTab.style.borderBottom = '3px solid var(--primary-color)';
            if (achTab) { achTab.style.fontWeight = '400'; achTab.style.borderBottom = 'none'; }
            if (achList) achList.style.display = 'none';
            if (planetsList) planetsList.style.display = 'block';
        }
    },

    showCertificate() {
        const cfg = CONFIG.playerConfig || {};
        const name = cfg.commanderName || 'Commander';
        const run = this.lastRun || { planets: this.conqueredPlanets.length, score: this.totalScore, date: new Date().toLocaleDateString() };
        
        const nameEl = document.getElementById('cert-name');
        if (nameEl) nameEl.textContent = name.toUpperCase();
        const planets = LEVELS.length;
        const planetsEl = document.getElementById('cert-planets');
        if (planetsEl) planetsEl.textContent = `${run.planets} of ${planets}`;
        const scoreEl = document.getElementById('cert-score');
        if (scoreEl) scoreEl.textContent = run.score.toLocaleString();
        const dateEl = document.getElementById('cert-date');
        if (dateEl) dateEl.textContent = run.date;
        
        this.hideAllScreens();
        document.getElementById('cert-screen').classList.remove('hidden');
    },

    renderShipSelector() {
        const container = document.getElementById('ship-options');
        if (!container || !this.shooter) return;
        container.innerHTML = '';
        SHIP_SKINS.forEach((skin, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ship-option' + (i === this.selectedShip ? ' selected' : '');
            btn.innerHTML = `<span class="ship-preview"><canvas width="64" height="44"></canvas></span><span class="ship-name">${skin.name}</span>`;
            btn.addEventListener('click', () => this.selectShip(i));
            const canvas = btn.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            if (this.shooter && this.shooter.drawShipPreview) {
                this.shooter.drawShipPreview(ctx, skin, canvas.width, canvas.height);
            }
            container.appendChild(btn);
        });
    },

    useBomb() {
        if (this.shooter) this.shooter.useBomb();
    },

    saveGame() {
        const saveData = {
            conqueredPlanets: this.conqueredPlanets,
            totalScore: this.totalScore,
            currentLevel: this.currentLevel,
            selectedShip: this.selectedShip,
            stats: this.stats,
            unlockedMessages: this.unlockedMessages,
            achievements: this.achievements
        };
        localStorage.setItem(CONFIG.saveKey, JSON.stringify(saveData));
    },

    loadGame() {
        const saveData = localStorage.getItem(CONFIG.saveKey);
        if (saveData) {
            const data = JSON.parse(saveData);
            this.conqueredPlanets = data.conqueredPlanets || [];
            this.totalScore = data.totalScore || 0;
            this.currentLevel = data.currentLevel || 0;
            if (typeof data.selectedShip === 'number') this.selectedShip = data.selectedShip;
            if (data.stats) this.stats = Object.assign(this.stats, data.stats);
            this.unlockedMessages = data.unlockedMessages || [];
            this.achievements = data.achievements || [];
        }
    },

    // Profile helpers -----------------------------------------------------

    bumpStat(key, amount) {
        if (amount === undefined) amount = 1;
        this.stats[key] = (this.stats[key] || 0) + amount;
        if (key === 'maxCombo') {
            const combo = this.shooter ? this.shooter.combo : 0;
            if (combo > this.stats.maxCombo) this.stats.maxCombo = combo;
        }
        this.evaluateAchievements();
    },

    selectShip(index) {
        if (!SHIP_SKINS[index]) return;
        this.selectedShip = index;
        if (this.shooter) {
            const skin = SHIP_SKINS[index];
            this.shooter.player.color = skin.color;
            this.shooter.shipShape = skin.shape;
        }
        this.renderShipSelector();
        this.saveGame();
    },

    evaluateAchievements() {
        const earned = new Set(this.achievements);
        let newlyEarned = [];
        ACHIEVEMENTS.forEach(ach => {
            if (earned.has(ach.id)) return;
            let unlocked = false;
            if (ach.planets) {
                unlocked = this.conqueredPlanets.length >= LEVELS.length;
            } else if (ach.score !== undefined) {
                unlocked = this.totalScore >= (ach.min || 0);
            } else if (ach.stat) {
                unlocked = (this.stats[ach.stat] || 0) >= (ach.min || 1);
            }
            if (unlocked) {
                earned.add(ach.id);
                newlyEarned.push(ach);
            }
        });
        if (newlyEarned.length > 0) {
            this.achievements = Array.from(earned);
            this.showToast(`${newlyEarned[0].title} ✦ ACHIEVEMENT UNLOCKED!`);
            this.saveGame();
        }
    },

    showToast(text) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = text;
        toast.classList.remove('shown');
        void toast.offsetWidth;
        toast.classList.add('shown');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('shown');
        }, 2600);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
