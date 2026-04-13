// ============================================
// THROWING OBJECT STRAIGHT UP SIMULATION
// ============================================
// Physics: Object thrown upward at initial velocity
// Motion: Two phases - deceleration going up, acceleration going down
// Key measurements: Max height, time to peak, final velocity

console.log('throwing-up-sim.js loaded!');

// ============================================
// CANVAS SETUP
// ============================================
const canvas = document.getElementById('canvas');
if (!canvas) {
    console.error('❌ CANVAS NOT FOUND! Check your HTML id="canvas"');
} else {
    console.log('✅ Canvas found!');
}

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;
const ctx = canvas.getContext('2d');

// ============================================
// PHYSICS OBJECT - represents the thrown ball
// ============================================
let ball = {
    x: 0,           // Horizontal position (center of canvas)
    y: 0,           // Vertical position
    vy: 0,          // Vertical velocity (m/s, positive = upward)
    radius: 15,     // Ball radius in pixels
    isMoving: false // Animation state
};

// ============================================
// PHYSICS PARAMETERS
// ============================================
let physics = {
    gravity: 9.81,        // m/s² (downward acceleration)
    pixelScale: 100,      // pixels per meter (for visualization)
    groundLevel: 300,     // Where the ball starts (pixels from top)
    timeStep: 0.016       // Frame time (~60 FPS)
};

// ============================================
// STATS TRACKING - for display & analysis
// ============================================
let stats = {
    vi: 0,                // Initial velocity (m/s upward)
    vf: 0,                // Final velocity (m/s when ball returns)
    timeElapsed: 0,       // Total time in air (seconds)
    maxHeight: 0,         // Peak height above launch point (meters)
    timeToMaxHeight: 0,   // Time to reach peak (seconds)
    heightNow: 0,         // Current height above launch point (meters)
    
    // TOGGLES: Show/hide each stat on canvas
    showVi: true,
    showVf: true,
    showTime: true,
    showMaxHeight: true,
    showTimeToMaxHeight: true,
    showHeightNow: true
};

// ============================================
// RESET FUNCTION
// ============================================
function reset() {
    ball.x = canvas.width / 2;        // Center horizontally
    ball.y = physics.groundLevel;     // Start at ground level
    ball.vy = 0;                      // No velocity
    ball.isMoving = false;
    
    // Reset all tracked stats
    stats.vi = 0;
    stats.vf = 0;
    stats.timeElapsed = 0;
    stats.maxHeight = 0;
    stats.timeToMaxHeight = 0;
    stats.heightNow = 0;
    
    console.log('Ball reset');
}

// ============================================
// PHYSICS UPDATES - called every frame
// ============================================
function updatePhysics() {
    if (!ball.isMoving) return;

    // Gravity acceleration (pixels/frame²)
    const gravityPixelsPerFrame = (physics.gravity * physics.pixelScale) / (60 * 60);
    
    // Update vertical velocity: vy decreases (becomes more negative) as gravity pulls down
    ball.vy -= gravityPixelsPerFrame;
    
    // Update vertical position
    ball.y -= ball.vy;  // Negative because canvas Y increases downward
    
    // Convert pixel velocity to m/s for display
    const velocityMS = (ball.vy / physics.pixelScale) * 60;
    stats.vf = velocityMS;
    
    // Track time
    stats.timeElapsed += (1 / 60);
    
    // Calculate current height above launch point
    const distanceFallenPixels = ball.y - physics.groundLevel;
    stats.heightNow = -(distanceFallenPixels / physics.pixelScale);  // Negative because going up
    
    // Track maximum height reached
    if (stats.heightNow > stats.maxHeight) {
        stats.maxHeight = stats.heightNow;
        stats.timeToMaxHeight = stats.timeElapsed;
    }
    
    // COLLISION: Ball returns to ground level
    if (ball.y >= physics.groundLevel) {
        ball.y = physics.groundLevel;
        ball.vy = 0;
        ball.isMoving = false;
        console.log(`Ball landed. Max height: ${stats.maxHeight.toFixed(2)}m, Time: ${stats.timeElapsed.toFixed(2)}s`);
    }
    
    saveStats();
}

