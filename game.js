// Game State
const game = {
    state: {
        currentScreen: 'start',
        selectedAircraft: null,
        scenarioIndex: 0,
        codingIndex: 0,
        score: 0,
        totalQuestions: 0
    },
    
    // Initialize game
    init() {
        this.setupBackgroundSlideshow();
        this.showScreen('start-screen');
        this.updateStartScreen();
    },
    
    // Background slideshow
    setupBackgroundSlideshow() {
        const slides = document.querySelectorAll('.bg-slide');
        let currentSlide = 0;
        
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change every 5 seconds
    },
    
    // Update start screen with config
    updateStartScreen() {
        const squadEl = document.getElementById('start-squad');
        if (squadEl && CONFIG) {
            squadEl.textContent = `${CONFIG.recipient.rank} ${CONFIG.recipient.name} - ${CONFIG.recipient.squadName} Squad`;
        }
    },
    
    // Show specific screen
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');
        this.state.currentScreen = screenId;
    },
    
    // Start game
    start() {
        this.state.scenarioIndex = 0;
        this.state.codingIndex = 0;
        this.state.score = 0;
        this.state.totalQuestions = SURVIVAL_SCENARIOS.length + DECISION_SCENARIOS.length + CODING_CHALLENGES.length;
        this.showBriefing();
    },
    
    // Show briefing
    showBriefing() {
        const briefingEl = document.getElementById('briefing-content');
        if (briefingEl && CONFIG) {
            briefingEl.innerHTML = `
                <p><strong>${CONFIG.story.briefingOfficer}:</strong> "${CONFIG.recipient.name}, report in!"</p>
                <br>
                <p>The ${CONFIG.story.enemyName} are preparing to invade. We've detected their fleet approaching ${CONFIG.homePlanet}.</p>
                <br>
                <p>Your mission: Navigate through hostile space, make critical decisions, and prove you have what it takes to defend us.</p>
                <br>
                <p>Remember - failure means capture. The ${CONFIG.story.enemyName} don't take prisoners... they take slaves.</p>
                <br>
                <p><em>"Your ${CONFIG.recipient.specialAbility} will be your greatest asset. Good luck, ${CONFIG.recipient.rank}."</em></p>
            `;
        }
        this.showScreen('briefing-screen');
    },
    
    // Go to aircraft selection
    toAircraftSelect() {
        const aircraftList = document.getElementById('aircraft-list');
        if (aircraftList) {
            aircraftList.innerHTML = AIRCRAFT.map((aircraft, index) => `
                <div class="aircraft-card" onclick="game.selectAircraft(${index})">
                    <div class="aircraft-icon">${aircraft.icon}</div>
                    <div class="aircraft-name">${aircraft.name}</div>
                    <div class="aircraft-stats">
                        Speed: ${aircraft.speed}<br>
                        Defense: ${aircraft.defense}<br>
                        Firepower: ${aircraft.firepower}
                    </div>
                </div>
            `).join('');
        }
        this.showScreen('aircraft-screen');
    },
    
    // Select aircraft
    selectAircraft(index) {
        this.state.selectedAircraft = AIRCRAFT[index];
        this.startScenarios();
    },
    
    // Start scenarios
    startScenarios() {
        this.state.scenarioIndex = 0;
        this.state.phase = 'survival'; // survival, decision, coding
        this.loadScenario();
    },
    
    // Load current scenario
    loadScenario() {
        let scenario;
        let typeLabel;
        
        if (this.state.phase === 'survival') {
            scenario = SURVIVAL_SCENARIOS[this.state.scenarioIndex];
            typeLabel = 'Survival Challenge';
        } else if (this.state.phase === 'decision') {
            scenario = DECISION_SCENARIOS[this.state.scenarioIndex];
            typeLabel = 'Critical Decision';
        } else {
            scenario = CODING_CHALLENGES[this.state.codingIndex];
            typeLabel = 'Systems Check';
        }
        
        if (!scenario) {
            this.nextPhase();
            return;
        }
        
        // Update UI
        const typeEl = document.getElementById('scenario-type');
        const countEl = document.getElementById('scenario-count');
        const questionEl = document.getElementById(this.state.phase === 'coding' ? 'coding-question' : 'scenario-question');
        const optionsContainer = document.getElementById(this.state.phase === 'coding' ? 'code-options' : 'options-list');
        const hintEl = document.getElementById('coding-hint');
        
        if (typeEl) typeEl.textContent = typeLabel;
        if (countEl) countEl.textContent = `${this.state.scenarioIndex + 1}/${SURVIVAL_SCENARIOS.length}`;
        
        if (questionEl) questionEl.textContent = scenario.question;
        
        if (hintEl && scenario.hint) {
            hintEl.textContent = `Hint: ${scenario.hint}`;
            hintEl.style.display = 'block';
        } else if (hintEl) {
            hintEl.style.display = 'none';
        }
        
        if (optionsContainer) {
            const className = this.state.phase === 'coding' ? 'code-option' : 'option-btn';
            optionsContainer.innerHTML = scenario.options.map((opt, idx) => `
                <div class="${className}" onclick="game.checkAnswer(${idx})">${opt}</div>
            `).join('');
        }
        
        if (this.state.phase === 'coding') {
            this.showScreen('coding-screen');
        } else {
            this.showScreen('scenario-screen');
        }
    },
    
    // Check answer
    checkAnswer(selectedIndex) {
        let scenario;
        if (this.state.phase === 'survival') {
            scenario = SURVIVAL_SCENARIOS[this.state.scenarioIndex];
        } else if (this.state.phase === 'decision') {
            scenario = DECISION_SCENARIOS[this.state.scenarioIndex];
        } else {
            scenario = CODING_CHALLENGES[this.state.codingIndex];
        }
        
        const optionsContainer = document.getElementById(this.state.phase === 'coding' ? 'code-options' : 'options-list');
        const buttons = optionsContainer.querySelectorAll('.option-btn, .code-option');
        
        // Mark correct/wrong
        buttons.forEach((btn, idx) => {
            if (idx === scenario.answer) {
                btn.classList.add('correct');
            } else if (idx === selectedIndex && idx !== scenario.answer) {
                btn.classList.add('wrong');
            }
        });
        
        // Disable further clicks
        buttons.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Track score
        if (selectedIndex === scenario.answer) {
            this.state.score++;
        }
        
        // Move to next after delay
        setTimeout(() => {
            if (this.state.phase === 'coding') {
                this.state.codingIndex++;
            } else {
                this.state.scenarioIndex++;
            }
            
            // Check if phase complete
            if (this.state.phase === 'survival' && this.state.scenarioIndex >= SURVIVAL_SCENARIOS.length) {
                this.state.phase = 'decision';
                this.state.scenarioIndex = 0;
            } else if (this.state.phase === 'decision' && this.state.scenarioIndex >= DECISION_SCENARIOS.length) {
                this.state.phase = 'coding';
                this.state.codingIndex = 0;
            }
            
            this.loadScenario();
        }, 1200);
    },
    
    // Next phase or end
    nextPhase() {
        if (this.state.phase === 'coding' && this.state.codingIndex >= CODING_CHALLENGES.length) {
            this.endGame();
        } else {
            this.loadScenario();
        }
    },
    
    // End game
    endGame() {
        const percentage = (this.state.score / this.state.totalQuestions) * 100;
        
        if (percentage >= 60) {
            this.showVictory(percentage);
        } else {
            this.showDefeat(percentage);
        }
    },
    
    // Show victory
    showVictory(percentage) {
        const msgEl = document.getElementById('victory-message');
        if (msgEl && CONFIG) {
            msgEl.innerHTML = `
                <p>Excellent work, ${CONFIG.recipient.rank} ${CONFIG.recipient.name}!</p>
                <br>
                <p>You successfully defended against the ${CONFIG.story.enemyName} invasion with ${(percentage).toFixed(0)}% accuracy.</p>
                <br>
                <p>Your ${CONFIG.recipient.squadName} Squad is proud. ${CONFIG.homePlanet} is safe... for now.</p>
                <br>
                <p><strong>Final Score:</strong> ${this.state.score}/${this.state.totalQuestions}</p>
            `;
        }
        this.showScreen('victory-screen');
    },
    
    // Show defeat
    showDefeat(percentage) {
        const msgEl = document.getElementById('defeat-message');
        if (msgEl && CONFIG) {
            msgEl.innerHTML = `
                <p>Mission failed, ${CONFIG.recipient.rank} ${CONFIG.recipient.name}.</p>
                <br>
                <p>The ${CONFIG.story.enemyName} have captured you. You're being taken back to their homeworld as a slave.</p>
                <br>
                <p>Your ${CONFIG.recipient.squadName} Squad mourns your loss. ${CONFIG.homePlanet}'s fate hangs in the balance...</p>
                <br>
                <p><strong>Score:</strong> ${this.state.score}/${this.state.totalQuestions} (${(percentage).toFixed(0)}%)</p>
                <br>
                <p><em>You need at least 60% to succeed. Try again!</em></p>
            `;
        }
        this.showScreen('defeat-screen');
    },
    
    // Restart game
    restart() {
        this.state.scenarioIndex = 0;
        this.state.codingIndex = 0;
        this.state.score = 0;
        this.state.selectedAircraft = null;
        this.showScreen('start-screen');
        this.updateStartScreen();
    }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
