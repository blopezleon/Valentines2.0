// =======================================
// CUSTOMIZATION - EDIT THESE!
// =======================================

const DATE_REVEAL = {
    date: "February 14, 2026 13:00:00",  // YYYY-MM-DD HH:MM:SS format for countdown
    display_date: "Saturday, Feb 14th",
    time: "1:00 PM"
};

const LOVE_LETTER = `Min,

From the moment we met, I knew there was something special about you very special. Every day with you feels like winning the jackpot - not because of luck, but because I get to share my life with someone as caring and beautiful as you.

This Valentine's Day, I wanted to do something that shows how much thought and effort I'm willing to put into making you smile. Even if it took a little bit of hiding this from you. You deserve someone who goes all-in, and that's exactly what I'm doing, going all-in on US.

I can't wait for our date and for all the adventures still to come. You're my player 2, my perfect combo, my jackpot.

Thanks for the patience, 
Love always,
Your Favorite Person`;

const REASONS_I_LOVE_YOU = [
    "Your smile lights up my entire day",
    "The way you laugh at my terrible jokes",
    "How you always know when I need a hug",
    "Your sense of adventure",
    "The way you scrunch your nose when you're concentrating",
    "How passionate you are about the things you love",
    "The way you clean your nose on facetime",
    "How you always steal my fries but say you're not hungry",
    "Your kindness to the people you love",
    "The little things you remember",
    "How you make me want to be a better person",
    "Your beautiful eyes that I could get lost in",
    "The way you support my dreams",
    "How you can make me laugh",
    "Your spontaneous spirit",
    "The way you make me feel like I'm home",
    "How you're responsible when you study",
    "Your incredible strength and courage",
    "Everything about you, from head to toe"
];

// Slot machine config
const reelOptions = [
    ['🌮 Tacos', '🍣 Sushi', '🍝 Italian', '🏠 Home-cooked'],
    ['🎬 Movie Night', '🎮 Arcade', '🎤 Karaoke', '💃 Dancing'],
    ['🍦 Ice Cream', '🍰 Cheesecake', '🍫 Choco Fondue', '💋 Kisses']
];

const loserMessages = [
    "Hmm... not quite perfect yet. Try again! 🎰",
    "So close! One more spin should do it... 😉"
];

const perfectCombo = [2, 2, 3]; // Italian, Karaoke, Kisses

// =======================================
// SOUND ENGINE
// =======================================

class SoundEngine {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.musicEnabled = true;
        this.musicOscillators = [];
        this.musicGainNode = null;
        this.musicPlaying = false;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    createOscillator(frequency, type = 'square') {
        if (!this.enabled || !this.audioContext) return null;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        return { oscillator, gainNode };
    }

