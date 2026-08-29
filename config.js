/* ============================================
   GAME CONFIGURATION FILE
   Edit this file to customize the game for different recipients
   ============================================ */

const GAME_CONFIG = {
    // ============================================
    // RECIPIENT INFORMATION (Change for each person)
    // ============================================
    recipient: {
        name: "Aqsa Parveen",           // Name of the person receiving this game
        squadName: "TacTeam",  // Name of their squad/team
        rank: "General",                   // Their rank in the squad
        specialAbility: "bat krna" // Their special ability/trait
    },

    // ============================================
    // STORYLINE CUSTOMIZATION
    // ============================================
    storyline: {
        threatName: "Xenon Aliens",      // Name of the alien threat
        headquartersName: "Alpha Station", // Name of the headquarters
        briefingOfficer: "Commander Reyes" // Name of the briefing officer
    },

    // ============================================
    // AIRCRAFT OPTIONS (6 choices)
    // ============================================
    aircrafts: [
        {
            id: 1,
            name: "Phoenix Fighter",
            description: "High speed, moderate armor. Excellent for quick strikes.",
            speed: 95,
            armor: 60,
            firepower: 75
        },
        {
            id: 2,
            name: "Titan Bomber",
            description: "Heavy armor and firepower but slower movement.",
            speed: 45,
            armor: 95,
            firepower: 90
        },
        {
            id: 3,
            name: "Viper Scout",
            description: "Ultra-fast reconnaissance craft with stealth capabilities.",
            speed: 100,
            armor: 40,
            firepower: 55
        },
        {
            id: 4,
            name: "Guardian Cruiser",
            description: "Balanced all-rounder with shield regeneration.",
            speed: 65,
            armor: 75,
            firepower: 70
        },
        {
            id: 5,
            name: "Storm Interceptor",
            description: "Agile fighter with rapid-fire weapons.",
            speed: 85,
            armor: 55,
            firepower: 80
        },
        {
            id: 6,
            name: "Aegis Defender",
            description: "Mobile fortress with advanced defense systems.",
            speed: 50,
            armor: 100,
            firepower: 65
        }
    ],

    // ============================================
    // SCENARIO QUESTIONS
    // Three types: survival, decision, programming
    // ============================================
    scenarios: {
        // Survival scenarios (general knowledge)
        survival: [
            {
                question: "You're alone on a beach and suddenly surrounded by 7 hostile people. None of them have guns, but you do. What's your best chance of survival?",
                options: [
                    "Stand your ground and warn them to stay back",
                    "Create distance and move toward populated areas while keeping your weapon ready",
                    "Try to negotiate immediately without moving",
                    "Run in the opposite direction as fast as possible"
                ],
                correct: 1, // Index of correct answer (0-based)
                explanation: "Creating distance and moving toward help while maintaining awareness is the safest strategy."
            },
            {
                question: "You're lost in a dense forest with limited supplies. It's getting dark and cold. What should you do first?",
                options: [
                    "Keep walking to find civilization before nightfall",
                    "Build a shelter and make a fire to stay warm",
                    "Climb a tree to get a better view",
                    "Start calling for help loudly"
                ],
                correct: 1,
                explanation: "Shelter and warmth are priorities. Moving at night increases risk of injury."
            },
            {
                question: "In space, your oxygen supply is damaged and you have 30 minutes of air left. Your ship is 20 minutes away. What do you do?",
                options: [
                    "Move as fast as possible to reach the ship in 10 minutes",
                    "Move steadily to conserve oxygen and reach in 20 minutes",
                    "Stay still and wait for rescue",
                    "Try to repair the oxygen system first"
                ],
                correct: 1,
                explanation: "Rapid movement consumes more oxygen. Steady pace ensures you arrive with a safety margin."
            }
        ],

        // Decision scenarios (personal choices)
        decision: [
            {
                question: "Someone you care about proposes a business partnership. They offer 40% ownership, but you'd need to quit your stable job. The venture has 50% chance of success. Do you accept?",
                options: [
                    "Accept immediately - opportunities like this don't come often",
                    "Decline - stability is more important than risky ventures",
                    "Negotiate for 50% ownership or a trial period",
                    "Ask for time to think and analyze the situation thoroughly"
                ],
                correct: 3,
                explanation: "Major decisions deserve careful analysis. Taking time shows maturity."
            },
            {
                question: "Your team member takes credit for your work in front of leadership. How do you respond?",
                options: [
                    "Confront them angrily in the moment",
                    "Say nothing and let it go",
                    "Calmly clarify your contribution in the meeting",
                    "Address it privately with them later and then inform leadership if needed"
                ],
                correct: 3,
                explanation: "Professional handling preserves relationships while ensuring proper recognition."
            },
            {
                question: "You discover a critical bug in production that affects few users but could be serious. Fixing it requires immediate downtime affecting all users. What do you do?",
                options: [
                    "Fix it immediately regardless of downtime",
                    "Wait until off-peak hours to minimize impact",
                    "Assess the actual risk, prepare a fix, and communicate transparently with stakeholders",
                    "Ignore it since only few users are affected"
                ],
                correct: 2,
                explanation: "Balanced approach considering risk assessment, preparation, and communication."
            }
        ],

        // Programming challenges (6 levels)
        programming: [
            {
                level: 1,
                title: "Variables & Data Types",
                instruction: "Declare a variable called 'shipName' and assign it the value of your spacecraft name. Then declare 'fuelLevel' as 100.",
                starterCode: "// Write your code below\n",
                expectedOutput: "shipName and fuelLevel declared",
                validate: (code) => {
                    try {
                        const hasShipName = /let\s+shipName\s*=|const\s+shipName\s*=|var\s+shipName\s*=/.test(code);
                        const hasFuelLevel = /let\s+fuelLevel\s*=|const\s+fuelLevel\s*=|var\s+fuelLevel\s*=/.test(code);
                        return hasShipName && hasFuelLevel;
                    } catch {
                        return false;
                    }
                },
                hint: "Use 'let' or 'const' to declare variables."
            },
            {
                level: 2,
                title: "Functions",
                instruction: "Create a function called 'fireWeapon' that takes one parameter 'target' and returns the string 'Firing at ' + target.",
                starterCode: "// Create your function below\n",
                expectedOutput: "fireWeapon('enemy') should return 'Firing at enemy'",
                validate: (code) => {
                    try {
                        eval(code);
                        return typeof fireWeapon === 'function' && fireWeapon('enemy') === 'Firing at enemy';
                    } catch {
                        return false;
                    }
                },
                hint: "Use: function fireWeapon(target) { return ... }"
            },
            {
                level: 3,
                title: "Conditionals",
                instruction: "Write an if statement that checks if 'energyLevel' is greater than 50. If true, set 'canAttack' to true, otherwise set it to false.",
                starterCode: "let energyLevel = 75;\nlet canAttack;\n// Write your if statement below\n",
                expectedOutput: "canAttack should be true when energyLevel > 50",
                validate: (code) => {
                    try {
                        let energyLevel = 75;
                        let canAttack;
                        eval(code);
                        return canAttack === true;
                    } catch {
                        return false;
                    }
                },
                hint: "Use: if (energyLevel > 50) { canAttack = true; } else { canAttack = false; }"
            },
            {
                level: 4,
                title: "Loops",
                instruction: "Use a for loop to create an array called 'missiles' containing 5 missile objects with properties: id (1-5) and status: 'ready'.",
                starterCode: "let missiles = [];\n// Write your loop below\n",
                expectedOutput: "missiles array with 5 objects",
                validate: (code) => {
                    try {
                        let missiles = [];
                        eval(code);
                        return missiles.length === 5 && missiles[0].id === 1 && missiles[4].id === 5 && missiles[0].status === 'ready';
                    } catch {
                        return false;
                    }
                },
                hint: "Use: for (let i = 1; i <= 5; i++) { missiles.push({id: i, status: 'ready'}); }"
            },
            {
                level: 5,
                title: "Array Methods",
                instruction: "Given an array of enemy distances, use filter to create a new array 'closeEnemies' containing only enemies within 100 units.",
                starterCode: "const enemyDistances = [50, 150, 80, 200, 30, 120];\n// Use filter to create closeEnemies array\n",
                expectedOutput: "closeEnemies should contain [50, 80, 30]",
                validate: (code) => {
                    try {
                        const enemyDistances = [50, 150, 80, 200, 30, 120];
                        eval(code);
                        return JSON.stringify(closeEnemies.sort((a,b) => a-b)) === JSON.stringify([30, 50, 80]);
                    } catch {
                        return false;
                    }
                },
                hint: "Use: const closeEnemies = enemyDistances.filter(distance => distance < 100);"
            },
            {
                level: 6,
                title: "Final Challenge - Object Methods",
                instruction: "Create a spaceship object with properties: name, fuel, and a method 'travel' that reduces fuel by 10 and returns 'Traveling to destination'.",
                starterCode: "// Create your spaceship object below\n",
                expectedOutput: "spaceship.travel() should reduce fuel and return travel message",
                validate: (code) => {
                    try {
                        eval(code);
                        const initialFuel = spaceship.fuel;
                        const result = spaceship.travel();
                        return spaceship.fuel === initialFuel - 10 && result === 'Traveling to destination';
                    } catch {
                        return false;
                    }
                },
                hint: "Create an object with a method: const spaceship = { name: '...', fuel: 100, travel() { ... } };"
            }
        ]
    },

    // ============================================
    // BACKGROUND IMAGES (Optional - add your image paths)
    // Leave empty for solid color backgrounds
    // ============================================
    backgrounds: {
        intro: "",           // Path to intro screen background
        headquarters: "",    // Path to HQ/briefing room image
        aircraftSelection: "", // Path to hangar/aircraft selection background
        space: "",           // Path to space battle background
        victory: ""          // Path to victory screen background
    }
};
