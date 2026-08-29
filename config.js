// ============================================
// PERSONALIZATION CONFIG - EDIT THIS FILE
// Change these values for each recipient
// ============================================

const CONFIG = {
    // Recipient Details
    recipient: {
        name: "Alex",           // Person's name
        rank: "Cadet",          // Their rank in the squad
        squadName: "Phoenix",   // Squad name
        specialAbility: "Quick Thinking"  // Their special trait
    },
    
    // Story Elements
    story: {
        enemyName: "Zorgons",        // Alien enemy name
        headquarters: "Alpha Base",  // HQ name
        briefingOfficer: "Commander Reyes",  // Who gives briefing
        homePlanet: "Earth"          // Home planet (failure = enslaved here)
    },
    
    // Optional: Add image filenames if you have them
    // Leave empty strings to use gradient backgrounds
    images: {
        start: "",        // e.g., "assets/start.jpg"
        briefing: "",     // e.g., "assets/briefing.jpg"
        aircraft: "",     // e.g., "assets/aircraft.jpg"
        space: "",        // e.g., "assets/space.jpg"
        victory: "",      // e.g., "assets/victory.jpg"
        defeat: ""        // e.g., "assets/defeat.jpg"
    }
};

// ============================================
// AIRCRAFT OPTIONS (6 choices)
// ============================================

const AIRCRAFT = [
    {
        name: "Interceptor",
        icon: "⚡",
        speed: "Very High",
        defense: "Low",
        firepower: "Medium",
        description: "Fast but fragile. Hit hard, hit fast."
    },
    {
        name: "Titan",
        icon: "🛡️",
        speed: "Low",
        defense: "Very High",
        firepower: "High",
        description: "Heavy armor. Built to survive."
    },
    {
        name: "Phantom",
        icon: "👻",
        speed: "High",
        defense: "Medium",
        firepower: "Medium",
        description: "Balanced stealth fighter."
    },
    {
        name: "Vanguard",
        icon: "🔥",
        speed: "Medium",
        defense: "High",
        firepower: "Very High",
        description: "Offensive powerhouse."
    },
    {
        name: "Scout",
        icon: "🦅",
        speed: "Very High",
        defense: "Very Low",
        firepower: "Low",
        description: "Recon specialist. Extreme speed."
    },
    {
        name: "Guardian",
        icon: "✨",
        speed: "Medium",
        defense: "Very High",
        firepower: "Medium",
        description: "All-around protector."
    }
];

// ============================================
// SURVIVAL SCENARIOS (Harder - General Knowledge)
// Options are shuffled automatically in game.js
// Answer refers to the ORIGINAL correct option index before shuffle
// ============================================

const SURVIVAL_SCENARIOS = [
    {
        question: `You're alone on a beach surrounded by 7 unarmed attackers. You have one gun with 3 bullets. What's your smartest move?`,
        options: [
            "Shoot the three closest attackers to create fear",
            "Fire warning shots in the air to intimidate them",
            "Keep the gun hidden and try to negotiate or escape",
            "Shoot randomly into the crowd and run"
        ],
        answer: 2,
        explanation: "Using the gun escalates violence. Keeping it hidden while negotiating or finding escape gives better survival odds."
    },
    {
        question: `You're lost in a desert with limited water. Your best strategy is:`,
        options: [
            "Walk during the day to find help faster",
            "Stay in shade during day, travel at night",
            "Drink all water immediately to hydrate fully",
            "Run as fast as possible to conserve time"
        ],
        answer: 1,
        explanation: "Traveling at night prevents heat exhaustion. Daytime movement causes dangerous dehydration."
    },
    {
        question: `An earthquake hits while you're indoors on the 5th floor. You should:`,
        options: [
            "Immediately run for the stairs",
            "Stand in a doorway",
            "Drop, cover under sturdy furniture, hold on",
            "Jump out the window"
        ],
        answer: 2,
        explanation: "'Drop, Cover, Hold On' is the proven safety method. Doorways aren't safer, and running during shaking is dangerous."
    },
    {
        question: `You encounter a bear in the woods. It hasn't noticed you yet. You should:`,
        options: [
            "Slowly back away without turning your back",
            "Run away as fast as possible",
            "Climb the nearest tree",
            "Make loud noises to scare it"
        ],
        answer: 0,
        explanation: "Running triggers chase instinct. Most bears can outrun humans. Slow retreat without sudden movements is safest."
    },
    {
        question: `Your house is on fire and you're trapped upstairs. The staircase is blocked by flames. What do you do?`,
        options: [
            "Jump from the window immediately",
            "Seal door cracks with cloth, signal from window, wait for rescue",
            "Try to run through the flames",
            "Hide in the closet"
        ],
        answer: 1,
        explanation: "Sealing cracks prevents smoke entry. Signaling helps rescuers find you. Jumping risks serious injury."
    },
    {
        question: `You're caught in a rip current while swimming. The correct action is:`,
        options: [
            "Swim directly back to shore against the current",
            "Float and signal for help, swim parallel to shore",
            "Dive underwater to escape the current",
            "Panic and wave arms frantically"
        ],
        answer: 1,
        explanation: "Rip currents pull you away from shore, not under. Swimming parallel escapes the current, then angle back to shore."
    }
];