    playCoinSound() {
        if (!this.enabled) return;
        const { oscillator, gainNode } = this.createOscillator(988);
        gainNode.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => {
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }, 50);
    }

    playSpinSound() {
        if (!this.enabled) return;
        const { oscillator, gainNode } = this.createOscillator(100, 'sawtooth');
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        setTimeout(() => {
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }, 300);
    }

    playClickSound() {
        if (!this.enabled) return;
        const { oscillator, gainNode } = this.createOscillator(800);
        gainNode.gain.value = 0.2;
        oscillator.start();
        setTimeout(() => {
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        }, 30);
    }

    playLoserSound() {
        if (!this.enabled) return;
        [400, 300].forEach((freq, i) => {
            setTimeout(() => {
                const { oscillator, gainNode } = this.createOscillator(freq);
                gainNode.gain.value = 0.2;
                oscillator.start();
                setTimeout(() => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                }, 100);
            }, i * 120);
        });
    }

    playJackpotSound() {
        if (!this.enabled) return;
        const melody = [523, 659, 784, 1047];
        melody.forEach((freq, i) => {
            setTimeout(() => {
                const { oscillator, gainNode } = this.createOscillator(freq);
                gainNode.gain.value = 0.25;
                oscillator.start();
                setTimeout(() => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                }, 200);
            }, i * 150);
        });
    }

    playCelebrationSound() {
        if (!this.enabled) return;
        const melody = [1047, 1175, 1319, 1568, 1319, 1175, 1047];
        melody.forEach((freq, i) => {
            setTimeout(() => {
                const { oscillator, gainNode } = this.createOscillator(freq);
                gainNode.gain.value = 0.2;
                oscillator.start();
                setTimeout(() => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                    oscillator.stop(this.audioContext.currentTime + 0.15);
                }, 100);
            }, i * 100);
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Background romantic music - Soulful melody in 12/8 time
    playBackgroundMusic() {
        if (!this.audioContext || this.musicPlaying) return;
        this.musicPlaying = true;

        // Create master gain for music
        this.musicGainNode = this.audioContext.createGain();
        this.musicGainNode.gain.value = 0;
        this.musicGainNode.connect(this.audioContext.destination);

        // Romantic soulful melody inspired by G-Am-Em-D progression (12/8 time with triplets)
        // Each beat has 3 sub-beats (triplet feel)
        const triplet = 0.2; // Duration for each triplet note
        const beat = triplet * 3; // One full beat = 3 triplets

        // G chord (G-B-D) - measure 1
        const melody = [
            { note: 784, duration: triplet * 2 },  // G5 (long)
            { note: 880, duration: triplet },      // A5
            { note: 988, duration: triplet * 2 },  // B5
            { note: 880, duration: triplet },      // A5
            { note: 784, duration: beat },         // G5
            { note: 659, duration: triplet },      // E5

            // Am chord (A-C-E) - measure 2
            { note: 659, duration: triplet * 2 },  // E5
            { note: 784, duration: triplet },      // G5
            { note: 880, duration: beat },         // A5
            { note: 784, duration: triplet },      // G5
            { note: 659, duration: triplet * 2 },  // E5
            { note: 587, duration: triplet },      // D5

            // Em chord (E-G-B) - measure 3
            { note: 659, duration: triplet * 2 },  // E5
            { note: 784, duration: triplet },      // G5
            { note: 880, duration: triplet },      // A5
            { note: 784, duration: triplet },      // G5
            { note: 659, duration: beat },         // E5
            { note: 587, duration: triplet },      // D5

            // D chord (D-F#-A) - measure 4
            { note: 587, duration: triplet * 2 },  // D5
            { note: 740, duration: triplet },      // F#5
            { note: 880, duration: beat },         // A5
            { note: 784, duration: triplet },      // G5
            { note: 659, duration: beat },         // E5
            { note: 587, duration: triplet },      // D5
        ];

        // Bass line following G-Am-Em-D progression
        const bassLine = [
            // G bass
            { note: 196, duration: beat },   // G3
            { note: 196, duration: beat },
            { note: 196, duration: beat },
            { note: 196, duration: beat },

            // Am bass
            { note: 220, duration: beat },   // A3
            { note: 220, duration: beat },
            { note: 220, duration: beat },
            { note: 220, duration: beat },

            // Em bass
            { note: 165, duration: beat },   // E3
            { note: 165, duration: beat },
            { note: 165, duration: beat },
            { note: 165, duration: beat },

            // D bass
            { note: 147, duration: beat },   // D3
            { note: 147, duration: beat },
            { note: 147, duration: beat },
            { note: 147, duration: beat },
        ];

        // Fade in
        this.musicGainNode.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 2);

        const playLoop = () => {
            if (!this.musicPlaying || !this.musicEnabled) return;

            let time = this.audioContext.currentTime;

            // Play melody (lead voice)
            melody.forEach((note) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'triangle'; // Softer, more soulful tone
                osc.frequency.value = note.note;
                gain.gain.value = 0.4;

                // Add slight vibrato for soulful feel
                gain.gain.setValueAtTime(0.4, time);
                gain.gain.linearRampToValueAtTime(0.35, time + note.duration * 0.5);
                gain.gain.linearRampToValueAtTime(0.4, time + note.duration);

                osc.connect(gain);
                gain.connect(this.musicGainNode);

                osc.start(time);
                osc.stop(time + note.duration * 0.95);

                time += note.duration;

                this.musicOscillators.push(osc);
            });

            // Play bass line
            time = this.audioContext.currentTime;
            bassLine.forEach((note) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'sine'; // Deep bass
                osc.frequency.value = note.note;
                gain.gain.value = 0.25;

                osc.connect(gain);
                gain.connect(this.musicGainNode);

                osc.start(time);
                osc.stop(time + note.duration * 0.9);

                time += note.duration;

                this.musicOscillators.push(osc);
            });

            // Loop after melody completes
            const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0) * 1000;
            setTimeout(playLoop, totalDuration);
        };

        playLoop();
    }

    stopBackgroundMusic() {
        if (!this.musicPlaying) return;
        this.musicPlaying = false;

        // Fade out
        if (this.musicGainNode) {
            this.musicGainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        }

        // Stop all oscillators
        setTimeout(() => {
            this.musicOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.musicOscillators = [];
        }, 1000);
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopBackgroundMusic();
        } else if (this.musicPlaying) {
            // Restart if it was playing
            this.musicPlaying = false;
            this.playBackgroundMusic();
        }
        return this.musicEnabled;
    }
}

