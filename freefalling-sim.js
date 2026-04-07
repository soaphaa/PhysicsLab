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
    pixelScale: 200,
    startHeight: 100,
    timeStep: 0.016
};

function reset() {
    ball.x = canvas.width / 2;
    ball.y = physics.startHeight;
    ball.vy = 0;
    ball.isMoving = false;
    console.log('Ball reset to:', ball.x, ball.y);
}

function updatePhysics(){
    if(!ball.isMoving) return;

    const gravityPixelsPerFrame = (physics.gravity * physics.pixelScale) / (60 * 60);
    ball.vy += gravityPixelsPerFrame;  // Velocity increases each frame
    ball.y += ball.vy;  // Position changes by velocity

    const groundLevel = canvas.height - ball.radius;
    if (ball.y >= groundLevel){
        ball.y = groundLevel;
        ball.vy =0;
        ball.isMoving = false;
    }
}

function draw(){
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    ctx.fillText(
        `Velocity: ${ball.vy.toFixed(2)} px/frame`,
        20,
        30
    );

    const heightAboveGround = groundLevel - ball.y;
    ctx.fillText(
        `Height: ${Math.max(0, heightAboveGround).toFixed(0)} px`,
        20,
        55
    );
}

//actual animation
function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}
 

function reset() {
    ball.x = canvas.width / 2;
    ball.y = physics.startHeight;
    ball.vy = 0;
    ball.isMoving = false;  // Ball stays still until Start is clicked
    draw();  // Redraw immediately so we see the ball at top
}
 




const heightInput = document.getElementById('height');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
 
const gravityVal = document.getElementById('gravityVal');
const heightVal = document.getElementById('heightVal');
 
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
        ball.isMoving = true;  // NOW the ball falls
    });
}
 
// Reset button - puts ball back at top
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        reset();
    });
}
 

reset();
animate();