// Main Game Controller
const Game = {
    currentLevel: 0,
    conqueredPlanets: [],
    totalScore: 0,
    attempts: 0,
    shooter: null,

    init() {
        // Initialize audio system
        AudioSystem.init();
        
        // Create shooter instance
        const canvas = document.getElementById('game-canvas');
        this.shooter = new ShooterGame(canvas);
        
        // Load saved game
        this.loadGame();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update planet status
        this.updatePlanetStatus();
    },

    setupEventListeners() {
        // Main menu buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.currentLevel = 0;
            this.showBriefing(0);
        });
        
        document.getElementById('continue-btn').addEventListener('click', () => {
            if (this.conqueredPlanets.length > 0) {
                this.currentLevel = this.conqueredPlanets.length;
                this.showBriefing(this.currentLevel);
            }
        });
        
        document.getElementById('instructions-btn').addEventListener('click', () => {
            this.showScreen('instructions-screen');
        });
        
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('main-menu');
            this.updatePlanetStatus();
        });
        
        // Briefing buttons
        document.getElementById('start-level-btn').addEventListener('click', () => {
            this.startLevel(this.currentLevel);
        });
        
        document.getElementById('back-from-briefing').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        // Puzzle buttons
        document.getElementById('submit-puzzle').addEventListener('click', () => {
            if (PuzzleSystem.checkAnswer()) {
                setTimeout(() => {
                    this.handleLevelWin();
                }, 1500);
            }
        });
        
        document.getElementById('hint-btn').addEventListener('click', () => {
            PuzzleSystem.showHint();
        });
        
        // Victory buttons
        document.getElementById('next-level-btn').addEventListener('click', () => {
            if (this.currentLevel < LEVELS.length - 1) {
                this.currentLevel++;
                this.showBriefing(this.currentLevel);
            } else {
                this.showVictoryComplete();
            }
        });
        
        document.getElementById('celebrate-btn').addEventListener('click', () => {
            AudioSystem.playVictory();
            this.createCelebration();
        });
        
        // Defeat buttons
        document.getElementById('retry-level-btn').addEventListener('click', () => {
            this.startLevel(this.currentLevel);
        });
        
        document.getElementById('retreat-btn').addEventListener('click', () => {
            this.handleRetreat();
        });
        
        // Pause buttons
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.shooter.resume();
        });
        
        document.getElementById('quit-to-menu').addEventListener('click', () => {
            this.shooter.isPlaying = false;
            this.showScreen('main-menu');
            this.updatePlanetStatus();
        });
        
        // Game over buttons
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            this.conqueredPlanets = [];
            this.totalScore = 0;
            this.currentLevel = 0;
            this.saveGame();
            this.showScreen('main-menu');
            this.updatePlanetStatus();
        });
        
        // Victory complete button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.conqueredPlanets = [];
            this.totalScore = 0;
            this.currentLevel = 0;
            this.saveGame();
            this.showScreen('main-menu');
            this.updatePlanetStatus();
        });
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    },

    showBriefing(levelId) {
        const level = LEVELS[levelId];
        document.getElementById('briefing-title').textContent = `${level.name} - ${level.concept}`;
        document.getElementById('briefing-content').innerHTML = level.briefing;
        this.showScreen('briefing-screen');
    },

    startLevel(levelId) {
        this.currentLevel = levelId;
        this.showScreen('game-screen');
        this.shooter.startLevel(levelId);
    },

    showPuzzleScreen() {
        const puzzle = PuzzleSystem.generatePuzzle(this.currentLevel);
        document.getElementById('puzzle-title').textContent = puzzle.title;
        document.getElementById('puzzle-instruction').textContent = puzzle.instruction;
        PuzzleSystem.renderPuzzle(puzzle);
        this.showScreen('puzzle-screen');
    },

    handleLevelWin() {
        AudioSystem.playVictory();
        this.totalScore += this.shooter.score + CONFIG.scorePerPuzzle;
        
        if (!this.conqueredPlanets.includes(this.currentLevel)) {
            this.conqueredPlanets.push(this.currentLevel);
        }
        
        this.saveGame();
        
        const level = LEVELS[this.currentLevel];
        document.getElementById('victory-message').textContent = 
            `You've defended ${level.name} and learned about ${level.concept}!`;
        
        if (this.currentLevel < LEVELS.length - 1) {
            const nextLevel = LEVELS[this.currentLevel + 1];
            document.getElementById('next-planet-preview').innerHTML = `
                <h3>Next Target: ${nextLevel.name}</h3>
                <p>Concept: ${nextLevel.concept}</p>
                <p>${nextLevel.description}</p>
            `;
        }
        
        this.showScreen('victory-screen');
        this.updatePlanetStatus();
    },

    handleLevelLoss() {
        const level = LEVELS[this.currentLevel];
        document.getElementById('defeat-message').textContent = 
            `The aliens have overwhelmed ${level.name}!`;
        
        if (this.currentLevel === 0) {
            // Lost Earth - Game Over
            document.getElementById('defeat-title').textContent = 'EARTH HAS FALLEN!';
            document.getElementById('retreat-info').innerHTML = `
                <p>All hope is lost. Humanity is enslaved.</p>
                <p>The alien empire rules the universe.</p>
            `;
            document.getElementById('retry-level-btn').style.display = 'inline-block';
            document.getElementById('retreat-btn').style.display = 'none';
        } else {
            // Retreat to previous planet
            const previousLevel = Math.max(0, this.currentLevel - 1);
            document.getElementById('retreat-info').innerHTML = `
                <p>Retreating to ${LEVELS[previousLevel].name}...</p>
                <p>Prepare for the alien assault there!</p>
            `;
            document.getElementById('retry-level-btn').style.display = 'inline-block';
            document.getElementById('retreat-btn').style.display = 'inline-block';
        }
        
        this.showScreen('defeat-screen');
    },

    handleRetreat() {
        if (this.currentLevel > 0) {
            this.currentLevel = Math.max(0, this.currentLevel - 1);
            
            // Remove conquered planets beyond current level
            this.conqueredPlanets = this.conqueredPlanets.filter(p => p <= this.currentLevel);
            
            this.saveGame();
            this.showBriefing(this.currentLevel);
            this.updatePlanetStatus();
        }
    },

    showVictoryComplete() {
        AudioSystem.playVictory();
        document.getElementById('complete-stats').innerHTML = `
            <div class="stat-row">
                <span>Planets Conquered:</span>
                <span>${this.conqueredPlanets.length}/${LEVELS.length}</span>
            </div>
            <div class="stat-row">
                <span>Total Score:</span>
                <span>${this.totalScore}</span>
            </div>
            <div class="stat-row">
                <span>Programming Concepts Mastered:</span>
                <span>All 7!</span>
            </div>
        `;
        this.showScreen('victory-complete-screen');
        this.conqueredPlanets = [];
        this.saveGame();
    },

    createCelebration() {
        // Simple celebration effect
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const color = colors[Math.floor(Math.random() * colors.length)];
                console.log(`🎉 Celebration particle ${i} in ${color}`);
            }, i * 100);
        }
    },

    updatePlanetStatus() {
        const container = document.getElementById('planet-status');
        const continueBtn = document.getElementById('continue-btn');
        
        if (this.conqueredPlanets.length === 0) {
            container.innerHTML = '<h3>No planets conquered yet</h3><p>Start your mission to defend Earth!</p>';
            continueBtn.style.display = 'none';
            return;
        }
        
        let html = '<h3>Conquered Planets</h3><div class="planets-grid">';
        
        LEVELS.forEach((level, index) => {
            let statusClass = '';
            let statusIcon = '⚪';
            
            if (this.conqueredPlanets.includes(index)) {
                statusClass = 'conquered';
                statusIcon = '✅';
            } else if (index === this.conqueredPlanets.length) {
                statusClass = 'current';
                statusIcon = '🎯';
            } else if (index < this.conqueredPlanets.length) {
                statusClass = 'lost';
                statusIcon = '❌';
            }
            
            html += `
                <div class="planet-item ${statusClass}">
                    ${statusIcon} ${level.name}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        if (this.conqueredPlanets.length > 0 && this.conqueredPlanets.length < LEVELS.length) {
            continueBtn.style.display = 'inline-block';
        } else {
            continueBtn.style.display = 'none';
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

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
