// ============================================
// MINI SIMULATIONS FOR LESSONS
// ============================================
// These are lightweight, focused simulations
// embedded directly in lesson pages

// Global state for each simulation
const simState = {
    drop1: { height: 50, time: 0, isRunning: false, canvas: null, ctx: null, ballY: 0 },
    throw2: { velocity: 20, time: 0, isRunning: false, canvas: null, ctx: null, ballY: 0, ballVelY: 0, maxH: 0 },
    accel3: { accel: 3, time: 0, isRunning: false, canvas: null, ctx: null, carX: 0, carVel: 0 },
    brake4: { speed: 30, decel: 5, time: 0, isRunning: false, canvas: null, ctx: null, carX: 0, carVel: 0, stopDist: 0 }
};

// ============================================
// LESSON 1: FREE FALL SIMULATION
// ============================================

function initDropSim1() {
    const canvas = document.getElementById('sim-drop-1');
    if (!canvas) return;
    
    simState.drop1.canvas = canvas;
    simState.drop1.ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawDropSim1();
    animateDropSim1();
}

function updateDropSim1() {
    const input = document.getElementById('height-drop-1');
    simState.drop1.height = parseFloat(input.value);
    document.getElementById('height-display-1').textContent = simState.drop1.height;
    dropReset1();
}

function dropStart1() {
    if (simState.drop1.isRunning) return;
    simState.drop1.isRunning = true;
}

function dropReset1() {
    simState.drop1.time = 0;
    simState.drop1.isRunning = false;
    simState.drop1.ballY = 20;
    document.getElementById('time-1').textContent = '0.0';
    document.getElementById('vel-1').textContent = '0.0';
}

