
function processColisions() {
    /* for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) { */

    for (const P1 of Particules) {
        for (const friend of P1.friends) {
            const { P: P2, distance, maxCollisionDistance } = friend;
            //const P2 = Particules[i2];
            //const distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
            //const doubleRadius = P1.radius + P2.radius;
            const p1OriginalPosition = P1.position
            const p2OriginalPosition = P2.position

            //const maxCollisionDistance = doubleRadius + P1.speed + P2.speed; // distance max en px parcourue

            if (distance < maxCollisionDistance && !P1.collisionChecked && !P2.collisionChecked) {

                // we take maximum distance divided by min radius
                const nbSteps = Math.ceil(maxCollisionDistance / Math.min(P1.radius, P2.radius));
                let p1xStep = P1.force.x / nbSteps;
                let p1yStep = P1.force.y / nbSteps;
                let p2xStep = P2.force.x / nbSteps;
                let p2yStep = P2.force.y / nbSteps;
                const totalMass = P1.mass + P2.mass;

                // interpolation
                let step = nbSteps
                let resolved = false;
                for (; step > 0; step--) {
                    P1.position = Vector.add(P1.position, { x: p1xStep, y: p1yStep });
                    P2.position = Vector.add(P2.position, { x: p2xStep, y: p2yStep });

                    if (config.drawInterpolationFrame) {
                        drawInterpolationFrame(P1);
                        drawInterpolationFrame(P2, true);
                    }

                    const newDistance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
                    friend.distance = newDistance;

                    if (!resolved && newDistance <= P1.radius + P2.radius) {
                        // collision computed
                        const vCollisionNorm = { x: (P2.position.x - P1.position.x) / newDistance, y: (P2.position.y - P1.position.y) / newDistance };

                        const vRelativeVelocity = { x: P1.force.x - P2.force.x, y: P1.force.y - P2.force.y };

                        const speed = (vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y) * config.restitution.value;

                        const impulse = 2 * speed / totalMass;
                        P1.force.x -= (impulse * P2.mass * vCollisionNorm.x);
                        P1.force.y -= (impulse * P2.mass * vCollisionNorm.y);
                        P2.force.x += (impulse * P1.mass * vCollisionNorm.x);
                        P2.force.y += (impulse * P1.mass * vCollisionNorm.y);
                        p1xStep = P1.force.x / nbSteps;
                        p1yStep = P1.force.y / nbSteps;
                        p2xStep = P2.force.x / nbSteps;
                        p2yStep = P2.force.y / nbSteps;

                        resolved = true;
                    }
                }
                if (resolved) {
                    // only one collision per frame
                    P1.collisionChecked = true;
                    P2.collisionChecked = true;
                } else {
                    P1.position = p1OriginalPosition;
                    P2.position = p2OriginalPosition;
                }

                /* TODO test for perf between those 2 working functions*/
                /* var m1 = P1.mass
                var m2 = P2.mass
                var theta = -Math.atan2(P2.position.y - P1.position.y, P2.position.x - P1.position.x);
         
                var v1 = rotate(P1.force, theta);
                var v2 = rotate(P2.force, theta);
                var u1 = rotate({ x: v1.x * (m1 - m2) / (m1 + m2) + v2.x * 2 * m2 / (m1 + m2), y: v1.y }, -theta);
                var u2 = rotate({ x: v2.x * (m2 - m1) / (m1 + m2) + v1.x * 2 * m1 / (m1 + m2), y: v2.y }, -theta);
         
                P1.force.x = u1.x;
                P1.force.y = u1.y;
                P2.force.x = u2.x;
                P2.force.y = u2.y; */
            }
        }
    }
}

function rotate(v, theta) {
    return { x: v.x * Math.cos(theta) - v.y * Math.sin(theta), y: v.x * Math.sin(theta) + v.y * Math.cos(theta) };
}