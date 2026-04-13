// ============================================
// CAR SPEEDING UP SIMULATION
// ============================================
// Physics: Car accelerates from rest at constant acceleration
// Motion: Linear increase in velocity over time
// Key measurements: Distance traveled, final velocity, time elapsed

console.log('car-speeding-sim.js loaded!');

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
// CAR OBJECT - represents the accelerating vehicle
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
    acceleration: 2.0,    // m/s² (rate of speedup)
    pixelScale: 100,      // pixels per meter (for visualization)
    canvasWidth: canvas.width,
    timeStep: 0.016       // Frame time (~60 FPS)
};

// ============================================
// STATS TRACKING - for display & analysis
// ============================================
let stats = {
    vi: 0,              // Initial velocity (always 0 for this sim)
    vf: 0,              // Final velocity (m/s)
    acceleration: 2.0,  // m/s² (user controllable)
    timeElapsed: 0,     // Time since start (seconds)
    distanceTraveled: 0,  // Distance from start (meters)
    
    // TOGGLES: Show/hide each stat on canvas
    showVi: true,
    showVf: true,
    showAcceleration: true,
    showTime: true,
    showDistance: true
};

// ============================================
// RESET FUNCTION
// ============================================
function reset() {
    car.x = 50;              // Back to left side
    car.vx = 0;              // Stop moving
    car.isMoving = false;
    
    // Reset all tracked stats
    stats.vi = 0;
    stats.vf = 0;
    stats.timeElapsed = 0;
    stats.distanceTraveled = 0;
    
    console.log('Car reset');
}

// ============================================
// PHYSICS UPDATES - called every frame
// ============================================
function updatePhysics() {
    if (!car.isMoving) return;

    // Acceleration in pixels/frame²
    const accelerationPixelsPerFrame = (stats.acceleration * physics.pixelScale) / (60 * 60);
    
    // Update velocity: vx increases due to acceleration
    car.vx += accelerationPixelsPerFrame;
    
    // Update position: car moves based on velocity
    car.x += car.vx;
    
    // Convert pixel velocity to m/s for display
    const velocityMS = (car.vx / physics.pixelScale) * 60;
    stats.vf = velocityMS;
    
    // Track time
    stats.timeElapsed += (1 / 60);
    
    // Distance traveled in meters
    stats.distanceTraveled = (car.x - 50) / physics.pixelScale;
    
    // BOUNDARY CHECK: Stop car if it leaves canvas
    if (car.x > physics.canvasWidth - car.width) {
        car.x = physics.canvasWidth - car.width;
        car.isMoving = false;
        console.log(`Car stopped at edge. Distance: ${stats.distanceTraveled.toFixed(2)}m, Velocity: ${stats.vf.toFixed(2)}m/s`);
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

    // CAR - Simple rectangle with color gradient
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

    // Velocity vector (white arrow showing direction of motion)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(car.x + car.width, car.y);
    ctx.lineTo(car.x + car.width + car.vx * 0.5, car.y);
    ctx.stroke();
    
    // Arrowhead
    const arrowSize = 6;
    ctx.beginPath();
    ctx.moveTo(car.x + car.width + car.vx * 0.5, car.y);
    ctx.lineTo(car.x + car.width + car.vx * 0.5 - arrowSize, car.y - arrowSize);
    ctx.lineTo(car.x + car.width + car.vx * 0.5 - arrowSize, car.y + arrowSize);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();

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

    if (stats.showAcceleration) {
        ctx.fillText(`Acceleration: ${stats.acceleration.toFixed(2)} m/s²`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showTime) {
        ctx.fillText(`Time: ${stats.timeElapsed.toFixed(2)} s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showDistance) {
        ctx.fillText(`Distance: ${Math.max(0, stats.distanceTraveled).toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }

    // Also display the kinematic equation: d = v0*t + 0.5*a*t²
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`d = 0.5at² (no initial velocity)`, 20, canvas.height - 20);
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
const accelerationInput = document.getElementById('acceleration');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const accelerationVal = document.getElementById('accelerationVal');

// Toggle checkbox elements
const viToggle = document.getElementById('toggle-vi');
const vfToggle = document.getElementById('toggle-vf');
const accelerationToggle = document.getElementById('toggle-acceleration');
const timeToggle = document.getElementById('toggle-time');
const distanceToggle = document.getElementById('toggle-distance');

// ============================================
// CONTROL LISTENERS
// ============================================

// Acceleration slider: Changes how fast car speeds up
if (accelerationInput) {
    accelerationInput.addEventListener('input', (e) => {
        stats.acceleration = parseFloat(e.target.value);
        physics.acceleration = stats.acceleration;
        accelerationVal.textContent = stats.acceleration;
        reset();
    });
}

// Start button: Begin acceleration
if (startBtn) {
    startBtn.addEventListener('click', () => {
        reset();
        car.isMoving = true;
        console.log(`Car accelerating at ${stats.acceleration} m/s²`);
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

if (accelerationToggle) {
    accelerationToggle.addEventListener('change', (e) => {
        stats.showAcceleration = e.target.checked;
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

// ============================================
// PERSISTENT STORAGE
// ============================================
function saveStats() {
    localStorage.setItem('carSpeedingStats', JSON.stringify(stats));
}

function loadStats() {
    const saved = localStorage.getItem('carSpeedingStats');
    if (saved) {
        stats = JSON.parse(saved);
        stats.acceleration = physics.acceleration;
    }
}

// Initialize
loadStats();
reset();
animate();