function drawDropSim1() {
    const { canvas, ctx, height, ballY, time } = simState.drop1;
    const g = 9.81;
    
    // Clear
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Scale: 1m = some pixels
    const pixelsPerMeter = (canvas.height - 40) / height;
    const groundLevel = canvas.height - 20;
    const startY = 20;
    const ballRadius = 8;
    
    // Current position
    const distance = 0.5 * g * time * time;
    const currentY = startY + distance * pixelsPerMeter;
    
    // Ground line
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(canvas.width, groundLevel);
    ctx.stroke();
    
    // Height marker
    ctx.strokeStyle = 'rgba(0, 204, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, startY);
    ctx.lineTo(20, groundLevel);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${height}m`, 15, startY + 5);
    
    // Ball
    if (currentY < groundLevel) {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, currentY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Ball at ground
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, groundLevel, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animateDropSim1() {
    if (simState.drop1.isRunning) {
        simState.drop1.time += 0.016; // ~60 FPS
        
        // Calculate distance
        const g = 9.81;
        const distance = 0.5 * g * simState.drop1.time * simState.drop1.time;
        
        // Check if landed
        if (distance >= simState.drop1.height) {
            simState.drop1.isRunning = false;
            simState.drop1.time = Math.sqrt(2 * simState.drop1.height / g);
        }
        
        // Update displays
        document.getElementById('time-1').textContent = simState.drop1.time.toFixed(2);
        const vel = g * simState.drop1.time;
        document.getElementById('vel-1').textContent = vel.toFixed(2);
    }
    
    drawDropSim1();
    requestAnimationFrame(animateDropSim1);
}

// ============================================
// LESSON 2: THROWING UP SIMULATION
// ============================================

function initThrowSim2() {
    const canvas = document.getElementById('sim-throw-2');
    if (!canvas) return;
    
    simState.throw2.canvas = canvas;
    simState.throw2.ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawThrowSim2();
    animateThrowSim2();
}

function updateThrowSim2() {
    const input = document.getElementById('velocity-throw-2');
    simState.throw2.velocity = parseFloat(input.value);
    document.getElementById('velocity-display-2').textContent = simState.throw2.velocity;
    throwReset2();
}

function throwStart2() {
    if (simState.throw2.isRunning) return;
    simState.throw2.time = 0;
    simState.throw2.isRunning = true;
    simState.throw2.maxH = 0;
}

function throwReset2() {
    simState.throw2.time = 0;
    simState.throw2.isRunning = false;
    simState.throw2.ballY = 0;
    simState.throw2.ballVelY = 0;
    simState.throw2.maxH = 0;
    document.getElementById('time-2').textContent = '0.0';
    document.getElementById('height-2').textContent = '0.0';
    document.getElementById('max-height-2').textContent = '0.0';
}

function drawThrowSim2() {
    const { canvas, ctx, velocity, time, ballY, maxH } = simState.throw2;
    const g = 9.81;
    
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const pixelsPerMeter = 40; // pixels per meter
    const groundLevel = canvas.height - 30;
    const ballRadius = 8;
    
    // Position
    const height = velocity * time - 0.5 * g * time * time;
    const displayY = groundLevel - height * pixelsPerMeter;
    
    // Ground
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(canvas.width, groundLevel);
    ctx.stroke();
    
    // Max height line
    if (maxH > 0) {
        const maxY = groundLevel - maxH * pixelsPerMeter;
        ctx.strokeStyle = 'rgba(0, 204, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, maxY);
        ctx.lineTo(canvas.width, maxY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#a0a0a0';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Peak: ${maxH.toFixed(1)}m`, canvas.width - 10, maxY - 5);
    }
    
    // Ball
    if (height > 0) {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, displayY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, groundLevel, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animateThrowSim2() {
    if (simState.throw2.isRunning) {
        const g = 9.81;
        simState.throw2.time += 0.016;
        
        const height = simState.throw2.velocity * simState.throw2.time - 0.5 * g * simState.throw2.time * simState.throw2.time;
        
        // Track max height
        if (height > simState.throw2.maxH) {
            simState.throw2.maxH = height;
        }
        
        // Stop at ground
        if (height <= 0) {
            simState.throw2.isRunning = false;
        }
        
        document.getElementById('time-2').textContent = simState.throw2.time.toFixed(2);
        document.getElementById('height-2').textContent = Math.max(0, height).toFixed(2);
        document.getElementById('max-height-2').textContent = simState.throw2.maxH.toFixed(2);
    }
    
    drawThrowSim2();
    requestAnimationFrame(animateThrowSim2);
}

// ============================================
// LESSON 3: ACCELERATION SIMULATION
// ============================================

function initAccelSim3() {
    const canvas = document.getElementById('sim-accel-3');
    if (!canvas) return;
    
    simState.accel3.canvas = canvas;
    simState.accel3.ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawAccelSim3();
    animateAccelSim3();
}

function updateAccelSim3() {
    const input = document.getElementById('accel-accel-3');
    simState.accel3.accel = parseFloat(input.value);
    document.getElementById('accel-display-3').textContent = simState.accel3.accel;
    accelReset3();
}

function accelStart3() {
    if (simState.accel3.isRunning) return;
    simState.accel3.time = 0;
    simState.accel3.isRunning = true;
}

function accelReset3() {
    simState.accel3.time = 0;
    simState.accel3.isRunning = false;
    simState.accel3.carX = 20;
    simState.accel3.carVel = 0;
    document.getElementById('time-3').textContent = '0.0';
    document.getElementById('vel-3').textContent = '0.0';
    document.getElementById('dist-3').textContent = '0.0';
}

function drawAccelSim3() {
    const { canvas, ctx, carX, carVel, accel } = simState.accel3;
    
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const roadY = canvas.height / 2;
    const carW = 50;
    const carH = 25;
    
    // Road
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, roadY + 12);
    ctx.lineTo(canvas.width, roadY + 12);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Car
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(carX, roadY - carH / 2, carW, carH);
    ctx.fillStyle = '#333';
    ctx.fillRect(carX + 8, roadY - 8, 8, 8);
    ctx.fillRect(carX + 32, roadY - 8, 8, 8);
}

