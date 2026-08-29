// Game Configuration - Code Defender: Galactic Protocol
const CONFIG = {
    // Player settings
    playerSpeed: 0.15,
    bulletSpeed: 10,
    fireRate: 150,
    maxHealth: 100,

    // Enemy settings
    enemySpawnRate: 800,
    enemyBaseSpeed: 2,
    enemyBaseHealth: 1,

    // Boss settings
    bossHealth: 50,
    bossDamage: 2,

    // Wave settings
    enemiesPerWave: 5,
    wavesBeforeBoss: 3,

    // Scoring
    scorePerEnemy: 100,
    scorePerBoss: 1000,
    scorePerPuzzle: 500,

    // Puzzle settings
    puzzleAttempts: 3,
    hintPenalty: 200,

    // Save key
    saveKey: 'codeDefenderSave',

    // Player configuration (customizable)
    playerConfig: {
        commanderName: 'Ariba Zaher',
        squadName: 'Warbringers',
        shipName: 'Urran Khatola'
    }
};

// Available ships for selection
const SHIPS = [
    { name: 'Urran Khatola', speed: 9, defense: 6, color: '#4a9eff' },
    { name: 'Star Trek', speed: 7, defense: 8, color: '#ff6b6b' },
    { name: 'Fortuna', speed: 8, defense: 7, color: '#6bff6b' },
    { name: 'Jupiter 2', speed: 6, defense: 9, color: '#ffaa6b' },
    { name: 'Millennium Falcon', speed: 10, defense: 5, color: '#ff6bff' },
    { name: 'Nostromo', speed: 5, defense: 10, color: '#6bffff' }
];

