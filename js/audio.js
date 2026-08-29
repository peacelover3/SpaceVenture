// Audio System with Base64 Sound Effects
const AudioSystem = {
    sounds: {},
    enabled: true,
    context: null,

    // Generate simple synthesized sounds (no external files needed)
    init() {
        if (this.context) return;
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
            
            // Browsers block audio until a user gesture. Resume on first interaction.
            const unlock = () => {
                this.unlock();
                document.removeEventListener('pointerdown', unlock);
                document.removeEventListener('keydown', unlock);
            };
            document.addEventListener('pointerdown', unlock);
            document.addEventListener('keydown', unlock);
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    },

    // Resume the audio context if the browser suspended it (autoplay policy)
    unlock() {
        if (!this.context) return;
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    // Create laser sound
    playLaser() {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, this.context.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    },

    // Create explosion sound
    playExplosion() {
        if (!this.enabled || !this.context) return;
        
        const bufferSize = this.context.sampleRate * 0.5;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.context.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        noise.start(this.context.currentTime);
    },

    // Create power-up sound
    playPowerUp() {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.context.currentTime);
        oscillator.frequency.linearRampToValueAtTime(880, this.context.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.2);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.2);
    },

    // Create hit sound
    playHit() {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.4, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.15);
    },

    // Create boss warning sound
    playBossWarning() {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, this.context.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, this.context.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
        
        // Repeat twice more
        setTimeout(() => {
            if (this.enabled) {
                const osc2 = this.context.createOscillator();
                const gain2 = this.context.createGain();
                osc2.connect(gain2);
                gain2.connect(this.context.destination);
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(300, this.context.currentTime);
                osc2.frequency.linearRampToValueAtTime(200, this.context.currentTime + 0.3);
                gain2.gain.setValueAtTime(0.3, this.context.currentTime);
                gain2.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);
                osc2.start(this.context.currentTime);
                osc2.stop(this.context.currentTime + 0.3);
            }
        }, 400);
    },

    // Create victory sound
    playVictory() {
        if (!this.enabled || !this.context) return;
        
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);
                
                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.3);
            }, i * 150);
        });
    },

    // Create defeat sound
    playDefeat() {
        if (!this.enabled || !this.context) return;
        
        const notes = [392, 370, 349, 311];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                oscillator.type = 'triangle';
                oscillator.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.4);
                
                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.4);
            }, i * 200);
        });
    },

    // Create puzzle correct sound
    playPuzzleCorrect() {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, this.context.currentTime);
        oscillator.frequency.setValueAtTime(1174, this.context.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
    },

    // Create puzzle wrong sound
    playPuzzleWrong() {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, this.context.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.2);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.2);
    }
};
