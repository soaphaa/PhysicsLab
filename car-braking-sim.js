// ============================================
// CAR BRAKING TO A STOP SIMULATION
// ============================================
// Physics: Car decelerates from initial velocity at constant deceleration
// Motion: Velocity decreases over time until car stops
// Key measurements: Stopping distance, deceleration, time to stop

console.log('car-braking-sim.js loaded!');

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
// CAR OBJECT - represents the decelerating vehicle
// ============================================
let car = {
    x: 50,              // Horizontal position (pixels)
    y: canvas.height / 2,  // Vertical position (middle of canvas)
    vx: 0,              // Horizontal velocity (m/s)
    width: 60,          // Car sprite width
    height: 30,         // Car sprite height
    isMoving: false     // Animation state
};

// ============================================
// PHYSICS PARAMETERS
// ============================================
let physics = {
    deceleration: 4.0,    // m/s² (magnitude of slowing down - always positive)
    pixelScale: 100,      // pixels per meter (for visualization)
    canvasWidth: canvas.width,
    timeStep: 0.016       // Frame time (~60 FPS)
};

// ============================================
// STATS TRACKING - for display & analysis
// ============================================
let stats = {
    vi: 20,              // Initial velocity (m/s - user controllable)
    vf: 20,              // Final velocity (m/s - gets updated)
    deceleration: 4.0,   // m/s² (user controllable)
    timeElapsed: 0,      // Time since braking started (seconds)
    distanceTraveled: 0, // Distance traveled while braking (meters)
    stoppingDistance: 0, // Total distance needed to stop (meters)
    
    // TOGGLES: Show/hide each stat on canvas
    showVi: true,
    showVf: true,
    showDeceleration: true,
    showTime: true,
    showDistance: true,
    showStoppingDistance: true
};

// ============================================
// RESET FUNCTION
// ============================================
function reset() {
    car.x = 50;              // Back to left side
    car.vx = (stats.vi / 60) * physics.pixelScale;  // Convert m/s to pixels/frame
    car.isMoving = false;
    
    // Calculate theoretical stopping distance: d = v²/(2a)
    // This helps show students what to expect
    stats.stoppingDistance = (stats.vi * stats.vi) / (2 * stats.deceleration);
    
    // Reset tracking stats
    stats.vf = stats.vi;
    stats.timeElapsed = 0;
    stats.distanceTraveled = 0;
    
    console.log(`Car reset. Initial velocity: ${stats.vi} m/s, Stopping distance: ${stats.stoppingDistance.toFixed(2)}m`);
}

// ============================================
// PHYSICS UPDATES - called every frame
// ============================================
function updatePhysics() {
    if (!car.isMoving) return;

    // Deceleration in pixels/frame²
    const decelerationPixelsPerFrame = (stats.deceleration * physics.pixelScale) / (60 * 60);
    
    // Update velocity: vx decreases due to braking (negative acceleration)
    car.vx -= decelerationPixelsPerFrame;
    
    // Stop velocity at 0 (no reverse motion)
    if (car.vx < 0) {
        car.vx = 0;
        car.isMoving = false;
    }
    
    // Update position: car moves based on (decreasing) velocity
    car.x += car.vx;
    
    // Convert pixel velocity to m/s for display
    const velocityMS = (car.vx / physics.pixelScale) * 60;
    stats.vf = velocityMS;
    
    // Track time
    stats.timeElapsed += (1 / 60);
    
    // Distance traveled while braking (in meters)
    stats.distanceTraveled = (car.x - 50) / physics.pixelScale;
    
    // STOP: Car has come to rest
    if (car.vx <= 0) {
        car.vx = 0;
        car.isMoving = false;
        console.log(`Car stopped. Distance: ${stats.distanceTraveled.toFixed(2)}m, Time: ${stats.timeElapsed.toFixed(2)}s, Expected: ${stats.stoppingDistance.toFixed(2)}m`);
    }
    
    saveStats();
}

