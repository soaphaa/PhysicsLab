//blank rectangle
const canvas = document.getElementById('physicsCanvas');
const ctx = canvas.getContext('2d'); //get the canvas (paintbrush, has methods like arc, fillRect)

//setting values
let ball = {
    x:0,
    y:0,
    vx:0, //HORIZONTAL velocity (0 cuz unused)
    vy:0, //VERTICAL velocity (base value, determines vi and vf)
    radius:15, 
    isMoving:true
}

let physics = {
    gravity: 0.5, //basically how much vy increases each frame
    startHeight: 100,
    timeStep: 0.016 //real time passing each frame (60fps)
};

function reset() {
    //resets position
    ball.x = canvas.width / 2;
    ball.y = physics.startHeight;
    ball.vy = 0; //vi=0!!
    ball.isMoving = true;
}

function updatePhysics(){
    if(!ball.isMoving) return;

    ball.vy += physics.gravity * physics.timeStep; //(v=at)
    ball.y += ball.vy * physics.timeStep; //(d=vt)

    const groundLevel = canvas.height - ball.radius;
    if (ball.y >= groundLevel){
        ball.y = groundLevel;
        ball.vy =0; //when it reaches ground, no more velocity (after Vf ofc)
        ball.isMoving = false;
    }
}

function draw(){
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height); //fill entire canvas with this colour

    ctx.strokeStyle = '#00ff00'; 
    ctx.lineWidth = 3;  // Make the line 3 pixels thick
    ctx.beginPath();  // Start drawing a path/line
    const groundLevel = canvas.height - ball.radius; //rewrite calculation
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(canvas.width, groundLevel);
    ctx.stroke();

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath(); //method to begin drawing the circle movement
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2); //get the ball data
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(ball.x, ball.y + ball.vy*2);
    ctx.stroke();

    ctx.fillText(
        'Velocity: ${ball.vy.toFixed(2)} px/frame',
        20,
        30
    );

    const heightAboveGround = groundLevel - ball.y;
    ctx.fillText(
        'Height: ${Math.max(0, heightAboveGround).toFixed(0)} px',
        20,
        30
    );
}



//actual animation
function animate(){
    updatePhysics(); //calculate new position constnatly
    draw();
    requestAnimationFrame(animate);
}

//INPUTTING ALL THE HTML ELEMENTS (USER INPUT)
const gravityInput = document.getElementById('gravity');
const heightInput = document.getElementById('height');
const sizeInput = document.getElementById('size');
const reset = document.getElementById('reset');

const gravityVal = document.getElementById('gravityVal');
const heightVal = document.getElementById('heightVal');
const sizeVal = document.getElementById('sizeVal');
 


//initialize ball position at the start
reset();

//runs forever
animate();