const sounds = new SoundEngine();

// =======================================
// GAME STATE
// =======================================

let spinCount = 0;
let isSpinning = false;
let currentFinaleStage = 0;
let secretKeyBuffer = '';

// =======================================
// SLOT MACHINE
// =======================================

const spinButton = document.getElementById('spinButton');
const resultMessage = document.getElementById('resultMessage');
const dateReveal = document.getElementById('dateReveal');
const revealCombo = document.getElementById('revealCombo');
const revealDate = document.getElementById('revealDate');
const revealTime = document.getElementById('revealTime');
const spinCounter = document.getElementById('spinCounter');
const valentineSection = document.getElementById('valentineSection');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const celebrationOverlay = document.getElementById('celebrationOverlay');
const confettiCanvas = document.getElementById('confettiCanvas');

async function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    dateReveal.classList.remove('visible');

    sounds.playSpinSound();

    spinCount++;
    spinCounter.textContent = `Spins Left: ${3 - spinCount}`;

    let results;
    if (spinCount === 3) {
        results = perfectCombo;
    } else {
        results = [
            Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 4)
        ];
    }

    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => reel.classList.add('spinning'));

    await new Promise(resolve => setTimeout(resolve, 2000));

    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const reel = document.getElementById(`reel${i + 1}`);
        const reelStrip = reel.querySelector('.reel-strip');
        reel.classList.remove('spinning');
        const targetPosition = -160 * results[i];
        reelStrip.style.transform = `translateY(${targetPosition}px)`;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    if (spinCount === 3) {
        sounds.playJackpotSound();
        resultMessage.textContent = "🎉 JACKPOT! Looks like we have a winner! 🎉";
        resultMessage.className = 'result-message winner';

        setTimeout(() => {
            showDateReveal(results);
            spinButton.disabled = true;
            setTimeout(() => {
                valentineSection.classList.add('visible');
            }, 1500);
        }, 1500);
    } else {
        sounds.playLoserSound();
        resultMessage.textContent = loserMessages[spinCount - 1];
        spinButton.disabled = false;
    }

    isSpinning = false;
}

function showDateReveal(results) {
    const comboText = results.map((result, i) => reelOptions[i][result]).join(' + ');
    revealCombo.textContent = comboText;
    revealDate.textContent = DATE_REVEAL.display_date;
    revealTime.textContent = DATE_REVEAL.time;
    dateReveal.classList.add('visible');

    // Start romantic background music after date reveal
    setTimeout(() => {
        sounds.playBackgroundMusic();
    }, 1000);
}

// =======================================
// RUNAWAY NO BUTTON
// =======================================

function setupRunawayButton() {
    noButton.addEventListener('mouseenter', () => {
        sounds.playClickSound();
        const buttonRect = noButton.getBoundingClientRect();
        const maxX = window.innerWidth - buttonRect.width - 40;
        const maxY = window.innerHeight - buttonRect.height - 40;

        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;

        const currentX = buttonRect.left;
        const currentY = buttonRect.top;
        const minDistance = 200;

        while (Math.abs(newX - currentX) < minDistance && Math.abs(newY - currentY) < minDistance) {
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
        }

        noButton.style.position = 'fixed';
        noButton.style.left = newX + 'px';
        noButton.style.top = newY + 'px';
        noButton.style.transition = 'all 0.3s ease';
    });

    noButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        noButton.dispatchEvent(new Event('mouseenter'));
    });
}

// =======================================
// MULTI-STAGE FINALE
// =======================================

function startFinale() {
    sounds.playCelebrationSound();
    celebrationOverlay.classList.add('active');

    // Initialize confetti
    initConfetti();

    // After 3 seconds, move to photos
    setTimeout(() => {
        showFinaleStage(2);
    }, 3000);
}

