// ============================================
// PHYSICSLAB SIMULATIONS - WITH PNG IMAGES + STATS
// ============================================

// SIMULATION 1: FREE FALL
(function() {
    const canvas = document.getElementById('canvas-dropping');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.closest('.section');
    
    let ballY = 50;
    let ballVY = 0;
    const ballRadius = 25;
    const gravity = 0.5;
    let isRunning = false;
    let time = 0;
    let ballImage = new Image();
    let stats = { vi: 0, vf: 0, time: 0, distance: 0 };
    let toggles = { vi: true, vf: true, time: true, distance: true, height: true };
    
    ballImage.onload = () => console.log('✅ Ball image loaded for free fall');
    ballImage.onerror = () => console.error('❌ Ball image failed to load:', ballImage.src);
    ballImage.src = 'assets/ball.png';

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function draw() {
        ctx.fillStyle = '#2b5b9b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const groundY = canvas.height - 30;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.stroke();

        if (ballImage.complete && ballImage.naturalHeight !== 0) {
            ctx.drawImage(ballImage, canvas.width / 2 - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        let yPos = 30;
        if (toggles.vi) {
            ctx.fillText(`Vi: ${stats.vi.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.vf) {
            ctx.fillText(`Vf: ${stats.vf.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.time) {
            ctx.fillText(`Time: ${stats.time.toFixed(2)} s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.distance) {
            ctx.fillText(`Distance: ${Math.max(0, stats.distance).toFixed(2)} m`, 20, yPos);
            yPos += 25;
        }
        if (toggles.height) {
            const height = (groundY - ballY) / 100;
            ctx.fillText(`Height: ${Math.max(0, height).toFixed(2)} m`, 20, yPos);
        }
    }

    function update() {
        if (!isRunning) return;
        const gravityPixelsPerFrame = 0.5;
        ballVY += gravityPixelsPerFrame;
        ballY += ballVY;
        time += 1/60;

        stats.vf = (ballVY / 100) * 60;
        stats.time = time;
        stats.distance = (ballY - 50) / 100;

        const groundY = canvas.height - 30 - ballRadius;
        if (ballY >= groundY) {
            ballY = groundY;
            ballVY = 0;
            isRunning = false;
        }
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    setTimeout(() => {
        const startBtn = section.querySelector('#start');
        const resetBtn = section.querySelector('#reset');

        if (startBtn) startBtn.addEventListener('click', () => {
            ballY = 50;
            ballVY = 0;
            time = 0;
            isRunning = true;
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            ballY = 50;
            ballVY = 0;
            time = 0;
            isRunning = false;
        });

        ['toggle-vi', 'toggle-vf', 'toggle-time', 'toggle-distance', 'toggle-height'].forEach((id, idx) => {
            const toggle = section.querySelector('#' + id);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const keys = ['vi', 'vf', 'time', 'distance', 'height'];
                    toggles[keys[idx]] = e.target.checked;
                });
            }
        });
    }, 500);

    console.log('✅ Free fall sim loaded');
})();

// SIMULATION 2: THROW UP
(function() {
    const canvas = document.getElementById('canvas-throwing');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.closest('.section');
    
    const getGroundY = () => canvas.height - 50;
    let ballY = getGroundY();
    let ballVY = 0;
    const ballRadius = 25;
    const gravity = 0.15;
    const pixelsPerMeter = 30;
    let isRunning = false;
    let time = 0;
    let initialVel = 10;
    let stats = { vi: 0, vf: 0, time: 0, maxHeight: 0, currentHeight: 0 };
    let toggles = { vi: true, vf: true, time: true, maxHeight: true, height: true };
    let ballImage = new Image();
    
    ballImage.onload = () => console.log('✅ Ball image loaded for throw up');
    ballImage.onerror = () => console.error('❌ Ball image failed to load:', ballImage.src);
    ballImage.src = 'assets/ball.png';

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        ballY = getGroundY();
    }

    function draw() {
        ctx.fillStyle = '#2b5b9b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const groundY = getGroundY();
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.stroke();

        if (ballImage.complete && ballImage.naturalHeight !== 0) {
            ctx.drawImage(ballImage, canvas.width / 2 - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        let yPos = 30;
        if (toggles.vi) {
            ctx.fillText(`Vi: ${stats.vi.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.vf) {
            ctx.fillText(`Vf: ${stats.vf.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.time) {
            ctx.fillText(`Time: ${stats.time.toFixed(2)} s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.maxHeight) {
            ctx.fillText(`Max Height: ${stats.maxHeight.toFixed(2)} m`, 20, yPos);
            yPos += 25;
        }
        if (toggles.height) {
            ctx.fillText(`Current Height: ${stats.currentHeight.toFixed(2)} m`, 20, yPos);
        }
    }

    function update() {
        if (!isRunning) return;
        ballVY += gravity;
        ballY += ballVY;
        time += 1/60;

        const groundY = getGroundY();
        const currentHeight = (groundY - ballY) / pixelsPerMeter;
        stats.currentHeight = Math.max(0, currentHeight);
        if (stats.currentHeight > stats.maxHeight) {
            stats.maxHeight = stats.currentHeight;
        }
        stats.vf = (ballVY / pixelsPerMeter) * 60;
        stats.time = time;

        if (ballY >= groundY) {
            ballY = groundY;
            ballVY = 0;
            isRunning = false;
        }
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    setTimeout(() => {
        const startBtn = section.querySelector('#start');
        const resetBtn = section.querySelector('#reset');
        const velInput = section.querySelector('#velocity');

        if (startBtn) startBtn.addEventListener('click', () => {
            ballY = getGroundY();
            ballVY = -initialVel * 0.3;
            time = 0;
            stats.maxHeight = 0;
            stats.currentHeight = 0;
            stats.vi = initialVel;
            isRunning = true;
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            ballY = getGroundY();
            ballVY = 0;
            time = 0;
            stats = { vi: 0, vf: 0, time: 0, maxHeight: 0, currentHeight: 0 };
            isRunning = false;
        });

        if (velInput) velInput.addEventListener('input', (e) => {
            initialVel = parseFloat(e.target.value);
        });

        ['toggle-vi', 'toggle-vf', 'toggle-time', 'toggle-max-height', 'toggle-height-now'].forEach((id, idx) => {
            const toggle = section.querySelector('#' + id);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const keys = ['vi', 'vf', 'time', 'maxHeight', 'height'];
                    toggles[keys[idx]] = e.target.checked;
                });
            }
        });
    }, 500);

    console.log('✅ Throw up sim loaded');
})();

// SIMULATION 3: CAR SPEEDING
(function() {
    const canvas = document.getElementById('canvas-speeding');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.closest('.section');
    
    let carX = 20;
    let carVX = 0;
    let accel = 2;
    let isRunning = false;
    let time = 0;
    let stats = { vi: 0, vf: 0, accel: 0, time: 0, distance: 0 };
    let toggles = { vi: true, vf: true, accel: true, time: true, distance: true };
    let carImage = new Image();
    
    carImage.onload = () => console.log('✅ Car image loaded for speeding');
    carImage.onerror = () => console.error('❌ Car image failed to load:', carImage.src);
    carImage.src = 'assets/car.png';

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function draw() {
        const roadY = canvas.height / 2;
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

        if (carImage.complete && carImage.naturalHeight !== 0) {
            ctx.drawImage(carImage, carX, roadY - 35, 70, 70);
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(carX, roadY - 12, 50, 25);
            ctx.fillStyle = '#333';
            ctx.fillRect(carX + 8, roadY - 8, 8, 8);
            ctx.fillRect(carX + 32, roadY - 8, 8, 8);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        let yPos = 30;
        if (toggles.vi) {
            ctx.fillText(`Vi: ${stats.vi.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.vf) {
            ctx.fillText(`Vf: ${stats.vf.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.accel) {
            ctx.fillText(`Accel: ${stats.accel.toFixed(2)} m/s²`, 20, yPos);
            yPos += 25;
        }
        if (toggles.time) {
            ctx.fillText(`Time: ${stats.time.toFixed(2)} s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.distance) {
            ctx.fillText(`Distance: ${stats.distance.toFixed(2)} m`, 20, yPos);
        }
    }

    function update() {
        if (!isRunning) return;
        carVX += accel / 60;
        carX += carVX;
        time += 1/60;

        stats.vf = carVX;
        stats.time = time;
        stats.distance = carX - 20;

        if (carX > canvas.width - 80) {
            isRunning = false;
        }
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    setTimeout(() => {
        const startBtn = section.querySelector('#start');
        const resetBtn = section.querySelector('#reset');
        const accelInput = section.querySelector('#acceleration');

        if (startBtn) startBtn.addEventListener('click', () => {
            carX = 20;
            carVX = 0;
            time = 0;
            stats.accel = accel;
            isRunning = true;
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            carX = 20;
            carVX = 0;
            time = 0;
            stats = { vi: 0, vf: 0, accel: 0, time: 0, distance: 0 };
            isRunning = false;
        });

        if (accelInput) accelInput.addEventListener('input', (e) => {
            accel = parseFloat(e.target.value);
            stats.accel = accel;
        });

        ['toggle-vi', 'toggle-vf', 'toggle-acceleration', 'toggle-time', 'toggle-distance'].forEach((id, idx) => {
            const toggle = section.querySelector('#' + id);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const keys = ['vi', 'vf', 'accel', 'time', 'distance'];
                    toggles[keys[idx]] = e.target.checked;
                });
            }
        });
    }, 500);

    console.log('✅ Car speeding sim loaded');
})();

// SIMULATION 4: CAR BRAKING (FIXED - SLOWER)
(function() {
    const canvas = document.getElementById('canvas-braking');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.closest('.section');
    
    let carX = 20;
    let carVX = 0;
    let initialVel = 20;
    let decel = 2;
    let isRunning = false;
    let time = 0;
    let stopDist = 0;
    const pixelsPerMeter = 0.5;  // Much smaller - makes car slower
    let stats = { vi: 0, vf: 0, decel: 0, time: 0, distance: 0, stopDist: 0 };
    let toggles = { vi: true, vf: true, decel: true, time: true, distance: true, stopDist: true };
    let carImage = new Image();
    
    carImage.onload = () => console.log('✅ Car image loaded for braking');
    carImage.onerror = () => console.error('❌ Car image failed to load:', carImage.src);
    carImage.src = 'assets/car.png';

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function draw() {
        const roadY = canvas.height / 2;
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

        // Show stopping distance marker
        if (stopDist > 0) {
            const stopMarker = 20 + (stopDist * pixelsPerMeter);
            if (stopMarker < canvas.width - 20) {
                ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.moveTo(stopMarker, roadY - 30);
                ctx.lineTo(stopMarker, roadY + 30);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw car - bounded by canvas width
        const maxCarX = Math.min(carX, canvas.width - 80);
        if (carImage.complete && carImage.naturalHeight !== 0) {
            ctx.drawImage(carImage, maxCarX, roadY - 35, 70, 70);
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(maxCarX, roadY - 12, 50, 25);
            ctx.fillStyle = '#333';
            ctx.fillRect(maxCarX + 8, roadY - 8, 8, 8);
            ctx.fillRect(maxCarX + 32, roadY - 8, 8, 8);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        let yPos = 30;
        if (toggles.vi) {
            ctx.fillText(`Vi: ${stats.vi.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.vf) {
            ctx.fillText(`Vf: ${stats.vf.toFixed(2)} m/s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.decel) {
            ctx.fillText(`Decel: ${stats.decel.toFixed(2)} m/s²`, 20, yPos);
            yPos += 25;
        }
        if (toggles.time) {
            ctx.fillText(`Time: ${stats.time.toFixed(2)} s`, 20, yPos);
            yPos += 25;
        }
        if (toggles.distance) {
            ctx.fillText(`Distance: ${stats.distance.toFixed(2)} m`, 20, yPos);
            yPos += 25;
        }
        if (toggles.stopDist) {
            ctx.fillText(`Stop Distance: ${stats.stopDist.toFixed(1)} m`, 20, yPos);
        }
    }

    function update() {
        if (!isRunning) return;
        carVX -= decel / 60;
        if (carVX <= 0) {
            carVX = 0;
            isRunning = false;
        }
        carX += carVX * pixelsPerMeter;
        
        // Clamp car to screen width
        if (carX > canvas.width - 80) {
            carX = canvas.width - 80;
            carVX = 0;
            isRunning = false;
        }
        
        time += 1/60;

        stats.vf = Math.max(0, carVX);
        stats.time = time;
        stats.distance = carX - 20;
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    setTimeout(() => {
        const startBtn = section.querySelector('#start');
        const resetBtn = section.querySelector('#reset');
        const velInput = section.querySelector('#velocity');
        const decelInput = section.querySelector('#deceleration');

        if (startBtn) startBtn.addEventListener('click', () => {
            carX = 20;
            carVX = initialVel;
            time = 0;
            stats.vi = initialVel;
            stats.decel = decel;
            stopDist = (initialVel * initialVel) / (2 * decel);
            stats.stopDist = stopDist;
            isRunning = true;
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            carX = 20;
            carVX = 0;
            time = 0;
            stopDist = (initialVel * initialVel) / (2 * decel);
            stats = { vi: 0, vf: 0, decel: 0, time: 0, distance: 0, stopDist: stopDist };
            isRunning = false;
        });

        if (velInput) velInput.addEventListener('input', (e) => {
            initialVel = parseFloat(e.target.value);
            stopDist = (initialVel * initialVel) / (2 * decel);
        });

        if (decelInput) decelInput.addEventListener('input', (e) => {
            decel = parseFloat(e.target.value);
            stats.decel = decel;
            stopDist = (initialVel * initialVel) / (2 * decel);
        });

        ['toggle-vi', 'toggle-vf', 'toggle-deceleration', 'toggle-time', 'toggle-distance', 'toggle-stop-dist'].forEach((id, idx) => {
            const toggle = section.querySelector('#' + id);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const keys = ['vi', 'vf', 'decel', 'time', 'distance', 'stopDist'];
                    toggles[keys[idx]] = e.target.checked;
                });
            }
        });
    }, 500);

    console.log('✅ Car braking sim loaded');
})();

console.log('✅✅✅ All simulations loaded');