/* ============================================
   SPACE MISSION GAME - MAIN GAME LOGIC
   ============================================ */

// Game state management
const GameState = {
    currentScene: 'intro',
    selectedAircraft: null,
    score: 0,
    currentScenarioType: null,
    currentScenarioIndex: 0,
    programmingLevel: 0,
    recipient: null,
    storyline: null
};

// Initialize game
function initGame() {
    // Load configuration
    GameState.recipient = GAME_CONFIG.recipient;
    GameState.storyline = GAME_CONFIG.storyline;
    
    // Start the game
    renderIntro();
}

// Utility function to set background
function setBackground(backgroundKey) {
    const bgLayer = document.getElementById('background-layer');
    const bgPath = GAME_CONFIG.backgrounds[backgroundKey];
    
    if (bgPath) {
        bgLayer.style.backgroundImage = `url(${bgPath})`;
    } else {
        // Default space-themed gradients
        const gradients = {
            intro: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0f0f2d 100%)',
            headquarters: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            aircraftSelection: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #1a1a3e 100%)',
            space: 'linear-gradient(135deg, #000000 0%, #0a0a2e 50%, #1a1a4e 100%)',
            victory: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 50%, #0a1a3e 100%)'
        };
        bgLayer.style.backgroundImage = gradients[backgroundKey] || gradients.intro;
    }
}

// Render functions for each scene
function renderIntro() {
    GameState.currentScene = 'intro';
    setBackground('intro');
    
    const content = document.getElementById('content-layer');
    content.innerHTML = `
        <div style="text-align: center;">
            <h1>🚀 SPACE MISSION</h1>
            <p style="font-size: 1.3em; margin: 30px 0; color: #a0c8ff;">
                Welcome, ${GameState.recipient.name}
            </p>
            <div class="character-info">
                <p><strong>Rank:</strong> ${GameState.recipient.rank}</p>
                <p><strong>Squad:</strong> ${GameState.recipient.squadName}</p>
                <p><strong>Special Ability:</strong> ${GameState.recipient.specialAbility}</p>
            </div>
            <p style="margin: 30px 0; line-height: 1.8;">
                The ${GameState.storyline.threatName} are preparing an invasion.<br>
                Your squad needs you at headquarters immediately.<br>
                The fate of humanity rests in your hands.
            </p>
            <button class="btn btn-success" onclick="renderHeadquarters()">
                Report to Headquarters
            </button>
        </div>
    `;
}

function renderHeadquarters() {
    GameState.currentScene = 'headquarters';
    setBackground('headquarters');
    
    const content = document.getElementById('content-layer');
    content.innerHTML = `
        <h2>📍 ${GameState.storyline.headquartersName} - Briefing Room</h2>
        
        <div class="character-info">
            <p><strong>Briefing Officer:</strong> ${GameState.storyline.briefingOfficer}</p>
            <p><strong>Threat Level:</strong> CRITICAL</p>
        </div>
        
        <div class="scenario-text">
            <p style="font-size: 1.1em; line-height: 1.8;">
                "Attention ${GameState.recipient.rank} ${GameState.recipient.name} of the ${GameState.recipient.squadName}!<br><br>
                
                Intelligence confirms that the ${GameState.storyline.threatName} are massing their forces 
                at the edge of our solar system. They're planning a full-scale invasion within hours.<br><br>
                
                You've been selected for a critical mission. You'll pilot one of our advanced spacecraft 
                to intercept and neutralize the threat.<br><br>
                
                Your unique ability in ${GameState.recipient.specialAbility} makes you ideal for this mission.<br><br>
                
                Head to the hangar and choose your aircraft. Time is running out!"
            </p>
        </div>
        
        <button class="btn btn-success" onclick="renderAircraftSelection()">
            Proceed to Hangar
        </button>
    `;
}

