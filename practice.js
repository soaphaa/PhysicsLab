// ============================================
// PRACTICE PROBLEM SYSTEM
// ============================================
// Features:
// - 3 difficulty levels (Easy, Medium, Hard)
// - Randomized problem generation with specific ranges
// - Hint system (step-by-step guidance)
// - Solution checker with partial credit
// - Problem history & progress tracking

console.log('practice.js loaded!');

// ============================================
// PROBLEM DATABASE - SPH3U/4U CURRICULUM LEVEL
// ============================================
// Each problem type has multiple variations based on difficulty

const problemTypes = {
    // EASY (SPH3U Level): Single-step, given variables
    easy: [
        {
            type: 'simple_drop',
            title: 'Free Fall',
            description: (h) => `An object is dropped from a height of ${h}m. How long does it take to hit the ground?`,
            generate: () => {
                const h = Math.floor(Math.random() * 40) + 20;  // 20-60m
                return { h, answer: Math.sqrt((2 * h) / 9.81), units: 's', variables: { h }, formula: 't = √(2h/g)' };
            }
        },
        {
            type: 'simple_velocity',
            title: 'Final Velocity from Free Fall',
            description: (h) => `An object falls from ${h}m. What is its final velocity (ignore air resistance)?`,
            generate: () => {
                const h = Math.floor(Math.random() * 40) + 20;  // 20-60m
                return { h, answer: Math.sqrt(2 * 9.81 * h), units: 'm/s', variables: { h }, formula: 'v = √(2gh)' };
            }
        },
        {
            type: 'simple_up_velocity',
            title: 'Velocity from Throwing Up',
            description: (v0) => `A ball is thrown upward at ${v0}m/s. What is the maximum height reached?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 15) + 10;  // 10-25 m/s
                return { v0, answer: (v0 * v0) / (2 * 9.81), units: 'm', variables: { v0 }, formula: 'h = v₀²/(2g)' };
            }
        },
        {
            type: 'simple_acceleration',
            title: 'Distance from Acceleration',
            description: (a, t) => `A car accelerates at ${a}m/s² for ${t}s from rest. How far does it travel?`,
            generate: () => {
                const a = Math.floor(Math.random() * 4) + 2;  // 2-6 m/s²
                const t = Math.floor(Math.random() * 5) + 3;  // 3-8 seconds
                return { a, t, answer: 0.5 * a * t * t, units: 'm', variables: { a, t }, formula: 'd = 0.5at²' };
            }
        }
    ],

    // MEDIUM (SPH3U Level): Multi-step, requires understanding relationships
    medium: [
        {
            type: 'projectile_range',
            title: 'Horizontal Projectile Range',
            description: (v0, h) => `A ball is thrown horizontally at ${v0}m/s from a height of ${h}m. How far does it travel horizontally?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 10) + 8;   // 8-18 m/s
                const h = Math.floor(Math.random() * 30) + 20;   // 20-50m
                const t = Math.sqrt((2 * h) / 9.81);
                return { v0, h, answer: v0 * t, units: 'm', variables: { v0, h }, formula: 'x = v₀·t where t = √(2h/g)' };
            }
        },
        {
            type: 'braking_distance',
            title: 'Braking Distance',
            description: (v0, a) => `A car traveling at ${v0}m/s brakes with deceleration ${a}m/s². What is the stopping distance?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 20) + 20;  // 20-40 m/s
                const a = Math.floor(Math.random() * 5) + 3;     // 3-8 m/s²
                return { v0, a, answer: (v0 * v0) / (2 * a), units: 'm', variables: { v0, a }, formula: 'd = v₀²/(2a)' };
            }
        },
        {
            type: 'time_of_flight',
            title: 'Vertical Projectile Time in Air',
            description: (v0) => `A ball is thrown straight up at ${v0}m/s. How long is it in the air?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 20) + 15;  // 15-35 m/s
                return { v0, answer: (2 * v0) / 9.81, units: 's', variables: { v0 }, formula: 't = 2v₀/g' };
            }
        },
        {
            type: 'acceleration_velocity',
            title: 'Final Velocity from Acceleration',
            description: (v0, a, t) => `A car starts at ${v0}m/s and accelerates at ${a}m/s² for ${t}s. Final velocity?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 10) + 5;   // 5-15 m/s
                const a = Math.floor(Math.random() * 3) + 1;     // 1-4 m/s²
                const t = Math.floor(Math.random() * 8) + 3;     // 3-11 seconds
                return { v0, a, t, answer: v0 + a * t, units: 'm/s', variables: { v0, a, t }, formula: 'vf = v₀ + at' };
            }
        }
    ],

    // HARD (SPH4U Level): Complex multi-step, angles, components, energy considerations
    hard: [
        {
            type: 'projectile_angle',
            title: 'Projectile at Angle - Range',
            description: (v0, angle) => `A projectile is launched at ${v0}m/s at ${angle}°. What is the horizontal range (flat ground)?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 20) + 20;  // 20-40 m/s
                const angle = Math.floor(Math.random() * 60) + 15; // 15-75 degrees (avoid 90)
                const angleRad = (angle * Math.PI) / 180;
                return { 
                    v0, angle, 
                    answer: (v0 * v0 * Math.sin(2 * angleRad)) / 9.81, 
                    units: 'm', 
                    variables: { v0, angle }, 
                    formula: 'R = (v₀²sin(2θ))/g' 
                };
            }
        },
        {
            type: 'projectile_max_height',
            title: 'Projectile Max Height at Angle',
            description: (v0, angle) => `A projectile is launched at ${v0}m/s at ${angle}°. What is the maximum height?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 20) + 15;  // 15-35 m/s
                const angle = Math.floor(Math.random() * 60) + 15; // 15-75 degrees
                const angleRad = (angle * Math.PI) / 180;
                const vy = v0 * Math.sin(angleRad);
                return { 
                    v0, angle, 
                    answer: (vy * vy) / (2 * 9.81), 
                    units: 'm', 
                    variables: { v0, angle }, 
                    formula: 'h_max = (v₀²sin²(θ))/(2g)' 
                };
            }
        },
        {
            type: 'combined_motion',
            title: 'Multi-Step Kinematic Problem',
            description: (v0, a, vf) => `A car accelerates from rest at ${a}m/s² until reaching ${vf}m/s, then coasts. How long did acceleration take?`,
            generate: () => {
                const a = Math.floor(Math.random() * 4) + 2;     // 2-6 m/s²
                const vf = Math.floor(Math.random() * 20) + 20;  // 20-40 m/s
                return { a, vf, answer: vf / a, units: 's', variables: { a, vf }, formula: 't = vf/a (from v = at)' };
            }
        },
        {
            type: 'catch_up',
            title: 'Object Launched from Height',
            description: (v0, h, angle) => `A projectile is launched at ${v0}m/s from height ${h}m at ${angle}°. Time until it hits ground?`,
            generate: () => {
                const v0 = Math.floor(Math.random() * 15) + 20;  // 20-35 m/s
                const h = Math.floor(Math.random() * 30) + 10;   // 10-40m
                const angle = Math.floor(Math.random() * 60) + 15; // 15-75 degrees
                const angleRad = (angle * Math.PI) / 180;
                const vy = v0 * Math.sin(angleRad);
                
                // Quadratic: -0.5g*t² + vy*t + h = 0
                const a_coef = -0.5 * 9.81;
                const b_coef = vy;
                const c_coef = h;
                const discriminant = b_coef * b_coef - 4 * a_coef * c_coef;
                const t = (-b_coef + Math.sqrt(discriminant)) / (2 * a_coef);
                
                return { 
                    v0, h, angle, 
                    answer: t, 
                    units: 's', 
                    variables: { v0, h, angle }, 
                    formula: 'y = y₀ + v₀sin(θ)·t - 0.5g·t² (solve for t when y=0)' 
                };
            }
        }
    ]
};

// ============================================
// PROBLEM STATE
// ============================================
let problemState = {
    currentProblem: null,
    difficulty: 'easy',
    score: 0,
    totalAttempts: 0,
    currentAttempts: 0,
    showHint: false,
    showSolution: false,
    history: []
};

// ============================================
// HINT SYSTEM - Progressive guidance
// ============================================
const hintTexts = {
    simple_drop: [
        'Hint 1: This is free fall (initial velocity = 0)',
        'Hint 2: Use the equation: d = 0.5·g·t²',
        'Hint 3: Rearrange to find t: t = √(2d/g)'
    ],
    simple_velocity: [
        'Hint 1: Use vf² = vi² + 2ad',
        'Hint 2: Initial velocity is 0 (dropped, not thrown)',
        'Hint 3: v = √(2gh)'
    ],
    simple_up_velocity: [
        'Hint 1: At maximum height, velocity = 0',
        'Hint 2: Use vf² = vi² - 2gh',
        'Hint 3: Rearrange: h = v₀²/(2g)'
    ],
    simple_acceleration: [
        'Hint 1: The car starts from rest (v₀ = 0)',
        'Hint 2: Use d = v₀t + 0.5at²',
        'Hint 3: Since v₀ = 0: d = 0.5at²'
    ],
    projectile_range: [
        'Hint 1: Break into horizontal and vertical components',
        'Hint 2: Vertical: Find time to fall using d = 0.5gt²',
        'Hint 3: Horizontal: x = v₀·t (constant velocity in x)'
    ],
    braking_distance: [
        'Hint 1: This is constant deceleration (a is negative)',
        'Hint 2: Final velocity is 0 (car stops)',
        'Hint 3: Use vf² = vi² - 2ad, solve for d'
    ],
    time_of_flight: [
        'Hint 1: Time up equals time down',
        'Hint 2: Use vy = v₀ - gt, set vy = 0 to find time to peak',
        'Hint 3: Total time = 2 × (time to peak)'
    ],
    acceleration_velocity: [
        'Hint 1: Initial velocity is given as v₀',
        'Hint 2: Use vf = v₀ + at',
        'Hint 3: Substitute values and calculate'
    ],
    projectile_angle: [
        'Hint 1: Maximum range occurs at 45° (remember this!)',
        'Hint 2: Use R = (v₀²sin(2θ))/g',
        'Hint 3: Convert angle to radians first'
    ],
    projectile_max_height: [
        'Hint 1: Only the vertical component contributes to height',
        'Hint 2: vy = v₀sin(θ)',
        'Hint 3: h_max = vy²/(2g) = (v₀²sin²(θ))/(2g)'
    ],
    combined_motion: [
        'Hint 1: The car reaches target velocity using a = (vf - vi)/t',
        'Hint 2: Starting from rest means vi = 0',
        'Hint 3: Rearrange: t = vf/a'
    ],
    catch_up: [
        'Hint 1: Use y = y₀ + v₀sin(θ)·t - 0.5g·t²',
        'Hint 2: Set y = 0 (ground level)',
        'Hint 3: Solve the quadratic equation for t'
    ]
};

// ============================================
// GENERATE NEW PROBLEM
// ============================================
function generateProblem() {
    const problems = problemTypes[problemState.difficulty];
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    const data = randomProblem.generate();
    
    problemState.currentProblem = {
        type: randomProblem.type,
        title: randomProblem.title,
        description: randomProblem.description(...Object.values(data).slice(0, -3)),
        answer: data.answer,
        units: data.units,
        variables: data.variables,
        formula: data.formula,
        tolerance: 0.02  // 2% tolerance for answer checking
    };
    
    problemState.currentAttempts = 0;
    problemState.showHint = false;
    problemState.showSolution = false;
    
    return problemState.currentProblem;
}

// ============================================
// CHECK ANSWER
// ============================================
function checkAnswer(userAnswer) {
    if (!problemState.currentProblem) return { correct: false, message: 'No problem loaded' };
    
    const userNum = parseFloat(userAnswer);
    const correct = Math.abs(userNum - problemState.currentProblem.answer) / problemState.currentProblem.answer < problemState.currentProblem.tolerance;
    
    problemState.currentAttempts++;
    problemState.totalAttempts++;
    
    let message = '';
    if (correct) {
        problemState.score++;
        message = `✅ Correct! ${problemState.title}\nAnswer: ${problemState.currentProblem.answer.toFixed(2)} ${problemState.currentProblem.units}`;
    } else {
        if (problemState.currentAttempts === 1) {
            message = '❌ Not quite. Try again or ask for a hint.';
        } else if (problemState.currentAttempts === 2) {
            message = '❌ Still not right. Here\'s a hint!';
            problemState.showHint = true;
        } else {
            message = `❌ The answer is ${problemState.currentProblem.answer.toFixed(2)} ${problemState.currentProblem.units}. Review the formula!`;
            problemState.showSolution = true;
        }
    }
    
    // Store in history
    problemState.history.push({
        problem: problemState.currentProblem.title,
        userAnswer: userNum,
        correctAnswer: problemState.currentProblem.answer,
        correct: correct,
        difficulty: problemState.difficulty,
        attempts: problemState.currentAttempts
    });
    
    return { correct, message, answer: problemState.currentProblem.answer };
}

// ============================================
// GET HINT
// ============================================
function getHint() {
    if (!problemState.currentProblem) return '';
    
    const hints = hintTexts[problemState.currentProblem.type] || [];
    const hintIndex = Math.min(problemState.currentAttempts - 1, hints.length - 1);
    return hints[hintIndex] || 'Try using the formula shown above!';
}

// ============================================
// GET SOLUTION
// ============================================
function getSolution() {
    if (!problemState.currentProblem) return '';
    
    const prob = problemState.currentProblem;
    return `
    <strong>Solution:</strong><br>
    Formula: ${prob.formula}<br>
    Given: ${Object.entries(prob.variables).map(([k, v]) => `${k} = ${v}`).join(', ')}<br>
    Answer: ${prob.answer.toFixed(2)} ${prob.units}
    `;
}

// ============================================
// DIFFICULTY SELECTOR
// ============================================
function setDifficulty(level) {
    if (['easy', 'medium', 'hard'].includes(level)) {
        problemState.difficulty = level;
        generateProblem();
        return true;
    }
    return false;
}

// ============================================
// STATS
// ============================================
function getStats() {
    const accuracy = problemState.totalAttempts > 0 
        ? ((problemState.score / problemState.totalAttempts) * 100).toFixed(1)
        : 0;
    
    return {
        correctAnswers: problemState.score,
        totalAttempts: problemState.totalAttempts,
        accuracy: accuracy,
        difficulty: problemState.difficulty,
        history: problemState.history.slice(-10)  // Last 10 problems
    };
}

// Initialize with first problem
generateProblem();