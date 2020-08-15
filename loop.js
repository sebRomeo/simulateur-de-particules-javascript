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
    stats.timeStart('collision');
    processColisions();
    stats.timeEnd('collision');
    stats.timeStart('solver');
    solver();
    stats.timeEnd('solver');
    stats.timeStart('draw');
    draw();
    stats.timeEnd('draw');
    if (!simulation.paused) window.requestAnimationFrame(loop);
    stats.timeEnd('main');
}

function draw(justDraw = false) {
    for (const P of Particules) {
        if (!justDraw) {
            if (!P.collisionChecked) P.position = Vector.add(P.position, P.force); // apply force
            P.collisionChecked = false;
        }
        ctx.beginPath();
        ctx.arc(P.position.x, P.position.y, P.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = P.color;
        ctx.fill();
    }
}