function showFinaleStage(stageNum) {
    // Hide all stages
    document.querySelectorAll('.finale-stage').forEach(stage => stage.classList.add('hidden'));

    // Show target stage
    const targetStage = document.getElementById(`finaleStage${stageNum}`);
    if (targetStage) {
        targetStage.classList.remove('hidden');
        currentFinaleStage = stageNum;

        // Initialize stage-specific features
        if (stageNum === 2) initCarousel();
        if (stageNum === 3) startTypewriter();
        if (stageNum === 4) startReasonsScroller();
        if (stageNum === 5) startMiniGame();
        if (stageNum === 6) startCountdown();
    }
}

// =======================================
// CONFETTI
// =======================================

function initConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confetti = [];
    const confettiCount = 150;
    const colors = ['#ff1744', '#c41e3a', '#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            velocity: { x: Math.random() * 10 - 5, y: Math.random() * -10 - 10 },
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 10
        });
    }

    function drawHeart(ctx, x, y, size, rotation, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -topCurveHeight, -size / 2, -topCurveHeight, -size / 2, 0);
        ctx.bezierCurveTo(-size / 2, topCurveHeight, 0, topCurveHeight + size / 2, 0, size);
        ctx.bezierCurveTo(0, topCurveHeight + size / 2, size / 2, topCurveHeight, size / 2, 0);
        ctx.bezierCurveTo(size / 2, -topCurveHeight, 0, -topCurveHeight, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    function updateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confetti.forEach((piece) => {
            piece.velocity.y += 0.5;
            piece.velocity.x *= 0.925;
            piece.velocity.y = Math.min(piece.velocity.y, 5);
            piece.x += piece.velocity.x;
            piece.y += piece.velocity.y;
            piece.rotation += piece.rotationSpeed;
            drawHeart(ctx, piece.x, piece.y, piece.size, piece.rotation, piece.color);
            if (piece.y > confettiCanvas.height) {
                piece.y = -20;
                piece.x = Math.random() * confettiCanvas.width;
            }
        });
        requestAnimationFrame(updateConfetti);
    }

    updateConfetti();
}

// =======================================
// PHOTO CAROUSEL
// =======================================

let carouselIndex = 0;

function initCarousel() {
    sounds.playClickSound();
    updateCarouselDisplay();

    document.getElementById('carouselPrev').addEventListener('click', () => {
        sounds.playClickSound();
        carouselIndex = (carouselIndex - 1 + 5) % 5;
        updateCarouselDisplay();
    });

    document.getElementById('carouselNext').addEventListener('click', () => {
        sounds.playClickSound();
        carouselIndex = (carouselIndex + 1) % 5;
        updateCarouselDisplay();
    });

    document.getElementById('continueFromPhotos').addEventListener('click', () => {
        sounds.playClickSound();
        showFinaleStage(3);
    });
}

function updateCarouselDisplay() {
    document.querySelectorAll('.carousel-photo').forEach((photo, i) => {
        photo.classList.toggle('active', i === carouselIndex);
    });
    document.getElementById('carouselIndicator').textContent = `${carouselIndex + 1} / 5`;
}

// =======================================
// TYPEWRITER LOVE LETTER
// =======================================

async function startTypewriter() {
    const content = document.getElementById('typewriterContent');
    content.textContent = '';

    for (let i = 0; i < LOVE_LETTER.length; i++) {
        content.textContent += LOVE_LETTER[i];
        if (i % 3 === 0) sounds.playClickSound();
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    document.querySelector('.typing-cursor').style.display = 'none';
    setTimeout(() => {
        document.getElementById('continueFromLetter').classList.remove('hidden');
    }, 500);

    document.getElementById('continueFromLetter').addEventListener('click', () => {
        sounds.playClickSound();
        showFinaleStage(4);
    });
}

// =======================================
// REASONS SCROLLER
// =======================================

function startReasonsScroller() {
    sounds.playClickSound();
    const scroller = document.getElementById('reasonsScroller');
    scroller.innerHTML = '';

    REASONS_I_LOVE_YOU.forEach((reason, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'reason-item';
            div.textContent = reason;
            scroller.appendChild(div);
            scroller.scrollTop = scroller.scrollHeight;
        }, i * 200);
    });

    document.getElementById('continueFromReasons').addEventListener('click', () => {
        sounds.playClickSound();
        showFinaleStage(5);
    });
}

// =======================================
// MINI GAME
// =======================================