function animateAccelSim3() {
    if (simState.accel3.isRunning) {
        simState.accel3.time += 0.016;
        simState.accel3.carVel = simState.accel3.accel * simState.accel3.time;
        const pixelsPerMeter = 3;
        const distance = 0.5 * simState.accel3.accel * simState.accel3.time * simState.accel3.time;
        simState.accel3.carX = 20 + distance * pixelsPerMeter;
        
        // Stop at edge
        if (simState.accel3.carX > simState.accel3.canvas.width - 80) {
            simState.accel3.isRunning = false;
        }
        
        document.getElementById('time-3').textContent = simState.accel3.time.toFixed(2);
        document.getElementById('vel-3').textContent = simState.accel3.carVel.toFixed(2);
        document.getElementById('dist-3').textContent = (distance).toFixed(2);
    }
    
    drawAccelSim3();
    requestAnimationFrame(animateAccelSim3);
}

// ============================================
// LESSON 4: BRAKING SIMULATION
// ============================================

function initBrakeSim4() {
    const canvas = document.getElementById('sim-brake-4');
    if (!canvas) return;
    
    simState.brake4.canvas = canvas;
    simState.brake4.ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    updateBrakeSim4();
    drawBrakeSim4();
    animateBrakeSim4();
}

function updateBrakeSim4() {
    const speedInput = document.getElementById('speed-brake-4');
    const decelInput = document.getElementById('decel-brake-4');
    
    simState.brake4.speed = parseFloat(speedInput.value);
    simState.brake4.decel = parseFloat(decelInput.value);
    
    document.getElementById('speed-display-4').textContent = simState.brake4.speed;
    document.getElementById('decel-display-4').textContent = simState.brake4.decel;
    
    // Calculate stopping distance: d = v²/(2a)
    simState.brake4.stopDist = (simState.brake4.speed * simState.brake4.speed) / (2 * simState.brake4.decel);
    
    brakeReset4();
}

function brakeStart4() {
    if (simState.brake4.isRunning) return;
    simState.brake4.time = 0;
    simState.brake4.carVel = simState.brake4.speed;
    simState.brake4.isRunning = true;
}

function brakeReset4() {
    simState.brake4.time = 0;
    simState.brake4.isRunning = false;
    simState.brake4.carX = 20;
    simState.brake4.carVel = 0;
    document.getElementById('time-4').textContent = '0.0';
    document.getElementById('vel-4').textContent = '0.0';
    document.getElementById('stop-dist-4').textContent = simState.brake4.stopDist.toFixed(2);
}

function drawBrakeSim4() {
    const { canvas, ctx, carX, stopDist } = simState.brake4;
    const pixelsPerMeter = 2;
    
    ctx.fillStyle = '#2b5b9b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const roadY = canvas.height / 2;
    const carW = 50;
    const carH = 25;
    
    // Road
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, roadY + 12);
    ctx.lineTo(canvas.width, roadY + 12);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Stopping distance marker
    const stopMarkerX = 20 + stopDist * pixelsPerMeter;
    if (stopMarkerX < canvas.width - 20) {
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(stopMarkerX, roadY - 30);
        ctx.lineTo(stopMarkerX, roadY + 30);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Car
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(carX, roadY - carH / 2, carW, carH);
    ctx.fillStyle = '#333';
    ctx.fillRect(carX + 8, roadY - 8, 8, 8);
    ctx.fillRect(carX + 32, roadY - 8, 8, 8);
}

function animateBrakeSim4() {
    if (simState.brake4.isRunning) {
        simState.brake4.time += 0.016;
        simState.brake4.carVel = simState.brake4.speed - simState.brake4.decel * simState.brake4.time;
        
        if (simState.brake4.carVel <= 0) {
            simState.brake4.carVel = 0;
            simState.brake4.isRunning = false;
        }
        
        const pixelsPerMeter = 2;
        const distance = simState.brake4.speed * simState.brake4.time - 0.5 * simState.brake4.decel * simState.brake4.time * simState.brake4.time;
        simState.brake4.carX = 20 + distance * pixelsPerMeter;
        
        document.getElementById('time-4').textContent = simState.brake4.time.toFixed(2);
        document.getElementById('vel-4').textContent = Math.max(0, simState.brake4.carVel).toFixed(2);
    }
    
    drawBrakeSim4();
    requestAnimationFrame(animateBrakeSim4);
}

// ============================================
// INITIALIZATION
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initDropSim1();
    initThrowSim2();
    initAccelSim3();
    initBrakeSim4();
});