console.log('freefalling-sim.js loaded!');

function initSimDropping() {
    console.log('Initializing dropping sim...');
    
    const canvas = document.getElementById('canvas-dropping');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    let ball = {
        x: canvas.width / 2,
        y: 100,
        vx: 0,
        vy: 0,
        radius: 15, 
        isMoving: false
    }

    let physics = {
        gravity: 9.81,
        pixelScale: 100,
        startHeight: 100,
        timeStep: 0.016
    };

    let stats = {
        vi: 0,
        vf: 0,
        timeElapsed: 0,
        distanceFallen: 0,
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
        ball.isMoving = false;
        stats.vi = 0;
        stats.vf = 0;
        stats.timeElapsed = 0;
        stats.distanceFallen = 0;
    }

    function updatePhysics(){
        if(!ball.isMoving) return;

        const gravityPixelsPerFrame = (physics.gravity * physics.pixelScale) / (60 * 60);
        ball.vy += gravityPixelsPerFrame;
        ball.y += ball.vy;
        
        const velocityMS = (ball.vy / physics.pixelScale) * 60;
        stats.vf = velocityMS;
        stats.timeElapsed += (1/60);
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

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const groundLevel = canvas.height - ball.radius;
        ctx.moveTo(0, groundLevel);
        ctx.lineTo(canvas.width, groundLevel);
        ctx.stroke();

        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x, ball.y + ball.vy*2);
        ctx.stroke();

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

        if (stats.showTime) {
            ctx.fillText(`Time: ${stats.timeElapsed.toFixed(2)} s`, 20, yPosition);
            yPosition += 25;
        }

        if (stats.showDistance) {
            ctx.fillText(`Distance: ${Math.max(0, stats.distanceFallen).toFixed(2)} m`, 20, yPosition);
            yPosition += 25;
        }

        if (stats.showHeight) {
            const heightAboveGround = (groundLevel - ball.y) / physics.pixelScale;
            ctx.fillText(`Height: ${Math.max(0, heightAboveGround).toFixed(2)} m`, 20, yPosition);
            yPosition += 25;
        }
    }

    function animate() {
        updatePhysics();
        draw();
        requestAnimationFrame(animate);
    }

    const heightInput = document.getElementById('height');
    const startBtn = document.getElementById('start');
    const resetBtn = document.getElementById('reset');
    const heightVal = document.getElementById('heightVal');

    const viToggle = document.getElementById('toggle-vi');
    const vfToggle = document.getElementById('toggle-vf');
    const timeToggle = document.getElementById('toggle-time');
    const distanceToggle = document.getElementById('toggle-distance');
    const heightToggle = document.getElementById('toggle-height');
 
    if (heightInput) {
        heightInput.addEventListener('input', (e) => {
            physics.startHeight = parseFloat(e.target.value);
            heightVal.textContent = physics.startHeight;
            reset();
        });
    }
 
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            reset();
            stats.vi = 0;
            ball.isMoving = true;
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
}