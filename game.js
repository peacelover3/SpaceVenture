// Main Game Controller - Code Defender
const Game = {
    currentLevel: 0,
    conqueredPlanets: [],
    totalScore: 0,
    shooter: null,
    isPaused: false,

    init() {
        AudioSystem.init();
        
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        this.shooter = new ShooterGame(canvas);
        this.loadGame();
        this.updateMainMenu();
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
            if (e.key === 'Escape' && this.shooter && this.shooter.isPlaying) {
                this.pauseGame();
            }
        });
    },

    startCampaign() {
        this.currentLevel = this.conqueredPlanets.length > 0 ? this.conqueredPlanets.length : 0;
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

    startLevel(levelId) {
        this.currentLevel = levelId;
        this.isPaused = false;
        
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
        if (this.shooter) this.shooter.stop();
        this.isPaused = false;
        
        this.hideAllScreens();
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('hud').style.display = 'none';
        document.getElementById('wave-progress').style.display = 'none';
        
        this.updatePlanetStatus();
    },

    handleLevelWin() {
        AudioSystem.playVictory();
        this.totalScore += (this.shooter ? this.shooter.score : 0) + CONFIG.scorePerPuzzle;
        
        if (!this.conqueredPlanets.includes(this.currentLevel)) {
            this.conqueredPlanets.push(this.currentLevel);
        }
        
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
        endMessage.textContent = isEarthLost 
            ? 'Humanity has been enslaved. The alien empire rules the universe.'
            : `The aliens have overwhelmed ${LEVELS[this.currentLevel].name}!`;
    },

    showVictoryComplete() {
        AudioSystem.playVictory();
        this.quitToMenu();
        
        const endScreen = document.getElementById('end-screen');
        const endTitle = document.getElementById('end-title');
        const endMessage = document.getElementById('end-message');
        
        endScreen.classList.remove('hidden');
        endTitle.textContent = 'VICTORY!';
        endMessage.innerHTML = `
            You've defeated the Alien Overlord and saved humanity!<br>
            Planets Conquered: ${this.conqueredPlanets.length}/${LEVELS.length}<br>
            Total Score: ${this.totalScore}
        `;
        
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

    saveGame() {
        const saveData = {
            conqueredPlanets: this.conqueredPlanets,
            totalScore: this.totalScore,
            currentLevel: this.currentLevel
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
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
