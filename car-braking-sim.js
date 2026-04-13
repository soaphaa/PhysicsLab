// DEBUG: Check if script is loading
console.log('car-braking-sim.js loaded!');

// DEBUG: Check if canvas exists
let canvas = document.getElementById('canvas');
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
let car = {
    x: 50,
    y: 0,
    vx: 0,
    width: 60,
    height: 30,
    isMoving: false
}

let physics = {
    deceleration: 4.0,
    pixelScale: 100,
    timeStep: 0.016
};

let stats = {
    vi: 20,
    vf: 20,
    deceleration: 4.0,
    timeElapsed: 0,
    distanceTraveled: 0,
    stoppingDistance: 0,
    showVi: true,
    showVf: true,
    showDeceleration: true,
    showTime: true,
    showDistance: true,
    showStoppingDistance: true
};

function reset() {
    car.x = 50;
    car.y = canvas.height / 2;
    car.vx = (stats.vi / 60) * physics.pixelScale;
    car.isMoving = false;
    
    stats.stoppingDistance = (stats.vi * stats.vi) / (2 * stats.deceleration);
    stats.vf = stats.vi;
    stats.timeElapsed = 0;
    stats.distanceTraveled = 0;
    console.log(`Car reset. Initial velocity: ${stats.vi} m/s, Stopping distance: ${stats.stoppingDistance.toFixed(2)}m`);
}

function updatePhysics(){
    if(!car.isMoving) return;

    const decelerationPixelsPerFrame = (stats.deceleration * physics.pixelScale) / (60 * 60);
    
    car.vx -= decelerationPixelsPerFrame;
    
    if (car.vx < 0) {
        car.vx = 0;
        car.isMoving = false;
    }
    
    car.x += car.vx;
    
    const velocityMS = (car.vx / physics.pixelScale) * 60;
    stats.vf = velocityMS;
    stats.timeElapsed += (1/60);
    stats.distanceTraveled = (car.x - 50) / physics.pixelScale;
    
    if (car.vx <= 0) {
        car.vx = 0;
        car.isMoving = false;
    }
    
    saveStats();
}

function draw(){
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 + 15);
    ctx.lineTo(canvas.width, canvas.height / 2 + 15);
    ctx.stroke();
    ctx.setLineDash([]);

    if (stats.stoppingDistance > 0) {
        const expectedStopX = 50 + (stats.stoppingDistance * physics.pixelScale);
        if (expectedStopX < canvas.width) {
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

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(car.x, car.y - car.height / 2, car.width, car.height);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(car.x, car.y - car.height / 2, car.width, car.height);
    
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(car.x + 15, car.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(car.x + 45, car.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    let yPosition = 30;

    if (stats.showVi) {
        ctx.fillText(`Vi: ${stats.vi.toFixed(2)} m/s`, 20, yPosition);
        yPosition += 25;
    }

    if (stats.showVf) {
        ctx.fillText(`Vf: ${stats.vf.toFixed(2)} m/s`, 20, yPosition);
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
}

//actual animation
function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}

const velocityInput = document.getElementById('velocity');
const decelerationInput = document.getElementById('deceleration');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const velocityVal = document.getElementById('velocityVal');
const decelerationVal = document.getElementById('decelerationVal');

const viToggle = document.getElementById('toggle-vi');
const vfToggle = document.getElementById('toggle-vf');
const decelerationToggle = document.getElementById('toggle-deceleration');
const timeToggle = document.getElementById('toggle-time');
const distanceToggle = document.getElementById('toggle-distance');
const stoppingDistanceToggle = document.getElementById('toggle-stopping-distance');

if (velocityInput) {
    velocityInput.addEventListener('input', (e) => {
        stats.vi = parseFloat(e.target.value);
        velocityVal.textContent = stats.vi;
        reset();
    });
}

if (decelerationInput) {
    decelerationInput.addEventListener('input', (e) => {
        stats.deceleration = parseFloat(e.target.value);
        physics.deceleration = stats.deceleration;
        decelerationVal.textContent = stats.deceleration;
        reset();
    });
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        reset();
        car.isMoving = true;
        console.log(`Car braking from ${stats.vi} m/s with deceleration ${stats.deceleration} m/s²`);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        reset();
    });
}

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

function saveStats(){
    localStorage.setItem('carBrakingStats', JSON.stringify(stats));
}

function loadStats(){
    const saved = localStorage.getItem('carBrakingStats');
    if(saved){
        stats = JSON.parse(saved);
        stats.deceleration = physics.deceleration;
    }
}

loadStats();
reset();
animate();