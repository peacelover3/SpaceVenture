# 🚀 Space Mission - Educational Game

A personalized, space-themed educational web game that can be customized for different recipients. Perfect as a personal gift!

## 🎮 Features

- **No Music** - Completely silent gameplay
- **Fully Customizable** - Easy configuration for different recipients
- **Educational Content** - Three types of challenges:
  - 🏃 Survival scenarios (general knowledge)
  - 🤔 Decision-making scenarios
  - 💻 Programming challenges (6 levels)
- **Personalized Experience** - Names, squad details, and storylines adapt to the recipient
- **Beautiful UI** - Space-themed design with smooth animations
- **Responsive** - Works on desktop and mobile devices

## 📁 File Structure

```
/workspace
├── index.html          # Main HTML file
├── styles.css          # All styling
├── config.js           # ⭐ CONFIGURATION FILE - Edit this!
├── game.js             # Game logic
└── README.md           # This file
```

## 🔧 How to Customize

### Step 1: Edit the Configuration File

Open `config.js` and modify the following sections:

#### 1. Recipient Information (REQUIRED)
```javascript
recipient: {
    name: "Alex Johnson",           // Change to recipient's name
    squadName: "Stellar Guardians",  // Change squad name
    rank: "Cadet",                   // Their rank
    specialAbility: "Quick Thinking" // Their special trait
},
```

#### 2. Storyline Details (OPTIONAL)
```javascript
storyline: {
    threatName: "Xenon Aliens",      // Enemy name
    headquartersName: "Alpha Station", // HQ name
    briefingOfficer: "Commander Reyes" // Briefing officer name
},
```

#### 3. Aircraft Options (OPTIONAL - 6 pre-configured)
You can modify the 6 aircraft names, descriptions, and stats in the `aircrafts` array.

#### 4. Scenarios (OPTIONAL)
- **Survival**: 3 general knowledge questions
- **Decision**: 3 personal choice scenarios  
- **Programming**: 6 JavaScript coding challenges (levels 1-6)

#### 5. Background Images (OPTIONAL)
Add your own images by providing file paths:
```javascript
backgrounds: {
    intro: "images/intro.jpg",
    headquarters: "images/hq.jpg",
    aircraftSelection: "images/hangar.jpg",
    space: "images/space.jpg",
    victory: "images/victory.jpg"
}
```

If left empty, beautiful space-themed gradients are used automatically.

## 🚀 How to Run

### Option 1: Direct Browser (Simplest)
1. Navigate to the `/workspace` folder
2. Double-click `index.html`
3. The game opens in your default browser

### Option 2: Local Server (Recommended)
```bash
cd /workspace
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Deploy Online
Upload all files to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 🎯 Gameplay Flow

1. **Intro Screen** - Personalized welcome message
2. **Headquarters Briefing** - Story setup with mission details
3. **Aircraft Selection** - Choose from 6 spacecraft
4. **Space Battle** - Complete challenges:
   - Survival scenarios
   - Decision scenarios
   - Programming challenges (6 levels)
5. **Victory Screen** - Final score and personalized congratulations

## 💡 Tips for Best Experience

1. **Personalize Everything**: The more you customize names and details, the more meaningful the gift
2. **Add Your Images**: If you have specific images (briefing room, etc.), add them to the backgrounds section
3. **Adjust Difficulty**: Modify programming challenges based on recipient's skill level
4. **Test First**: Play through once to ensure all customizations work correctly

## 🎨 Visual Style

- **Theme**: Dark space environment with blue/purple accents
- **UI Elements**: Semi-transparent panels, glowing effects
- **Animations**: Smooth transitions and hover effects
- **Typography**: Clean, modern fonts with code editor styling

## 📝 Adding More Content

### Add More Survival/Decision Scenarios
In `config.js`, simply add more objects to the arrays:

```javascript
survival: [
    // existing scenarios...
    {
        question: "Your new question here?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0, // Index of correct answer (0-3)
        explanation: "Why this is correct"
    }
]
```

### Add More Programming Levels
Add to the `programming` array with validation function:

```javascript
{
    level: 7,
    title: "Your Challenge Title",
    instruction: "What the player needs to do",
    starterCode: "// Starting code",
    expectedOutput: "What should happen",
    validate: (code) => {
        // Return true if code is correct
        try {
            eval(code);
            return someCondition;
        } catch {
            return false;
        }
    },
    hint: "Helpful hint"
}
```

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or dependencies
- **Single Page Application** - Smooth transitions between scenes
- **Client-side Only** - No server required
- **Browser Compatible** - Works on all modern browsers
- **Mobile Responsive** - Adapts to different screen sizes

## 🎁 Perfect For

- Birthday gifts
- Farewell presents
- Team building activities
- Educational purposes
- Coding practice
- Personalized surprises

---

**Enjoy creating your personalized space adventure! 🚀⭐**
