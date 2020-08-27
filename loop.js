let frame = 0;


const drawInterpolationFrame = P => {
    ctx.beginPath();
    ctx.arc(P.position.x, P.position.y, P.radius, 0, 2 * Math.PI, false);
    ctx.stroke();
}

stats.registerEvents('gravity', 'collision', 'draw', 'resetAndApplyForces', 'solver');

let frameOk = false;

gravityWorker.onmessage = function (e) {
    gravitiesToBeUpdated = e.data;
    gravitiesUpdated = true;
    requestNextFrame(frameOk && particlesUpdated) // first one to finish trigger next loop
}
collisionWorker.onmessage = function (e) {
    particlesToBeUpdated = e.data;
    particlesUpdated = true;
    requestNextFrame(frameOk && gravitiesUpdated)
}

/** MAIN LOOP
 * * there are two workers: collisions AND gravity
 * * while the main thread calculate solver AND drawing content
 * * the two other thread process calculations
 * * when all calculations are done, we are ready for next loop
 */
function loop() {
    stats.timeStart('main');

    for (const P of Particules) {
        if (P.i === 0) console.log(`P.position1`, P.position.x, P.position.y)
        P.force = Vector.add(P.force, gravities[P.i]);
        if (P.collisionChecked) P.position = Vector.add(P.position, gravities[P.i]);
        else P.position = Vector.add(P.position, P.force);
        if (P.i === 0) console.log(`P.position2`, P.position.x, P.position.y)
        P.collisionChecked = false;
        P.friends = [];

        ctx.beginPath();
        ctx.arc((P.position.x + viewPort.x) * zoom, (P.position.y + viewPort.y) * zoom, Math.max(P.radius * zoom, 0.5), 0, pi2, false);
        ctx.fillStyle = P.color;
        ctx.fill();
    }

    gravities = gravitiesToBeUpdated;
    Particules = particlesToBeUpdated;

    solver();
    resetApplyForcesAndDraw();

    gravityWorker.postMessage(['updateGravity', Particules]);
    collisionWorker.postMessage(['updateCollisions', Particules]);
    particlesUpdated = true;

    frameOk = true

    requestNextFrame(gravitiesUpdated && particlesUpdated)
    stats.timeEnd('main');
}

const pi2 = 2 * Math.PI;

function resetApplyForcesAndDraw() {
    ctx.clearRect(0, 0, w, h);
    for (const P of Particules) {
        if (P.i === 0) console.log(`P.position1`, P.position.x, P.position.y)
        P.force = Vector.add(P.force, gravities[P.i]);
        if (P.collisionChecked) P.position = Vector.add(P.position, gravities[P.i]);
        else P.position = Vector.add(P.position, P.force);
        if (P.i === 0) console.log(`P.position2`, P.position.x, P.position.y)
        P.collisionChecked = false;
        P.friends = [];

        ctx.beginPath();
        ctx.arc((P.position.x + viewPort.x) * zoom, (P.position.y + viewPort.y) * zoom, Math.max(P.radius * zoom, 0.5), 0, pi2, false);
        ctx.fillStyle = P.color;
        ctx.fill();
    }
}

function redraw(clear = true) {
    if (clear) ctx.clearRect(0, 0, w, h);
    for (const P of Particules) {
        ctx.beginPath();
        ctx.arc((P.position.x + viewPort.x) * zoom, (P.position.y + viewPort.y) * zoom, Math.max(P.radius * zoom, 0.5), 0, pi2, false);
        ctx.fillStyle = P.color;
        ctx.fill();
    }
}

function requestNextFrame(condition) {
    if (condition) {
        gravitiesUpdated = false;
        frameOk = false;
        particlesUpdated = false;
        if (!simulation.paused) window.requestAnimationFrame(loop);
    }
}