// ============================================
// DECISION SCENARIOS (Harder - Moral/Ethical Choices)
// Options are shuffled automatically in game.js
// Answer refers to the ORIGINAL correct option index before shuffle
// ============================================

const DECISION_SCENARIOS = [
    {
        question: `A stranger offers you $10,000 to share confidential information about your team's security protocols. You're struggling financially. Do you:`,
        options: [
            "Accept - it's just information, no one gets hurt",
            "Decline and report the attempt to security",
            "Decline but don't report it - avoid drama",
            "Negotiate for more money first"
        ],
        answer: 1,
        explanation: "Security breaches endanger everyone. Reporting protects your team and may prevent future attempts."
    },
    {
        question: `You discover a close friend has been stealing from the team supplies. They beg you not to tell anyone. You:`,
        options: [
            "Stay silent - loyalty to friends comes first",
            "Confront them privately and demand they return everything",
            "Report them immediately to leadership",
            " anonymously leave a hint so they know you know"
        ],
        answer: 1,
        explanation: "Direct confrontation gives them a chance to fix it while showing you care. If they refuse, then reporting becomes necessary."
    },
    {
        question: `During a critical mission, you realize your leader made a mistake that could cost lives. Speaking up might undermine their authority. You:`,
        options: [
            "Stay quiet - chain of command matters most",
            "Privately point out the issue respectfully",
            "Publicly correct them in front of everyone",
            "Wait until after the mission to mention it"
        ],
        answer: 1,
        explanation: "Lives are at stake. A private, respectful approach preserves authority while addressing the critical issue."
    },
    {
        question: `Someone you barely know confesses they're planning something dangerous. They trust you to keep it secret. You:`,
        options: [
            "Keep their secret - they trusted you",
            "Try to talk them out of it, then report if they persist",
            "Immediately report them without discussion",
            "Tell mutual friends to handle it"
        ],
        answer: 1,
        explanation: "Attempting intervention shows respect, but safety comes first. If they won't listen, authorities need to know."
    },
    {
        question: `You witness someone being unfairly blamed for a mistake you actually made. No one else knows the truth. You:`,
        options: [
            "Stay silent - getting caught would ruin your reputation",
            "Confess immediately and accept consequences",
            "Leave subtle hints that point to the truth",
            "Apologize privately to the blamed person only"
        ],
        answer: 1,
        explanation: "Integrity means owning mistakes even when costly. Letting others take blame compounds the wrong."
    },
    {
        question: `Your team must choose between saving equipment worth millions or rescuing an injured teammate. Time allows only one. You vote for:`,
        options: [
            "Save the equipment - it benefits everyone long-term",
            "Rescue the teammate - human life is irreplaceable",
            "Abstain - it's too difficult a choice",
            "Let the leader decide without your input"
        ],
        answer: 1,
        explanation: "Human life cannot be replaced or valued in monetary terms. Equipment can be rebuilt; people cannot."
    }
];

// ============================================
// CODING CHALLENGES (Easier - Beginner Friendly)
// Simple concepts, clear answers
// Options are shuffled automatically in game.js
// Answer refers to the ORIGINAL correct option index before shuffle
// ============================================

const CODING_CHALLENGES = [
    {
        question: `What does this code do?\n\nconsole.log("Hello World")`,
        hint: "Think about what appears on screen",
        options: [
            "Creates a new variable",
            "Displays text on the screen",
            "Deletes a file",
            "Connects to internet"
        ],
        answer: 1
    },
    {
        question: `Which symbol is used to make a comment in JavaScript?`,
        hint: "It looks like two forward slashes",
        options: [
            "# comment",
            "// comment",
            "<!-- comment -->",
            "/* comment */"
        ],
        answer: 1
    },
    {
        question: `What value will x have after this code runs?\n\nlet x = 5;\nx = x + 3;`,
        hint: "Start with 5, then add 3",
        options: [
            "5",
            "3",
            "8",
            "x3"
        ],
        answer: 2
    },
    {
        question: `Which of these creates a list (array) in JavaScript?`,
        hint: "Square brackets are the clue",
        options: [
            "let items = (1, 2, 3)",
            "let items = {1, 2, 3}",
            "let items = [1, 2, 3]",
            "let items = <1, 2, 3>"
        ],
        answer: 2
    },
    {
        question: `What does this return?\n\n"5" + 2`,
        hint: "One is text, one is a number",
        options: [
            "7",
            "52",
            "Error",
            "5+2"
        ],
        answer: 1
    },
    {
        question: `Which keyword creates a function in JavaScript?`,
        hint: "It literally says what it does",
        options: [
            "create",
            "def",
            "function",
            "make"
        ],
        answer: 2
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, AIRCRAFT, SURVIVAL_SCENARIOS, DECISION_SCENARIOS, CODING_CHALLENGES };
}
