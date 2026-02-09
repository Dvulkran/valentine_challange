// ==================== BACKGROUND ANIMATION ====================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 5 + 2;
        this.speedY = Math.random() * 1 - 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.color = `hsl(${Math.random() * 60 + 330}, 100%, ${Math.random() * 30 + 50}%)`;
        this.heart = Math.random() > 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        if (this.heart) {
            ctx.font = `${this.size * 3}px Arial`;
            ctx.fillText('❤️', this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 50; i++) particles.push(new Particle());

function animate() {
    ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}
animate();

// ==================== LEVEL MANAGEMENT ====================
let currentLevel = 1;
const totalLevels = 4;

function nextLevel() {
    document.getElementById(`level-${currentLevel}`).classList.remove('active');
    currentLevel++;
    if (currentLevel <= totalLevels) {
        document.getElementById(`level-${currentLevel}`).classList.add('active');
        updateProgress();
        
        if (currentLevel === 2) initMaze();
        if (currentLevel === 3) initMemory();
        if (currentLevel === 4) initFinalLevel();
    }
}

function updateProgress() {
    const percent = (currentLevel / totalLevels) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').textContent = `Level ${currentLevel}/${totalLevels}`;
}

// ==================== LEVEL 1: WORD SCRAMBLE ====================
const scrambledWords = document.querySelectorAll('.scramble-word');
scrambledWords.forEach(word => {
    word.addEventListener('click', function() {
        // Reveal animation
        this.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            this.textContent = this.dataset.word;
            this.classList.add('solved');
            this.style.transform = 'scale(1)';
        }, 300);
    });
});

function checkDecode() {
    const input = document.getElementById('decode-input').value.toUpperCase().trim();
    const correct = "VALENTINE WILL YOU BE MINE";
    
    if (input === correct || input === "WILL YOU BE MY VALENTINE") {
        createParticles(document.getElementById('decode-input'));
        setTimeout(nextLevel, 1000);
    } else {
        document.getElementById('decode-input').classList.add('shake');
        setTimeout(() => {
            document.getElementById('decode-input').classList.remove('shake');
        }, 500);
    }
}

// ==================== LEVEL 2: MAZE GAME ====================
const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];
const cellSize = 40;
let playerPos = {x: 1, y: 1};
let targetPos = {x: 8, y: 8};

function initMaze() {
    const mazeCanvas = document.getElementById('mazeCanvas');
    const mctx = mazeCanvas.getContext('2d');
    drawMaze(mctx);
}

function drawMaze(mctx) {
    mctx.fillStyle = '#2d3436';
    mctx.fillRect(0, 0, 400, 400);
    
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (mazeLayout[y][x] === 0) {
                mctx.fillStyle = 'rgba(255,255,255,0.1)';
                mctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else {
                mctx.fillStyle = '#636e72';
                mctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                mctx.strokeStyle = '#2d3436';
                mctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Draw player
    mctx.fillStyle = '#ff6b9d';
    mctx.beginPath();
    mctx.arc(playerPos.x * cellSize + cellSize/2, playerPos.y * cellSize + cellSize/2, 15, 0, Math.PI * 2);
    mctx.fill();
    mctx.shadowBlur = 20;
    mctx.shadowColor = '#ff6b9d';
    
    // Draw target
    mctx.font = '30px Arial';
    mctx.fillText('💕', targetPos.x * cellSize + 5, targetPos.y * cellSize + 30);
    mctx.shadowBlur = 0;
}

function movePlayer(direction) {
    const mazeCanvas = document.getElementById('mazeCanvas');
    const mctx = mazeCanvas.getContext('2d');
    let newX = playerPos.x;
    let newY = playerPos.y;
    
    if (direction === 'up') newY--;
    if (direction === 'down') newY++;
    if (direction === 'left') newX--;
    if (direction === 'right') newX++;
    
    if (mazeLayout[newY][newX] === 0) {
        playerPos.x = newX;
        playerPos.y = newY;
        drawMaze(mctx);
        
        if (playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
            document.getElementById('maze-status').textContent = 'Found it! 💕';
            setTimeout(nextLevel, 1000);
        }
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (currentLevel === 2) {
        if (e.key === 'ArrowUp') movePlayer('up');
        if (e.key === 'ArrowDown') movePlayer('down');
        if (e.key === 'ArrowLeft') movePlayer('left');
        if (e.key === 'ArrowRight') movePlayer('right');
    }
});

// ==================== LEVEL 3: MEMORY GAME ====================
const emojis = ['🌹', '🎁', '💌', '🍫', '🧸', '💍'];
let cards = [];
let flippedCards = [];
let matches = 0;

function initMemory() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);
    matches = 0;
    flippedCards = [];
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = '?';
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length >= 2) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    this.textContent = this.dataset.emoji;
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            document.getElementById('matches').textContent = matches;
            flippedCards = [];
            
            if (matches === 6) {
                setTimeout(nextLevel, 1000);
            }
        }, 500);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            flippedCards = [];
        }, 1000);
    }
}