function startMiniGame() {
    sounds.playClickSound();
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let score = 0;
    let timeLeft = 30;
    let gameRunning = true;

    const paddle = { x: canvas.width / 2 - 50, y: canvas.height - 30, width: 100, height: 20, speed: 10 };
    const hearts = [];

    function createHeart() {
        hearts.push({
            x: Math.random() * (canvas.width - 20),
            y: 0,
            speed: 2 + Math.random() * 2,
            size: 15
        });
    }

    setInterval(createHeart, 800);

    const keys = {};
    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    function update() {
        if (!gameRunning) return;

        // Move paddle
        if ((keys['ArrowLeft'] || keys['a']) && paddle.x > 0) paddle.x -= paddle.speed;
        if ((keys['ArrowRight'] || keys['d']) && paddle.x < canvas.width - paddle.width) paddle.x += paddle.speed;

        // Update hearts
        for (let i = hearts.length - 1; i >= 0; i--) {
            hearts[i].y += hearts[i].speed;

            // Check collision with paddle
            if (hearts[i].y + hearts[i].size > paddle.y &&
                hearts[i].x > paddle.x &&
                hearts[i].x < paddle.x + paddle.width) {
                score++;
                sounds.playClickSound();
                hearts.splice(i, 1);
                document.getElementById('gameScore').textContent = score;
            } else if (hearts[i].y > canvas.height) {
                hearts.splice(i, 1);
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw paddle
        ctx.fillStyle = '#ff006e';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        // Draw hearts
        ctx.font = `${20}px Arial`;
        hearts.forEach(heart => {
            ctx.fillText('💖', heart.x, heart.y);
        });
    }

    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTime').textContent = timeLeft;
        if (timeLeft <= 0) {
            gameRunning = false;
            clearInterval(timer);
            sounds.playJackpotSound();
            document.getElementById('continueFromGame').classList.remove('hidden');
        }
    }, 1000);

    document.getElementById('continueFromGame').addEventListener('click', () => {
        sounds.playClickSound();
        showFinaleStage(6);
    });

    update();
}

// =======================================
// COUNTDOWN TIMER
// =======================================

function startCountdown() {
    sounds.playClickSound();

    function updateCountdown() {
        const now = new Date().getTime();
        const target = new Date(DATE_REVEAL.date).getTime();
        const distance = target - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('countdownDays').textContent = String(days).padStart(2, '0');
            document.getElementById('countdownHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('countdownMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('countdownSeconds').textContent = String(seconds).padStart(2, '0');
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    document.getElementById('restartBtn').addEventListener('click', () => {
        location.reload();
    });
}

// =======================================
// SECRET EASTER EGG
// =======================================

document.addEventListener('keypress', (e) => {
    secretKeyBuffer += e.key.toUpperCase();
    if (secretKeyBuffer.length > 3) {
        secretKeyBuffer = secretKeyBuffer.substring(secretKeyBuffer.length - 3);
    }

    if (secretKeyBuffer === 'MIN') {
        sounds.playJackpotSound();
        document.getElementById('secretPopup').classList.remove('hidden');
        secretKeyBuffer = '';
    }
});

document.querySelector('.close-secret').addEventListener('click', () => {
    sounds.playClickSound();
    document.getElementById('secretPopup').classList.add('hidden');
});

// =======================================
// INSERT COIN & INITIALIZATION
// =======================================

document.getElementById('pressStartButton').addEventListener('click', () => {
    sounds.playCoinSound();
    document.getElementById('insertCoinOverlay').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('insertCoinOverlay').style.display = 'none';
    }, 500);
});

document.getElementById('soundToggle').addEventListener('click', () => {
    const enabled = sounds.toggle();
    document.getElementById('soundToggle').textContent = enabled ? '🔊' : '🔇';
    document.getElementById('soundToggle').classList.toggle('muted', !enabled);
    sounds.playClickSound();
});

document.getElementById('musicToggle').addEventListener('click', () => {
    const enabled = sounds.toggleMusic();
    document.getElementById('musicToggle').textContent = enabled ? '🎵' : '🔇';
    document.getElementById('musicToggle').classList.toggle('muted', !enabled);
    sounds.playClickSound();
});

spinButton.addEventListener('click', () => {
    sounds.playClickSound();
    spin();
});

yesButton.addEventListener('click', () => {
    sounds.playClickSound();
    startFinale();
});

setupRunawayButton();

// Floating hearts
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }, 500);
}

createFloatingHearts();

window.addEventListener('resize', () => {
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});
