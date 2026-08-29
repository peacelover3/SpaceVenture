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
        commanderName: 'DEFENDER',
        squadName: 'ALPHA',
        shipName: 'PHOENIX'
    }
};

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
            <p><strong>Mission:</strong> Defend Earth from the initial alien invasion!</p>
            <p><strong>Squad:</strong> Alpha Squadron</p>
            <p><strong>Ship:</strong> Phoenix Fighter</p>
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
        color: "#ff6b6b",
        enemyType: "basic",
        bossName: "Scout Mothership"
    },
    {
        id: 1,
        name: "Zog Prime",
        color: "#ff6b6b",
        concept: "Loops",
        description: "A red desert planet where the aliens use repeating attack patterns!",
        briefing: `
            <h3 style="color: #ff6b6b;">🔴 ZOG PRIME - Mission 2: Loops</h3>
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
        color: "#ff4444",
        enemyType: "pattern",
        bossName: "Loop Commander"
    },
    {
        id: 2,
        name: "Xylos",
        color: "#6bff6b",
        concept: "Conditions",
        description: "A green jungle planet where smart decisions matter!",
        briefing: `
            <h3 style="color: #6bff6b;">🟢 XYLOS - Mission 3: Conditions (If/Else)</h3>
            <p><strong>Mission:</strong> Make the right decisions to conquer this planet!</p>
            <p><strong>Programming Concept - Conditions:</strong> Make decisions in your code based on different situations!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #6bff6b;">
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
        bgTop: "#0a1a0a",
        bgBottom: "#1a3a1a",
        color: "#44ff44",
        enemyType: "smart",
        bossName: "Decision Master"
    },
    {
        id: 3,
        name: "Nebula Prime",
        color: "#ff6bff",
        concept: "Variables",
        description: "A purple nebula world full of stored energy!",
        briefing: `
            <h3 style="color: #ff6bff;">🟣 NEBULA PRIME - Mission 4: Variables</h3>
            <p><strong>Mission:</strong> Capture the energy variables of this nebula!</p>
            <p><strong>Programming Concept - Variables:</strong> Store and remember values for later use!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #ff6bff;">
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
        bgTop: "#1a0a1a",
        bgBottom: "#3a1a3a",
        color: "#ff44ff",
        enemyType: "variable",
        bossName: "Variable Guardian"
    },
    {
        id: 4,
        name: "Void Station",
        color: "#6bffff",
        concept: "Functions",
        description: "An icy space station where reusable code is key!",
        briefing: `
            <h3 style="color: #6bffff;">🔵 VOID STATION - Mission 5: Functions</h3>
            <p><strong>Mission:</strong> Break through the station's defenses!</p>
            <p><strong>Programming Concept - Functions:</strong> Reusable blocks of code that perform specific tasks!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #6bffff;">
def shoot_enemy(target):
    aim(target)
    fire()
    return True

# Use the function multiple times
shoot_enemy(alien1)
shoot_enemy(alien2)
            </pre>
            <p>Functions let you write code once and use it many times!</p>
            <p><strong>Boss Challenge:</strong> Assemble the right function calls to disable the station!</p>
        `,
        bgTop: "#0a1a1a",
        bgBottom: "#1a3a3a",
        color: "#44ffff",
        enemyType: "function",
        bossName: "Function Core"
    },
    {
        id: 5,
        name: "Dark Matter",
        color: "#ffaa6b",
        concept: "Debugging",
        description: "A mysterious orange realm where things go wrong!",
        briefing: `
            <h3 style="color: #ffaa6b;">🟠 DARK MATTER - Mission 6: Debugging</h3>
            <p><strong>Mission:</strong> Find and fix the bugs in this corrupted zone!</p>
            <p><strong>Programming Concept - Debugging:</strong> Finding and fixing errors in code!</p>
            <p><strong>Common Bugs:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; border-left: 3px solid #ffaa6b;">
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
        bgTop: "#1a1a0a",
        bgBottom: "#3a3a1a",
        color: "#ff8844",
        enemyType: "bug",
        bossName: "Bug Queen"
    },
    {
        id: 6,
        name: "Alien Homeworld",
        color: "#ffffff",
        concept: "Mixed Challenge",
        description: "The final frontier! All your skills will be tested!",
        briefing: `
            <h3 style="color: #ffffff;">⚪ ALIEN HOMEWORLD - Mission 7: Final Challenge</h3>
            <p><strong>Mission:</strong> End the alien threat once and for all!</p>
            <p><strong>All Concepts Combined:</strong> You'll need everything you've learned!</p>
            <ul style="text-align: left; display: inline-block;">
                <li>✅ Sequencing - Correct order matters</li>
                <li>✅ Loops - Efficient repetition</li>
                <li>✅ Conditions - Smart decisions</li>
                <li>✅ Variables - Track important data</li>
                <li>✅ Functions - Reusable solutions</li>
                <li>✅ Debugging - Fix errors quickly</li>
            </ul>
            <p>This is it! The ultimate test of your programming knowledge!</p>
            <p><strong>Final Boss Challenge:</strong> A multi-stage puzzle combining all concepts!</p>
        `,
        bgTop: "#1a1a1a",
        bgBottom: "#2a2a2a",
        color: "#ffffff",
        enemyType: "elite",
        bossName: "Alien Emperor"
    }
];