// ============================================
// DRAWING FUNCTION
// ============================================
function draw() {
    // Background (road)
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road markings (yellow center line)
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 + 15);
    ctx.lineTo(canvas.width, canvas.height / 2 + 15);
    ctx.stroke();
    ctx.setLineDash([]);  // Reset line dash

    // STOPPING DISTANCE MARKER - Visual guide
    if (stats.stoppingDistance > 0) {
        const expectedStopX = 50 + (stats.stoppingDistance * physics.pixelScale);
        if (expectedStopX < canvas.width) {
            // Dashed red line showing where car should stop
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.moveTo(expectedStopX, car.y - 30);
            ctx.lineTo(expectedStopX, car.y + 30);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    // CAR - Red rectangle with wheels
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(car.x, car.y - car.height / 2, car.width, car.height);
    
    // Car border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(car.x, car.y - car.height / 2, car.width, car.height);
    
    // Wheels
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(car.x + 15, car.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(car.x + 45, car.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Brake marks (red skid marks if braking)
    if (car.isMoving && stats.vf > 2) {
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.lineWidth = 4;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(car.x + 10, car.y + 15);
        ctx.lineTo(car.x - 20, car.y + 15);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Velocity vector (white arrow showing direction of motion)
    if (stats.vf > 0.5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(car.x + car.width, car.y);
        ctx.lineTo(car.x + car.width + car.vx * 0.3, car.y);
        ctx.stroke();
        
        // Arrowhead
        const arrowSize = 6;
        ctx.beginPath();
        ctx.moveTo(car.x + car.width + car.vx * 0.3, car.y);
        ctx.lineTo(car.x + car.width + car.vx * 0.3 - arrowSize, car.y - arrowSize);
        ctx.lineTo(car.x + car.width + car.vx * 0.3 - arrowSize, car.y + arrowSize);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }

    // TEXT DISPLAY - Dynamic based on toggles
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    let yPosition = 30;

    if (stats.showVi) {
        ctx.fillText(`Vi (Initial Velocity): ${stats.vi.toFixed(2)} m/s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showVf) {
        ctx.fillText(`Vf (Final Velocity): ${stats.vf.toFixed(2)} m/s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showDeceleration) {
        ctx.fillText(`Deceleration: ${stats.deceleration.toFixed(2)} m/s²`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showTime) {
        ctx.fillText(`Time: ${stats.timeElapsed.toFixed(2)} s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showDistance) {
        ctx.fillText(`Distance Traveled: ${Math.max(0, stats.distanceTraveled).toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showStoppingDistance) {
        ctx.fillText(`Expected Stopping Distance: ${stats.stoppingDistance.toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }

    // Show kinematic equation at bottom
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`d = v₀t - 0.5at² or vf² = vi² - 2ad`, 20, canvas.height - 20);
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
const decelerationInput = document.getElementById('deceleration');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const velocityVal = document.getElementById('velocityVal');
const decelerationVal = document.getElementById('decelerationVal');

// Toggle checkbox elements
const viToggle = document.getElementById('toggle-vi');
const vfToggle = document.getElementById('toggle-vf');
const decelerationToggle = document.getElementById('toggle-deceleration');
const timeToggle = document.getElementById('toggle-time');
const distanceToggle = document.getElementById('toggle-distance');
const stoppingDistanceToggle = document.getElementById('toggle-stopping-distance');

// ============================================
// CONTROL LISTENERS
// ============================================

// Velocity slider: Sets initial speed before braking
if (velocityInput) {
    velocityInput.addEventListener('input', (e) => {
        stats.vi = parseFloat(e.target.value);
        velocityVal.textContent = stats.vi;
        reset();
    });
}

// Deceleration slider: Changes how hard the car brakes
if (decelerationInput) {
    decelerationInput.addEventListener('input', (e) => {
        stats.deceleration = parseFloat(e.target.value);
        physics.deceleration = stats.deceleration;
        decelerationVal.textContent = stats.deceleration;
        reset();
    });
}

// Start button: Begin braking
if (startBtn) {
    startBtn.addEventListener('click', () => {
        reset();
        car.isMoving = true;
        console.log(`Car braking from ${stats.vi} m/s with deceleration ${stats.deceleration} m/s²`);
    });
}

// Reset button: Stop and reset car
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

if (decelerationToggle) {
    decelerationToggle.addEventListener('change', (e) => {
        stats.showDeceleration = e.target.checked;
    });
}

if (timeToggle) {
    timeToggle.addEventListener('change', (e) => {
        stats.showTime = e.target.checked;
    });
}

if (distanceToggle) {
    distanceToggle.addEventListener('change', (e) => {
        stats.showDistance = e.target.checked;
    });
}

if (stoppingDistanceToggle) {
    stoppingDistanceToggle.addEventListener('change', (e) => {
        stats.showStoppingDistance = e.target.checked;
    });
}

// ============================================
// PERSISTENT STORAGE
// ============================================
function saveStats() {
    localStorage.setItem('carBrakingStats', JSON.stringify(stats));
}

function loadStats() {
    const saved = localStorage.getItem('carBrakingStats');
    if (saved) {
        stats = JSON.parse(saved);
        stats.deceleration = physics.deceleration;
    }
}

// Initialize
loadStats();
reset();
animate();