// Planet/Level Data with enhanced visuals and story
const LEVELS = [
    {
        id: 0,
        name: "Earth",
        color: "#4a9eff",
        concept: "Sequencing",
        description: "Our home planet! The aliens are attacking Earth first. You must defend it at all costs!",
        briefing: `
            <h3 style="color: #4a9eff;">🌍 EARTH - Mission 1: Sequencing</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Ship:</strong> Urran Khatola</p>
            <p><strong>Mission:</strong> Defend Earth from the initial alien invasion!</p>
            <p><strong>Programming Concept - Sequencing:</strong> Code executes line by line, in order. Just like following a recipe step-by-step!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #4a9eff;">
1. Wake up
2. Brush teeth
3. Eat breakfast
4. Go to school
            </pre>
            <p>If you change the order, things don't work right! In this level, you'll learn that doing things in the correct sequence is crucial.</p>
            <p><strong>Boss Challenge:</strong> Arrange the correct sequence of actions to defeat the mothership!</p>
        `,
        bgTop: "#0a0a1a",
        bgBottom: "#1a1a3a",
        enemyType: "basic",
        bossName: "Scout Mothership"
    },
    {
        id: 1,
        name: "TrES-2b",
        color: "#ff6b6b",
        concept: "Loops",
        description: "The darkest known planet! Aliens use repeating attack patterns here!",
        briefing: `
            <h3 style="color: #ff6b6b;">🌑 TrES-2b - Mission 2: Loops</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> Conquer your first alien planet!</p>
            <p><strong>Programming Concept - Loops:</strong> Repeat actions without writing the same code over and over!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #ff6b6b;">
// Instead of:
print("Hello")
print("Hello")
print("Hello")

// Use a loop:
for i in range(3):
    print("Hello")
            </pre>
            <p>Loops save time and make code cleaner! The aliens here attack in repeating patterns!</p>
            <p><strong>Boss Challenge:</strong> Identify the correct loop pattern to counter the alien attacks!</p>
        `,
        bgTop: "#1a0a0a",
        bgBottom: "#3a1a1a",
        enemyType: "pattern",
        bossName: "Loop Commander"
    },
    {
        id: 2,
        name: "Mars",
        color: "#c1440e",
        concept: "Conditions",
        description: "The Red Planet! Smart decisions matter in this jungle world!",
        briefing: `
            <h3 style="color: #c1440e;">🔴 MARS - Mission 3: Conditions (If/Else)</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> Make the right decisions to conquer Mars!</p>
            <p><strong>Programming Concept - Conditions:</strong> Make decisions in your code based on different situations!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #c1440e;">
if health < 30:
    retreat()
elif enemy_nearby:
    shoot()
else:
    explore()
            </pre>
            <p>Conditions let your program make smart decisions!</p>
            <p><strong>Boss Challenge:</strong> Choose the correct if/else logic to defeat the boss!</p>
        `,
        bgTop: "#1a0a0a",
        bgBottom: "#3a1a1a",
        enemyType: "smart",
        bossName: "Decision Master"
    },
    {
        id: 3,
        name: "Uranus",
        color: "#4fd0e7",
        concept: "Variables",
        description: "Ice giant! Full of stored energy variables!",
        briefing: `
            <h3 style="color: #4fd0e7;">🔵 URANUS - Mission 4: Variables</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> Capture the energy variables of Uranus!</p>
            <p><strong>Programming Concept - Variables:</strong> Store and remember values for later use!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #4fd0e7;">
player_health = 100
enemy_count = 5
score = 0

# Update variables
score = score + 100
enemy_count = enemy_count - 1
            </pre>
            <p>Variables are like labeled boxes that hold information!</p>
            <p><strong>Boss Challenge:</strong> Track and manipulate variables to power up your weapon!</p>
        `,
        bgTop: "#0a1a1a",
        bgBottom: "#1a3a3a",
        enemyType: "variable",
        bossName: "Variable Guardian"
    },
    {
        id: 4,
        name: "Saturn",
        color: "#ead6b8",
        concept: "Functions",
        description: "Ringed beauty! Reusable code is key to breaking through!",
        briefing: `
            <h3 style="color: #ead6b8;">🪐 SATURN - Mission 5: Functions</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> Break through Saturn's ring defenses!</p>
            <p><strong>Programming Concept - Functions:</strong> Reusable blocks of code that perform specific tasks!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #ead6b8;">
def shoot_enemy(target):
    aim(target)
    fire()
    return True

# Use the function multiple times
shoot_enemy(alien1)
shoot_enemy(alien2)
            </pre>
            <p>Functions let you write code once and use it many times!</p>
            <p><strong>Boss Challenge:</strong> Assemble the right function calls to disable the rings!</p>
        `,
        bgTop: "#1a1a0a",
        bgBottom: "#3a3a1a",
        enemyType: "function",
        bossName: "Function Core"
    },
    {
        id: 5,
        name: "Alpha Centauri A",
        color: "#ffdfba",
        concept: "Debugging",
        description: "Binary star system! Glitched enemy behavior detected!",
        briefing: `
            <h3 style="color: #ffdfba;">⭐ ALPHA CENTAURI A - Mission 6: Debugging</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> Find and fix the bugs in this corrupted zone!</p>
            <p><strong>Programming Concept - Debugging:</strong> Finding and fixing errors in code!</p>
            <p><strong>Common Bugs:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #ffdfba;">
# Bug: Wrong operator
score = score + 10  # Should be +=

# Bug: Off-by-one error
for i in range(1, 10):  # Misses index 0!

# Bug: Typo
prnt("Hello")  # Should be print()
            </pre>
            <p>Every programmer faces bugs! The key is to systematically find and fix them.</p>
            <p><strong>Boss Challenge:</strong> Spot the bugs in the alien code and fix them to win!</p>
        `,
        bgTop: "#1a0a1a",
        bgBottom: "#3a1a3a",
        enemyType: "bug",
        bossName: "Bug Queen"
    },
    {
        id: 6,
        name: "Kepler-16b",
        color: "#b8860b",
        concept: "Advanced Logic",
        description: "Circumbinary planet! The final stand before their homeworld!",
        briefing: `
            <h3 style="color: #b8860b;">🌟 KEPLER-16b - Mission 7: Advanced Logic</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> The penultimate battle!</p>
            <p><strong>All Concepts Combined:</strong> You'll need everything you've learned!</p>
            <ul style="text-align: left; display: inline-block;">
                <li>✅ Sequencing - Correct order matters</li>
                <li>✅ Loops - Efficient repetition</li>
                <li>✅ Conditions - Smart decisions</li>
                <li>✅ Variables - Track important data</li>
                <li>✅ Functions - Reusable solutions</li>
                <li>✅ Debugging - Fix errors quickly</li>
            </ul>
            <p><strong>Boss Challenge:</strong> A complex puzzle combining all concepts!</p>
        `,
        bgTop: "#1a1a0a",
        bgBottom: "#3a3a0a",
        enemyType: "elite",
        bossName: "Logic Emperor"
    },
    {
        id: 7,
        name: "Draugr",
        color: "#4b0082",
        concept: "Final Boss",
        description: "The Alien Homeworld! End the threat once and for all!",
        briefing: `
            <h3 style="color: #4b0082;">☠️ DRAUGR - Mission 8: FINAL BOSS</h3>
            <p><strong>Commander:</strong> Ariba Zaher</p>
            <p><strong>Squad:</strong> Warbringers</p>
            <p><strong>Mission:</strong> End the alien threat once and for all!</p>
            <p>This is it! The ultimate test of your programming knowledge!</p>
            <p><strong>Final Boss Challenge:</strong> A multi-stage puzzle combining all concepts!</p>
            <p><em>Victory means freedom for humanity! Defeat means... slavery...</em></p>
        `,
        bgTop: "#0a0a0a",
        bgBottom: "#1a0a1a",
        enemyType: "mothership",
        bossName: "Alien Overlord"
    }
];
