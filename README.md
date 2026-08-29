# 🚀 Space Mission - Personal Educational Game

A space-themed educational game built as a personal gift. Fully customizable for any recipient!

## 🎮 How to Play

1. **Open the game**: Simply open `index.html` in any web browser (works on mobile too!)
2. **Start your mission**: Follow the storyline from briefing to space battle
3. **Complete challenges**: Answer survival scenarios, make tough decisions, and solve coding puzzles
4. **Win or lose**: Get 60%+ to save Earth, otherwise... well, you'll see 😅

## ✏️ How to Customize (IMPORTANT!)

**Edit `config.js`** to personalize the game for each recipient:

```javascript
const CONFIG = {
    recipient: {
        name: "Alex",           // Change to recipient's name
        rank: "Cadet",          // Their rank/title
        squadName: "Phoenix",   // Squad name
        specialAbility: "Quick Thinking"
    },
    story: {
        enemyName: "Zorgons",       // Alien enemy name
        headquarters: "Alpha Base", // HQ name
        briefingOfficer: "Commander Reyes",
        homePlanet: "Earth"         // Failure = enslaved here
    }
};
```

That's it! Change these values and the entire game updates automatically.

## 📁 Adding Your Images

Place your background images in the `assets/` folder:

- `bg1.jpg` - Start screen background
- `bg2.jpg` - Briefing room
- `bg3.jpg` - Aircraft selection
- `bg4.jpg` - Space battle
- `bg5.jpg` - Victory screen
- `bg6.jpg` - Defeat screen

**No images?** No problem! The game uses beautiful gradient backgrounds by default.

To use your images, edit `config.js`:
```javascript
images: {
    start: "assets/bg1.jpg",
    briefing: "assets/bg2.jpg",
    // etc...
}
```

## 🎯 Game Features

✅ **Mobile-friendly** - Works perfectly on phones and tablets  
✅ **No music** - Silent gameplay as requested  
✅ **Dynamic personalization** - One config file changes everything  
✅ **6 spacecraft choices** - Each with unique stats  
✅ **3 challenge types**:
   - Survival scenarios (harder general knowledge)
   - Decision scenarios (ethical/moral choices)
   - Coding challenges (beginner-friendly)
✅ **Background slideshow** - Images transition every 5 seconds  
✅ **Lose condition** - Getting captured and enslaved by aliens  

## 📱 Mobile Support

The game is fully responsive:
- Touch-friendly buttons
- Optimized layouts for small screens
- Works in portrait and landscape
- No zoom issues

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript (no frameworks needed)
- Works offline
- No dependencies
- Just open and play!

## 🎁 Perfect For

- Personal gifts
- Educational purposes
- Team building activities
- Learning basic programming concepts

---

**Made with ❤️ as a personal gift**
