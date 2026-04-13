// DEBUG: Check if script is loading
console.log('car-speeding-sim.js loaded!');

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
    acceleration: 2.0,
    pixelScale: 100,
    timeStep: 0.016
};

let stats = {
    vi: 0,
    vf: 0,
    acceleration: 2.0,
    timeElapsed: 0,
    distanceTraveled: 0,
    showVi: true,
    showVf: true,
    showAcceleration: true,
    showTime: true,
    showDistance: true
};

function reset() {
    car.x = 50;
    car.vx = 0;
    car.y = canvas.height / 2;
    car.isMoving = false;
    stats.vi = 0;
    stats.vf = 0;
    stats.timeElapsed = 0;
    stats.distanceTraveled = 0;
    console.log('Car reset to:', car.x, car.y);
}

function updatePhysics(){
    if(!car.isMoving) return;

    const accelerationPixelsPerFrame = (stats.acceleration * physics.pixelScale) / (60 * 60);
    car.vx += accelerationPixelsPerFrame;
    car.x += car.vx;
    
    const velocityMS = (car.vx / physics.pixelScale) * 60;
    stats.vf = velocityMS;
    stats.timeElapsed += (1/60);
    stats.distanceTraveled = (car.x - 50) / physics.pixelScale;
    
    if (car.x > canvas.width - car.width) {
        car.x = canvas.width - car.width;
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
}

//actual animation
function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}

const accelerationInput = document.getElementById('acceleration');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const accelerationVal = document.getElementById('accelerationVal');

const viToggle = document.getElementById('toggle-vi');
const vfToggle = document.getElementById('toggle-vf');
const accelerationToggle = document.getElementById('toggle-acceleration');
const timeToggle = document.getElementById('toggle-time');
const distanceToggle = document.getElementById('toggle-distance');

if (accelerationInput) {
    accelerationInput.addEventListener('input', (e) => {
        stats.acceleration = parseFloat(e.target.value);
        physics.acceleration = stats.acceleration;
        accelerationVal.textContent = stats.acceleration;
        reset();
    });
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        reset();
        car.isMoving = true;
        console.log(`Car accelerating at ${stats.acceleration} m/s²`);
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

function saveStats(){
    localStorage.setItem('carSpeedingStats', JSON.stringify(stats));
}

function loadStats(){
    const saved = localStorage.getItem('carSpeedingStats');
    if(saved){
        stats = JSON.parse(saved);
        stats.acceleration = physics.acceleration;
    }
}

loadStats();
reset();
animate();