// ============================================
// DRAWING FUNCTION
// ============================================
function draw() {
    // Background
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground line (green)
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, physics.groundLevel);
    ctx.lineTo(canvas.width, physics.groundLevel);
    ctx.stroke();

    // Ball (red circle)
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow (white line showing direction)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(ball.x, ball.y - ball.vy * 2);  // Scaled velocity vector
    ctx.stroke();

    // TEXT DISPLAY - Dynamic based on toggles
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    let yPosition = 30;

    if (stats.showVi) {
        ctx.fillText(`Vi (Initial Velocity): ${stats.vi.toFixed(2)} m/s ↑`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showVf) {
        ctx.fillText(`Vf (Final Velocity): ${stats.vf.toFixed(2)} m/s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showTime) {
        ctx.fillText(`Time: ${stats.timeElapsed.toFixed(2)} s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showMaxHeight) {
        ctx.fillText(`Max Height: ${Math.max(0, stats.maxHeight).toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showTimeToMaxHeight) {
        ctx.fillText(`Time to Max Height: ${Math.max(0, stats.timeToMaxHeight).toFixed(2)} s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showHeightNow) {
        ctx.fillText(`Height Now: ${Math.max(0, stats.heightNow).toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }
}

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}

// ============================================
// DOM ELEMENTS & EVENT LISTENERS
// ============================================
const velocityInput = document.getElementById('velocity');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const velocityVal = document.getElementById('velocityVal');

// Toggle checkbox elements
const viToggle = document.getElementById('toggle-vi');
const vfToggle = document.getElementById('toggle-vf');
const timeToggle = document.getElementById('toggle-time');
const maxHeightToggle = document.getElementById('toggle-max-height');
const timeToMaxToggle = document.getElementById('toggle-time-to-max');
const heightNowToggle = document.getElementById('toggle-height-now');

// ============================================
// CONTROL LISTENERS
// ============================================

// Velocity slider: Changes initial upward velocity
if (velocityInput) {
    velocityInput.addEventListener('input', (e) => {
        stats.vi = parseFloat(e.target.value);
        velocityVal.textContent = stats.vi;
        reset();
    });
}

// Start button: Launch the ball upward
if (startBtn) {
    startBtn.addEventListener('click', () => {
        reset();
        // Convert m/s to pixels/frame for physics engine
        ball.vy = (stats.vi / 60) * physics.pixelScale;
        ball.isMoving = true;
        console.log(`Launching at ${stats.vi} m/s`);
    });
}

// Reset button: Return ball to ground
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        reset();
    });
}

// ============================================
// TOGGLE LISTENERS - Show/hide each stat
// ============================================
if (viToggle) {
    viToggle.addEventListener('change', (e) => {
        stats.showVi = e.target.checked;
    });
}

if (vfToggle) {
    vfToggle.addEventListener('change', (e) => {
        stats.showVf = e.target.checked;
    });
}

if (timeToggle) {
    timeToggle.addEventListener('change', (e) => {
        stats.showTime = e.target.checked;
    });
}

if (maxHeightToggle) {
    maxHeightToggle.addEventListener('change', (e) => {
        stats.showMaxHeight = e.target.checked;
    });
}

if (timeToMaxToggle) {
    timeToMaxToggle.addEventListener('change', (e) => {
        stats.showTimeToMaxHeight = e.target.checked;
    });
}

if (heightNowToggle) {
    heightNowToggle.addEventListener('change', (e) => {
        stats.showHeightNow = e.target.checked;
    });
}

// ============================================
// PERSISTENT STORAGE
// ============================================
function saveStats() {
    localStorage.setItem('throwingUpStats', JSON.stringify(stats));
}

function loadStats() {
    const saved = localStorage.getItem('throwingUpStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

// Initialize
loadStats();
reset();
animate();