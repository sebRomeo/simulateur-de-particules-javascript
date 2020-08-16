
function processColisions(P1, friend) {
    const { P: P2, distance, maxCollisionDistance } = friend;

    if (!P1.collisionChecked && !P2.collisionChecked && distance < maxCollisionDistance) {
        const p1OriginalPosition = P1.position
        const p2OriginalPosition = P2.position

        // we take maximum distance divided by min radius
        const nbSteps = Math.ceil(maxCollisionDistance / Math.min(P1.radius, P2.radius));
        let p1xStep = P1.force.x / nbSteps;
        let p1yStep = P1.force.y / nbSteps;
        let p2xStep = P2.force.x / nbSteps;
        let p2yStep = P2.force.y / nbSteps;
        const totalMass = P1.mass + P2.mass
        const m1Mm2 = P1.mass - P2.mass

        // interpolation
        let step = nbSteps
        let resolved = false;
        for (; step > 0; step--) {
            P1.position = Vector.add(P1.position, { x: p1xStep, y: p1yStep });
            P2.position = Vector.add(P2.position, { x: p2xStep, y: p2yStep });

            const p2Xmp1X = P2.position.x - P1.position.x;
            const p2Ymp1Y = P2.position.y - P1.position.y;
            const newDistance = Math.hypot(p2Xmp1X, p2Ymp1Y);

            if (newDistance <= P1.radius + P2.radius) {

                /* const theta = -Math.atan2(p2Ymp1Y, p2Xmp1X);

                const v1 = rotate(P1.force, theta);
                const v2 = rotate(P2.force, theta);
                const u1 = rotate({ x: v1.x * m1Mm2 / totalMass + v2.x * 2 * P2.mass / totalMass, y: v1.y }, -theta);
                const u2 = rotate({ x: v2.x * m1Mm2 / totalMass + v1.x * 2 * P1.mass / totalMass, y: v2.y }, -theta);

                P1.force.x = u1.x * config.restitution.value;
                P1.force.y = u1.y * config.restitution.value;
                P2.force.x = u2.x * config.restitution.value;
                P2.force.y = u2.y * config.restitution.value; */
                const vCollisionNorm = { x: (P2.position.x - P1.position.x) / newDistance, y: (P2.position.y - P1.position.y) / newDistance };

                const vRelativeVelocity = {
                    x: P1.force.x - P2.force.x,
                    y: P1.force.y - P2.force.y
                };

                const speed = (vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y) * config.restitution.value;

                const impulse = 2 * speed / totalMass;
                P1.force.x -= (impulse * P2.mass * vCollisionNorm.x);
                P1.force.y -= (impulse * P2.mass * vCollisionNorm.y);
                P2.force.x += (impulse * P1.mass * vCollisionNorm.x);
                P2.force.y += (impulse * P1.mass * vCollisionNorm.y);

                P1.position.add({
                    x: (P1.force.x / nbSteps) * step,
                    y: (P1.force.y / nbSteps) * step
                });
                P2.position.add({
                    x: (P2.force.x / nbSteps) * step,
                    y: (P2.force.y / nbSteps) * step
                });

                // only one collision per frame for elements
                P1.collisionChecked = true;
                P2.collisionChecked = true;

                friend.distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);

                resolved = true;
                break;
            }
        }
        if (!resolved) {
            P1.position = p1OriginalPosition;
            P2.position = p2OriginalPosition;
        }
    }
}

function rotate(v, theta) {
    return { x: v.x * Math.cos(theta) - v.y * Math.sin(theta), y: v.x * Math.sin(theta) + v.y * Math.cos(theta) };
}