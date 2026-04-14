console.log('throwing-up-sim.js loaded!');

function initSimThrowing() {
    const canvas = document.getElementById('canvas-throwing');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const groundLevel = canvas.height - 50;

    let ball = {
        x: canvas.width / 2,
        y: groundLevel,
        vy: 0,
        radius: 15, 
        isMoving: false
    }

    let physics = {
        gravity: 9.81,
        pixelScale: 100,
        initialVelocity: 0
    };

    let stats = {
        vi: 0,
        vf: 0,
        timeElapsed: 0,
        maxHeight: 0,
        currentHeight: 0,
        showVi: true,
        showVf: true,
        showTime: true,
        showMaxHeight: true,
        showHeight: true
    };

    function reset() {
        ball.x = canvas.width / 2;
        ball.y = groundLevel;
        ball.vy = 0;
        ball.isMoving = false;
        stats.vi = 0;
        stats.vf = 0;
        stats.timeElapsed = 0;
        stats.maxHeight = 0;
        stats.currentHeight = 0;
    }

    function updatePhysics(){
        if(!ball.isMoving) return;

        const gravityPixelsPerFrame = (physics.gravity * physics.pixelScale) / (60 * 60);
        ball.vy += gravityPixelsPerFrame;
        ball.y += ball.vy;
        
        const velocityMS = (ball.vy / physics.pixelScale) * 60;
        stats.vf = velocityMS;
        stats.timeElapsed += (1/60);
        
        const heightAboveGround = (groundLevel - ball.y) / physics.pixelScale;
        stats.currentHeight = Math.max(0, heightAboveGround);
        
        if(stats.currentHeight > stats.maxHeight) {
            stats.maxHeight = stats.currentHeight;
        }
        
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
        ctx.lineWidth = 2;
        ctx.beginPath();
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

        if (stats.showMaxHeight) {
            ctx.fillText(`Max Height: ${stats.maxHeight.toFixed(2)} m`, 20, yPosition);
            yPosition += 25;
        }

        if (stats.showHeight) {
            ctx.fillText(`Current Height: ${stats.currentHeight.toFixed(2)} m`, 20, yPosition);
            yPosition += 25;
        }
    }

    function animate() {
        updatePhysics();
        draw();
        requestAnimationFrame(animate);
    }

    const velocityInput = document.getElementById('velocity');
    const startBtn = document.getElementById('start');
    const resetBtn = document.getElementById('reset');
    const velocityVal = document.getElementById('velocityVal');

    const viToggle = document.getElementById('toggle-vi');
    const vfToggle = document.getElementById('toggle-vf');
    const timeToggle = document.getElementById('toggle-time');
    const maxHeightToggle = document.getElementById('toggle-max-height');
    const heightToggle = document.getElementById('toggle-height-now');
 
    if (velocityInput) {
        velocityInput.addEventListener('input', (e) => {
            physics.initialVelocity = parseFloat(e.target.value);
            velocityVal.textContent = physics.initialVelocity;
            reset();
        });
    }
 
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            reset();
            stats.vi = physics.initialVelocity;
            ball.vy = -(physics.initialVelocity * physics.pixelScale) / 60;
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

    if (maxHeightToggle) {
        maxHeightToggle.addEventListener('change', (e) => {
            stats.showMaxHeight = e.target.checked;
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