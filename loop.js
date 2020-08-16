let frame = 0;

const drawInterpolationFrame = (P, invert = false) => {
    ctx.beginPath();
    ctx.arc(P.position.x, P.position.y, P.radius, 0, 2 * Math.PI, false);
    ctx.stroke();
}

stats.registerEvents('gravity', 'collision', 'draw', 'solver');

function loop() {
    stats.timeStart('main');
    ctx.clearRect(0, 0, w, h);
    stats.timeStart('gravity');
    gravity();
    stats.timeEnd('gravity');
    if (!config.disableCollisions.value) {
        stats.timeStart('solver');
        solver();
        stats.timeEnd('solver');
    }
    stats.timeStart('draw');
    draw();
    stats.timeEnd('draw');
    if (!simulation.paused) window.requestAnimationFrame(loop);
    stats.timeEnd('main');
}

const pi2 = 2 * Math.PI;

function draw() {
    for (const P of Particules) {
        P.force.add(P.gravity)
        if (P.collisionChecked) P.position.add(P.gravity);
        else P.position.add(P.force);

        P.collisionChecked = false;
        P.friends = [];
        P.gravity = new Vector(0, 0);
        ctx.beginPath();
        ctx.arc((P.position.x + viewPort.x) * zoom, (P.position.y + viewPort.y) * zoom, P.radius * zoom, 0, pi2, false);
        ctx.fillStyle = P.color;
        ctx.fill();
    }
}

function redraw(clear = true) {
    if (clear) ctx.clearRect(0, 0, w, h);
    for (const P of Particules) {
        ctx.beginPath();
        ctx.arc((P.position.x + viewPort.x) * zoom, (P.position.y + viewPort.y) * zoom, P.radius * zoom, 0, pi2, false);
        ctx.fillStyle = P.color;
        ctx.fill();
    }
}