function renderAircraftSelection() {
    GameState.currentScene = 'aircraftSelection';
    setBackground('aircraftSelection');
    
    const content = document.getElementById('content-layer');
    
    let aircraftHTML = '';
    GAME_CONFIG.aircrafts.forEach(aircraft => {
        aircraftHTML += `
            <div class="aircraft-card" onclick="selectAircraft(${aircraft.id})">
                <h3>🛩️ ${aircraft.name}</h3>
                <p>${aircraft.description}</p>
                <div style="margin-top: 15px; font-size: 0.9em;">
                    <p>⚡ Speed: ${aircraft.speed}/100</p>
                    <p>🛡️ Armor: ${aircraft.armor}/100</p>
                    <p>💥 Firepower: ${aircraft.firepower}/100</p>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = `
        <h2>🛩️ Choose Your Spacecraft</h2>
        <p>Select the aircraft that best matches your combat style:</p>
        
        <div class="aircraft-grid">
            ${aircraftHTML}
        </div>
    `;
}

function selectAircraft(aircraftId) {
    const aircraft = GAME_CONFIG.aircrafts.find(a => a.id === aircraftId);
    GameState.selectedAircraft = aircraft;
    
    const content = document.getElementById('content-layer');
    content.innerHTML = `
        <h2>Excellent Choice!</h2>
        
        <div class="character-info" style="text-align: center;">
            <h3 style="color: #64c8ff; font-size: 1.5em;">🛩️ ${aircraft.name}</h3>
            <p style="margin: 15px 0;">${aircraft.description}</p>
            <p>⚡ Speed: ${aircraft.speed}/100 | 🛡️ Armor: ${aircraft.armor}/100 | 💥 Firepower: ${aircraft.firepower}/100</p>
        </div>
        
        <p style="margin: 30px 0; text-align: center;">
            Perfect match for your abilities, ${GameState.recipient.name}!<br>
            Prepare for launch. Your mission begins now.
        </p>
        
        <div style="text-align: center;">
            <button class="btn btn-success" onclick="startSpaceBattle()">
                🚀 Launch to Space
            </button>
        </div>
    `;
}

function startSpaceBattle() {
    GameState.currentScene = 'space';
    setBackground('space');
    
    // Randomly select scenario type
    const scenarioTypes = ['survival', 'decision', 'programming'];
    GameState.currentScenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    GameState.currentScenarioIndex = 0;
    
    renderScenario();
}

function renderScenario() {
    const content = document.getElementById('content-layer');
    const type = GameState.currentScenarioType;
    
    if (type === 'programming') {
        renderProgrammingChallenge();
        return;
    }
    
    const scenarios = GAME_CONFIG.scenarios[type];
    const scenario = scenarios[GameState.currentScenarioIndex];
    
    if (!scenario) {
        renderVictory();
        return;
    }
    
    let optionsHTML = '';
    scenario.options.forEach((option, index) => {
        optionsHTML += `
            <button class="option-btn" onclick="handleScenarioAnswer(${index})">
                ${String.fromCharCode(65 + index)}. ${option}
            </button>
        `;
    });
    
    const typeName = type === 'survival' ? '🏃 Survival Challenge' : '🤔 Decision Point';
    
    content.innerHTML = `
        <h2>${typeName}</h2>
        
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((GameState.currentScenarioIndex + 1) / scenarios.length) * 100}%"></div>
            </div>
            <p style="text-align: center; margin-top: 5px; font-size: 0.9em;">
                Question ${GameState.currentScenarioIndex + 1} of ${scenarios.length}
            </p>
        </div>
        
        <div class="scenario-text">
            <p>${scenario.question}</p>
        </div>
        
        <div class="options-container">
            ${optionsHTML}
        </div>
    `;
}

function handleScenarioAnswer(selectedIndex) {
    const type = GameState.currentScenarioType;
    const scenarios = GAME_CONFIG.scenarios[type];
    const scenario = scenarios[GameState.currentScenarioIndex];
    
    const isCorrect = selectedIndex === scenario.correct;
    
    if (isCorrect) {
        GameState.score += 10;
    }
    
    const content = document.getElementById('content-layer');
    const resultClass = isCorrect ? 'success' : 'error';
    const resultText = isCorrect ? '✅ Correct!' : '❌ Not optimal';
    
    content.innerHTML = `
        <h2>${resultText}</h2>
        
        <div class="scenario-text ${resultClass}" style="border-left-color: ${isCorrect ? '#4caf50' : '#f44336'};">
            <p style="margin-bottom: 15px;"><strong>${resultClass === 'success' ? 'Excellent choice!' : 'Better option:'}</strong></p>
            <p>${scenario.explanation}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn btn-success" onclick="nextScenario()">
                Continue Mission
            </button>
        </div>
    `;
}

function nextScenario() {
    GameState.currentScenarioIndex++;
    
    const type = GameState.currentScenarioType;
    const scenarios = GAME_CONFIG.scenarios[type];
    
    if (GameState.currentScenarioIndex >= scenarios.length) {
        // Move to next scenario type or end
        const scenarioTypes = ['survival', 'decision', 'programming'];
        const currentIndex = scenarioTypes.indexOf(type);
        
        if (currentIndex < scenarioTypes.length - 1) {
            GameState.currentScenarioType = scenarioTypes[currentIndex + 1];
            GameState.currentScenarioIndex = 0;
            renderScenario();
        } else {
            renderVictory();
        }
    } else {
        renderScenario();
    }
}

function renderProgrammingChallenge() {
    const challenges = GAME_CONFIG.scenarios.programming;
    const challenge = challenges[GameState.programmingLevel];
    
    if (!challenge) {
        renderVictory();
        return;
    }
    
    const content = document.getElementById('content-layer');
    content.innerHTML = `
        <h2>💻 Programming Challenge - Level ${challenge.level}</h2>
        <h3 style="color: #64c8ff; margin: 15px 0;">${challenge.title}</h3>
        
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(challenge.level / challenges.length) * 100}%"></div>
            </div>
            <p style="text-align: center; margin-top: 5px; font-size: 0.9em;">
                Level ${challenge.level} of ${challenges.length}
            </p>
        </div>
        
        <div class="scenario-text">
            <p><strong>Task:</strong> ${challenge.instruction}</p>
            <p style="margin-top: 10px; color: #aaa;"><em>Expected: ${challenge.expectedOutput}</em></p>
        </div>
        
        <div class="code-editor">
            <div style="color: #64c8ff; margin-bottom: 10px;">// JavaScript Code Editor</div>
            <textarea id="codeInput" class="code-input" placeholder="${challenge.starterCode}">${challenge.starterCode}</textarea>
            
            <div id="codeOutput" class="code-output" style="display: none;"></div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-success" onclick="validateCode()">Run Code</button>
                <button class="btn btn-secondary" onclick="showHint()">Show Hint</button>
            </div>
        </div>
        
        <p id="hintText" style="margin-top: 15px; color: #f093fb; display: none;">
            💡 <strong>Hint:</strong> ${challenge.hint}
        </p>
    `;
}

function validateCode() {
    const code = document.getElementById('codeInput').value;
    const outputDiv = document.getElementById('codeOutput');
    const challenges = GAME_CONFIG.scenarios.programming;
    const challenge = challenges[GameState.programmingLevel];
    
    outputDiv.style.display = 'block';
    
    try {
        const isValid = challenge.validate(code);
        
        if (isValid) {
            outputDiv.innerHTML = '<span class="success">✅ Code executed successfully! Challenge completed.</span>';
            GameState.score += 20;
            GameState.programmingLevel++;
            
            setTimeout(() => {
                renderProgrammingChallenge();
            }, 2000);
        } else {
            outputDiv.innerHTML = '<span class="error">❌ Code didn\'t produce expected results. Try again!</span>';
        }
    } catch (error) {
        outputDiv.innerHTML = `<span class="error">❌ Error: ${error.message}</span>`;
    }
}

function showHint() {
    const hintDiv = document.getElementById('hintText');
    hintDiv.style.display = 'block';
}

function renderVictory() {
    GameState.currentScene = 'victory';
    setBackground('victory');
    
    const totalPossibleScore = 300; // 3 survival (30) + 3 decision (30) + 6 programming (120) + bonuses
    const percentage = (GameState.score / totalPossibleScore) * 100;
    
    let rank = 'Cadet';
    if (percentage > 80) rank = 'Squad Leader';
    else if (percentage > 60) rank = 'Veteran Pilot';
    else if (percentage > 40) rank = 'Skilled Operative';
    
    const content = document.getElementById('content-layer');
    content.innerHTML = `
        <div style="text-align: center;">
            <h1>🎉 MISSION ACCOMPLISHED! 🎉</h1>
            
            <p style="font-size: 1.3em; margin: 30px 0; color: #4caf50;">
                Congratulations, ${GameState.recipient.name}!
            </p>
            
            <div class="character-info">
                <p><strong>Final Rank:</strong> ${rank}</p>
                <p><strong>Score:</strong> ${GameState.score} / ${totalPossibleScore}</p>
                <p><strong>Aircraft:</strong> ${GameState.selectedAircraft ? GameState.selectedAircraft.name : 'Not selected'}</p>
                <p><strong>Squad:</strong> ${GameState.recipient.squadName}</p>
            </div>
            
            <div class="scenario-text" style="margin: 30px 0;">
                <p style="line-height: 1.8;">
                    Thanks to your quick thinking, survival skills, sound decision-making, 
                    and programming expertise, the ${GameState.storyline.threatName} invasion has been thwarted!<br><br>
                    
                    The ${GameState.recipient.squadName} salutes you, ${GameState.recipient.rank} ${GameState.recipient.name}.<br>
                    Your special ability in ${GameState.recipient.specialAbility} proved invaluable.<br><br>
                    
                    Peace has been restored to the galaxy... for now.
                </p>
            </div>
            
            <button class="btn btn-success" onclick="initGame()">
                Play Again
            </button>
        </div>
    `;
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
