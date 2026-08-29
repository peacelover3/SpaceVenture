// Game Configuration
const CONFIG = {
    // Player settings
    playerSpeed: 0.15,
    bulletSpeed: 8,
    fireRate: 200, // ms between shots
    maxHealth: 100,
    
    // Enemy settings
    enemySpawnRate: 1500, // ms between enemy spawns
    enemyBaseSpeed: 2,
    enemyBaseHealth: 1,
    
    // Boss settings
    bossHealth: 5,
    bossDamage: 20,
    
    // Wave settings
    enemiesPerWave: 8,
    wavesBeforeBoss: 3,
    
    // Scoring
    scorePerEnemy: 100,
    scorePerBoss: 500,
    scorePerPuzzle: 1000,
    
    // Puzzle settings
    puzzleAttempts: 3,
    hintPenalty: 200,
    
    // Save key
    saveKey: 'codeDefenderSave'
};

// Planet/Level Data
const LEVELS = [
    {
        id: 0,
        name: "Earth",
        color: "#4a9eff",
        concept: "Sequencing",
        description: "Our home planet! The aliens are attacking Earth first. You must defend it at all costs!",
        briefing: `
            <h3>🌍 EARTH - Level 1: Sequencing</h3>
            <p><strong>Mission:</strong> Defend Earth from the initial alien invasion!</p>
            <p><strong>Programming Concept - Sequencing:</strong> Code executes line by line, in order. Just like following a recipe step-by-step!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
1. Wake up
2. Brush teeth
3. Eat breakfast
4. Go to school
            </pre>
            <p>If you change the order, things don't work right! In this level, you'll learn that doing things in the correct sequence is crucial.</p>
            <p><strong>Boss Challenge:</strong> Arrange the correct sequence of actions to defeat the mothership!</p>
        `,
        background: "#0a1628",
        enemyType: "basic",
        bossName: "Scout Mothership"
    },
    {
        id: 1,
        name: "Planet Zog",
        color: "#ff6b6b",
        concept: "Loops",
        description: "A red desert planet. The aliens use repeating patterns here!",
        briefing: `
            <h3>🔴 PLANET ZOG - Level 2: Loops</h3>
            <p><strong>Mission:</strong> Conquer your first alien planet!</p>
            <p><strong>Programming Concept - Loops:</strong> Repeat actions without writing the same code over and over!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
// Instead of:
print("Hello")
print("Hello")
print("Hello")

// Use a loop:
for i in range(3):
    print("Hello")
            </pre>
            <p>Loops save time and make code cleaner! The aliens here attack in repeating patterns - use loops to understand them!</p>
            <p><strong>Boss Challenge:</strong> Identify the correct loop pattern to counter the alien attacks!</p>
        `,
        background: "#280a0a",
        enemyType: "pattern",
        bossName: "Loop Commander"
    },
    {
        id: 2,
        name: "Planet Xylos",
        color: "#6bff6b",
        concept: "Conditions",
        description: "A green jungle planet where decisions matter!",
        briefing: `
            <h3>🟢 PLANET XYLOS - Level 3: Conditions (If/Else)</h3>
            <p><strong>Mission:</strong> Make the right decisions to conquer this planet!</p>
            <p><strong>Programming Concept - Conditions:</strong> Make decisions in your code based on different situations!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
if health < 30:
    retreat()
elif enemy_nearby:
    shoot()
else:
    explore()
            </pre>
            <p>Conditions let your program make smart decisions! On this planet, you'll face choices that determine victory or defeat.</p>
            <p><strong>Boss Challenge:</strong> Choose the correct if/else logic to defeat the boss!</p>
        `,
        background: "#0a280a",
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
            <h3>🟣 NEBULA PRIME - Level 4: Variables</h3>
            <p><strong>Mission:</strong> Capture the energy variables of this nebula!</p>
            <p><strong>Programming Concept - Variables:</strong> Store and remember values for later use!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
player_health = 100
enemy_count = 5
score = 0

# Update variables
score = score + 100
enemy_count = enemy_count - 1
            </pre>
            <p>Variables are like labeled boxes that hold information. They can change over time!</p>
            <p><strong>Boss Challenge:</strong> Track and manipulate variables to power up your weapon!</p>
        `,
        background: "#280a28",
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
            <h3>🔵 VOID STATION - Level 5: Functions</h3>
            <p><strong>Mission:</strong> Break through the station's defenses!</p>
            <p><strong>Programming Concept - Functions:</strong> Reusable blocks of code that perform specific tasks!</p>
            <p><strong>Example:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
def shoot_enemy(target):
    aim(target)
    fire()
    return True

# Use the function multiple times
shoot_enemy(alien1)
shoot_enemy(alien2)
            </pre>
            <p>Functions let you write code once and use it many times! They make programs organized and efficient.</p>
            <p><strong>Boss Challenge:</strong> Assemble the right function calls to disable the station!</p>
        `,
        background: "#0a2828",
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
            <h3>🟠 DARK MATTER - Level 6: Debugging</h3>
            <p><strong>Mission:</strong> Find and fix the bugs in this corrupted zone!</p>
            <p><strong>Programming Concept - Debugging:</strong> Finding and fixing errors in code!</p>
            <p><strong>Common Bugs:</strong></p>
            <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
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
        background: "#281a0a",
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
            <h3>⚪ ALIEN HOMEWORLD - Level 7: Final Challenge</h3>
            <p><strong>Mission:</strong> End the alien threat once and for all!</p>
            <p><strong>All Concepts Combined:</strong> You'll need everything you've learned!</p>
            <ul>
                <li>✅ Sequencing - Correct order matters</li>
                <li>✅ Loops - Efficient repetition</li>
                <li>✅ Conditions - Smart decisions</li>
                <li>✅ Variables - Track important data</li>
                <li>✅ Functions - Reusable solutions</li>
                <li>✅ Debugging - Fix errors quickly</li>
            </ul>
            <p>This is it! The ultimate test of your programming knowledge. Defeat the Alien Emperor and save the universe!</p>
            <p><strong>Final Boss Challenge:</strong> A multi-stage puzzle combining all concepts!</p>
        `,
        background: "#282828",
        enemyType: "elite",
        bossName: "Alien Emperor"
    }
];
