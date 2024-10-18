const canvas = document.getElementById('latticeCanvas');
const ctx = canvas.getContext('2d');
let width, height;

const latticeSize = 50;
const vibrationAmplitude = 5;
let numRows, numCols;
let latticePoints = [];
let time = 0;
let waves = [];
const waveSpeed = 3;
const initialWaveAmplitude = 50;
const decayRate = 0.005;
const returnSpeed = 0.95;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
    initializeLattice();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initializeLattice() {
    latticePoints = [];
    numCols = Math.floor(width / latticeSize);
    numRows = Math.floor(height / latticeSize);

    for (let i = 0; i <= numRows; i++) {
        for (let j = 0; j <= numCols; j++) {
            const x = j * latticeSize;
            const y = i * latticeSize;
            const phaseX = Math.random() * Math.PI * 2;
            const phaseY = Math.random() * Math.PI * 2;
            latticePoints.push({
                centerX: x,
                centerY: y,
                phaseX: phaseX,
                phaseY: phaseY,
                phaseSpeedX: (Math.random() - 0.5) * 0.05,
                phaseSpeedY: (Math.random() - 0.5) * 0.05,
                waveOffsetX: 0,
                waveOffsetY: 0
            });
        }
    }
}

function generateWave() {
    const x = Math.random() * width;
    const y = Math.random() * height;
    waves.push({
        x: x,
        y: y,
        radius: 0
    });

    const nextWaveTime = Math.random() * 2000 + 2000;
    setTimeout(generateWave, nextWaveTime);
}

function updateWaves() {
    waves.forEach(wave => {
        wave.radius += waveSpeed;
    });
    waves = waves.filter(wave => wave.radius < Math.max(width, height) * 1.5);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function updateLattice() {
    time += 0.02;

    latticePoints.forEach(point => {
        point.phaseX += point.phaseSpeedX;
        point.phaseY += point.phaseSpeedY;

        let newX = point.centerX + Math.sin(time + point.phaseX) * vibrationAmplitude;
        let newY = point.centerY + Math.cos(time + point.phaseY) * vibrationAmplitude;

        let waveOffsetX = 0;
        let waveOffsetY = 0;

        waves.forEach(wave => {
            const dist = distance(wave.x, wave.y, newX, newY);
            if (dist < wave.radius + 50 && dist > wave.radius - 50) {
                const waveEffect = Math.sin((dist - wave.radius) / 10) * initialWaveAmplitude * Math.exp(-decayRate * dist);
                const angle = Math.atan2(newY - wave.y, newX - wave.x);
                waveOffsetX += Math.cos(angle) * waveEffect;
                waveOffsetY += Math.sin(angle) * waveEffect;
            }
        });

        point.waveOffsetX = point.waveOffsetX * returnSpeed + waveOffsetX * (1 - returnSpeed);
        point.waveOffsetY = point.waveOffsetY * returnSpeed + waveOffsetY * (1 - returnSpeed);

        newX += point.waveOffsetX;
        newY += point.waveOffsetY;

        point.currentX = newX;
        point.currentY = newY;
    });
}

function drawLattice() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'gray'; //'rgba(85, 86, 88, 1)'
    // ctx.fillStyle = 'red'; //'rgba(85, 86, 88, 1)'
    latticePoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.currentX, point.currentY, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function animate() {
    updateLattice();
    drawLattice();
    updateWaves();
    requestAnimationFrame(animate);
}

animate();
setTimeout(generateWave, Math.random() * 2000 + 2000);