// ==================== LEVEL 4: THE IMPOSSIBLE BUTTON ====================
let noClicks = 0;
let mouseX = 0, mouseY = 0;

function initFinalLevel() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        moveNoButton();
    });
    
    // Touch support
    document.addEventListener('touchmove', (e) => {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        moveNoButton();
    }, {passive: true});
    
    noBtn.addEventListener('mouseenter', () => {
        teleportButton();
    });
    
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        teleportButton();
    });
    
    yesBtn.addEventListener('click', showVictory);
}

function moveNoButton() {
    const noBtn = document.getElementById('no-btn');
    const rect = noBtn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    
    const distance = Math.hypot(mouseX - btnX, mouseY - btnY);
    
    if (distance < 150) {
        teleportButton();
    }
}

function teleportButton() {
    const noBtn = document.getElementById('no-btn');
    const container = document.querySelector('.choice-container');
    const rect = container.getBoundingClientRect();
    
    // Random position within container but away from Yes button
    const maxX = rect.width - noBtn.offsetWidth - 20;
    const maxY = rect.height - noBtn.offsetHeight - 20;
    
    let newX, newY, safeDistance;
    let attempts = 0;
    
    do {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
        
        // Calculate distance from Yes button (center top)
        const yesBtn = document.getElementById('yes-btn');
        const yesRect = yesBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const yesX = yesRect.left - containerRect.left + yesRect.width/2;
        const yesY = yesRect.top - containerRect.top + yesRect.height/2;
        
        const distToYes = Math.hypot(newX - yesX + 50, newY - yesY);
        safeDistance = distToYes > 100;
        attempts++;
    } while (!safeDistance && attempts < 50);
    
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`;
    
    noClicks++;
    document.querySelector('#caught-counter span').textContent = noClicks;
    
    // Change text randomly
    const texts = ['No', 'Nope', 'Never', 'Nice try!', 'Too slow!', 'Catch me!', '🏃‍♂️💨', 'Almost!'];
    noBtn.textContent = texts[Math.floor(Math.random() * texts.length)];
    
    // Create particles
    createParticles(noBtn);
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = rect.left + rect.width/2 + 'px';
        particle.style.top = rect.top + rect.height/2 + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = `hsl(${Math.random() * 60 + 330}, 100%, 70%)`;
        particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// ==================== VICTORY ====================
function showVictory() {
    document.getElementById('level-4').classList.remove('active');
    document.getElementById('victory').classList.add('active');
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('progress-text').textContent = 'COMPLETE! ❤️';
    
    // Epic fireworks
    setInterval(createFirework, 300);
    setInterval(createFirework, 500);
    setInterval(createFirework, 700);
}

function createFirework() {
    const container = document.getElementById('fireworks-container');
    const firework = document.createElement('div');
    firework.style.position = 'absolute';
    firework.style.left = Math.random() * 100 + '%';
    firework.style.top = Math.random() * 100 + '%';
    firework.style.width = '5px';
    firework.style.height = '5px';
    firework.style.borderRadius = '50%';
    firework.style.background = `hsl(${Math.random() * 60 + 330}, 100%, 70%)`;
    firework.style.boxShadow = '0 0 10px currentColor';
    
    container.appendChild(firework);
    
    // Explode
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = firework.style.left;
        particle.style.top = firework.style.top;
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = firework.style.background;
        particle.style.transition = 'all 1s ease-out';
        container.appendChild(particle);
        
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            particle.style.transform = `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => particle.remove(), 1000);
    }
    
    setTimeout(() => firework.remove(), 1000);
}

// Add some easter eggs
console.log('%c❤️ Happy Valentine\'s Day! ❤️', 'font-size: 30px; color: #ff6b9d; font-weight: bold;');
console.log('%cThe answer is: VALENTINE WILL YOU BE MINE', 'font-size: 14px; color: #636e72;');