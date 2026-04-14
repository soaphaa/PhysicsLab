console.log('car-speeding-sim.js loaded!');

function initSimSpeeding() {
    const canvas = document.getElementById('canvas-speeding');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const roadY = canvas.height / 2;

    let car = {
        x: 20,
        vx: 0,
        isMoving: false
    }

    let physics = {
        accelValue: 0
    };

    let stats = {
        vi: 0,
        vf: 0,
        acceleration: 0,
        timeElapsed: 0,
        distance: 0,
        showVi: true,
        showVf: true,
        showAccel: true,
        showTime: true,
        showDistance: true
    };

    function reset() {
        car.x = 20;
        car.vx = 0;
        car.isMoving = false;
        stats.vi = 0;
        stats.vf = 0;
        stats.acceleration = 0;
        stats.timeElapsed = 0;
        stats.distance = 0;
    }

    function updatePhysics(){
        if(!car.isMoving) return;

        car.vx += (physics.accelValue / 60);
        car.x += car.vx;
        
        stats.vf = car.vx;
        stats.timeElapsed += (1/60);
        stats.distance = car.x - 20;
        
        if (car.x > canvas.width - 80){
            car.isMoving = false;
        }
    }

    function draw(){
        ctx.fillStyle = '#2b5b9b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 10]);
        ctx.beginPath();
        ctx.moveTo(0, roadY + 12);
        ctx.lineTo(canvas.width, roadY + 12);
        ctx.stroke();
        ctx.setLineDash([]);

        const carW = 50;
        const carH = 25;
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(car.x, roadY - carH / 2, carW, carH);
        ctx.fillStyle = '#333';
        ctx.fillRect(car.x + 8, roadY - 8, 8, 8);
        ctx.fillRect(car.x + 32, roadY - 8, 8, 8);

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

        if (stats.showAccel) {
            ctx.fillText(`Acceleration: ${stats.acceleration.toFixed(2)} m/s²`, 20, yPosition);
            yPosition += 25;
        }

        if (stats.showTime) {
            ctx.fillText(`Time: ${stats.timeElapsed.toFixed(2)} s`, 20, yPosition);
            yPosition += 25;
        }

        if (stats.showDistance) {
            ctx.fillText(`Distance: ${stats.distance.toFixed(2)} m`, 20, yPosition);
            yPosition += 25;
        }
    }

    function animate() {
        updatePhysics();
        draw();
        requestAnimationFrame(animate);
    }

    const accelInput = document.getElementById('acceleration');
    const startBtn = document.getElementById('start');
    const resetBtn = document.getElementById('reset');
    const accelVal = document.getElementById('accelerationVal');

    const viToggle = document.getElementById('toggle-vi');
    const vfToggle = document.getElementById('toggle-vf');
    const accelToggle = document.getElementById('toggle-acceleration');
    const timeToggle = document.getElementById('toggle-time');
    const distanceToggle = document.getElementById('toggle-distance');
 
    if (accelInput) {
        accelInput.addEventListener('input', (e) => {
            physics.accelValue = parseFloat(e.target.value);
            accelVal.textContent = physics.accelValue;
            reset();
        });
    }
 
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            reset();
            stats.vi = 0;
            stats.acceleration = physics.accelValue;
            car.isMoving = true;
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

    if (accelToggle) {
        accelToggle.addEventListener('change', (e) => {
            stats.showAccel = e.target.checked;
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
 
    reset();
    animate();
}