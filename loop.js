let frame = 0;

stats.registerEvents('gravity', 'collision', 'draw', 'resetAndApplyForces', 'solver');

let gravitiesUpdated = false;
let gravitiesToBeUpdated = gravities;
let frameOk = false;

gravityWorker.onmessage = function (e) {
    gravitiesToBeUpdated = e.data;
    gravitiesUpdated = true;
    requestNextFrame(frameOk)
}

/** MAIN LOOP
 * * there are two workers: collisions AND gravity
 * * while the main thread calculate solver AND drawing content
 * * the two other thread process calculations
 * * whenn all calculations are done, we are ready for next loop
 */
function loop() {
    stats.timeStart('main');

    gravities = gravitiesToBeUpdated;

    gravityWorker.postMessage(['updateGravity', Particules]);

    stats.timeStart('solver');
    solver();
    stats.timeEnd('solver');
    stats.timeStart('draw');
    resetApplyForcesAndDraw();
    stats.timeEnd('draw');


    stats.timeStart('collision');
    collisions();
    stats.timeEnd('collision');

    frameOk = true

    requestNextFrame(gravitiesUpdated)
    stats.timeEnd('main');
}

const pi2 = 2 * Math.PI;

function resetApplyForcesAndDraw() {
    ctx.clearRect(0, 0, w, h);
    for (const P of Particules) {
        P.force.add(gravities[P.i]);
        if (P.collisionChecked) P.position.add(gravities[P.i]);
        else P.position.add(P.force);
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
        if (!simulation.paused && condition) window.requestAnimationFrame(loop);
    }
}