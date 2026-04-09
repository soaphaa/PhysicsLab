// DEBUG: Check if script is loading
console.log('freefalling-sim.js loaded!');

// DEBUG: Check if canvas exists
const canvas = document.getElementById('canvas');
console.log('Canvas element:', canvas);

if (!canvas) {
    console.error('❌ CANVAS NOT FOUND! Check your HTML id="canvas"');
} else {
    console.log('✅ Canvas found!');
    console.log('Canvas size:', canvas.width, 'x', canvas.height);
}

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

const ctx = canvas.getContext('2d');
console.log('Context:', ctx);

//canvas will fit the size of the screen
canvas.width = canvas.parentElement.offsetWidth;
console.log('Canvas width set to:', canvas.width);

//setting values
let ball = {
    x:0,
    y:0,
    vx:0,
    vy:0,
    radius:15, 
    isMoving:false //initially doesnt move
}

let physics = {
    gravity: 9.81,
    pixelScale: 100,
    startHeight: 100,
    timeStep: 0.016
};

// ADDED: Stats tracking object
let stats = {
    vi: 0,  // Initial velocity (at start of fall)
    vf: 0,  // Final velocity (when ball hits ground)
    timeElapsed: 0,  // Time since ball started falling
    distanceFallen: 0,  // Distance from start to current position
    // ADDED: Toggles for what to display
    showVi: true,
    showVf: true,
    showTime: true,
    showDistance: true,
    showHeight: true
};

function reset() {
    ball.x = canvas.width / 2;
    ball.y = physics.startHeight;
    ball.vy = 0;
    ball.isMoving = false;  // Ball stays still until Start is clicked
    // ADDED: Reset stats when ball resets
    stats.vi = 0;
    stats.vf = 0;
    stats.timeElapsed = 0;
    stats.distanceFallen = 0;
    console.log('Ball reset to:', ball.x, ball.y);
}

function updatePhysics(){
    if(!ball.isMoving) return;

    const gravityPixelsPerFrame = (physics.gravity * physics.pixelScale) / (60 * 60);
    ball.vy += gravityPixelsPerFrame;
    ball.y += ball.vy;
    
    // ADDED: Update stats as ball falls
    const velocityMS = (ball.vy / physics.pixelScale) * 60;
    stats.vf = velocityMS;  // Update final velocity
    stats.timeElapsed += (1/60);  // Increment time by 1 frame
    stats.distanceFallen = (ball.y - physics.startHeight) / physics.pixelScale;
    
    const groundLevel = canvas.height - ball.radius;
    if (ball.y >= groundLevel){
        ball.y = groundLevel;
        ball.vy = 0;
        ball.isMoving = false;
    }
}

function draw(){
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const groundLevel = canvas.height - ball.radius;
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(canvas.width, groundLevel);
    ctx.stroke();

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(ball.x, ball.y + ball.vy*2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';

    // ADDED: Dynamic stats display based on toggles
    let yPosition = 30;

    if (stats.showVi) {
        ctx.fillText(`Vi (Initial Velocity): ${stats.vi.toFixed(2)} m/s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showVf) {
        const velocityMS = (ball.vy / physics.pixelScale) * 60;
        ctx.fillText(`Vf (Final Velocity): ${velocityMS.toFixed(2)} m/s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showTime) {
        ctx.fillText(`Time: ${stats.timeElapsed.toFixed(2)} s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showDistance) {
        ctx.fillText(`Distance Fallen: ${Math.max(0, stats.distanceFallen).toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showHeight) {
        const heightAboveGround = (groundLevel - ball.y) / physics.pixelScale;
        ctx.fillText(`Height: ${Math.max(0, heightAboveGround).toFixed(2)} m`, 20, yPosition);
        yPosition += 25;
    }
}

//actual animation
function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}

const heightInput = document.getElementById('height');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
 
const heightVal = document.getElementById('heightVal');

// ADDED: Get toggle checkboxes
const viToggle = document.getElementById('toggle-vi');
const vfToggle = document.getElementById('toggle-vf');
const timeToggle = document.getElementById('toggle-time');
const distanceToggle = document.getElementById('toggle-distance');
const heightToggle = document.getElementById('toggle-height');
 
// Height slider
if (heightInput) {
    heightInput.addEventListener('input', (e) => {
        physics.startHeight = parseFloat(e.target.value);
        heightVal.textContent = physics.startHeight;
        reset();
    });
}
 
// Start button - begins the fall
if (startBtn) {
    startBtn.addEventListener('click', () => {
        reset();
        stats.vi = 0;  // Vi is always 0 for free fall
        ball.isMoving = true;  // NOW the ball falls
    });
}
 
// Reset button - puts ball back at top
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        reset();
    });
}

// ADDED: Toggle event listeners
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

if (distanceToggle) {
    distanceToggle.addEventListener('change', (e) => {
        stats.showDistance = e.target.checked;
    });
}

if (heightToggle) {
    heightToggle.addEventListener('change', (e) => {
        stats.showHeight = e.target.checked;
    });
}
 
reset();
animate();