let frame = 0;
function loop(timestamp) {
    stats.loopStart(timestamp);
    let i1, i2, checked;
    // we just begin the second loop with i+1 because previous pairs have been tested
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];

            const distanceSquared = ((P2.position.x - P1.position.x) ** 2) + ((P2.position.y - P1.position.y) ** 2);

            processColisions(P1, P2, distanceSquared);

            if (!config.disableGravity) {
                const gravityValue = config.gravity.value * ((gravitationalConstant * P1.mass * P2.mass) / distanceSquared)

                const deltaVectorA = Vector.sub(P2.position, P1.position);
                const normalizedDeltaA = Vector.norm(deltaVectorA);
                const normalizedDeltaB = { x: 0 - normalizedDeltaA.x, y: 0 - normalizedDeltaA.y };
                const forceVectorA = Vector.mult(normalizedDeltaA, gravityValue);
                const forceVectorB = Vector.mult(normalizedDeltaB, gravityValue);
                P1.force.x += forceVectorA.x;
                P1.force.y += forceVectorA.y;
                P2.force.x += forceVectorB.x;
                P2.force.y += forceVectorB.y;
            }
        }
    }

    ctx.clearRect(0, 0, w, h);
    for (const P of Particules) {
        P.position = Vector.add(P.position, P.force); // apply force
        draw(P);
        P.collisionChecked = false;
    }

    if (!simulation.paused) window.requestAnimationFrame(loop);
}


function processColisions(P1, P2, distanceSquared) {
    if (distanceSquared < (P1.radius + P2.radius) ** 2 && !P1.collisionChecked && !P2.collisionChecked) {
        // only one collision per frame
        P1.collisionChecked = true;
        P2.collisionChecked = true;
        /* TODO test for perf between those 2 working functions
                const distance = Math.sqrt(distanceSquared)
        
                const vCollisionNorm = { x: (P2.position.x - P1.position.x) / distance, y: (P2.position.y - P1.position.y) / distance };
        
                const vRelativeVelocity = { x: P1.force.x - P2.force.x, y: P1.force.y - P2.force.y };
        
                const speed = (vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y) * 0.01;
        
                const impulse = 2 * speed / (P1.mass + P2.mass);
                P1.force.x -= (impulse * P2.mass * vCollisionNorm.x);
                P1.force.y -= (impulse * P2.mass * vCollisionNorm.y);
                P2.force.x += (impulse * P1.mass * vCollisionNorm.x);
                P2.force.y += (impulse * P1.mass * vCollisionNorm.y); */

        var m1 = P1.mass
        var m2 = P2.mass
        var theta = -Math.atan2(P2.position.y - P1.position.y, P2.position.x - P1.position.x);
        console.log(`theta`, theta)
        var v1 = rotate(P1.force, theta);
        var v2 = rotate(P2.force, theta);
        var u1 = rotate({ x: v1.x * (m1 - m2) / (m1 + m2) + v2.x * 2 * m2 / (m1 + m2), y: v1.y }, -theta);
        var u2 = rotate({ x: v2.x * (m2 - m1) / (m1 + m2) + v1.x * 2 * m1 / (m1 + m2), y: v2.y }, -theta);
        console.log(`v1,v2,u1,u2`, v1, v2, u1, u2)

        P1.force.x = u1.x;
        P1.force.y = u1.y;
        P2.force.x = u2.x;
        P2.force.y = u2.y;
    }
}

function draw(P) {
    ctx.beginPath();
    ctx.arc(P.position.x, P.position.y, P.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = P.color;
    ctx.fill();
}

function rotate(v, theta) {
    return { x: v.x * Math.cos(theta) - v.y * Math.sin(theta), y: v.x * Math.sin(theta) + v.y * Math.cos(theta) };
}