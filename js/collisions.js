function collisions() {
    let i1, i2, checked;
    // we just begin the second loop with i+1 because previous pairs have been tested
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];

            if (Math.abs(P2.position.x - P1.position.x) < broadPhaseMaxHorizontalDistance && Math.abs(P2.position.y - P1.position.y) < broadPhaseMaxHorizontalDistance) {

                const distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
                P1.speed = P1.force.length();
                P2.speed = P2.force.length();

                const friend = particleCouples[i1][i2]
                const maxCollisionDistance = friend.doubleRadius + P1.speed + P2.speed; // distance max en px parcourue

                if (distance < maxCollisionDistance + config.broadPhaseDistanceMargin) {
                    friend.distance = distance;
                    friend.maxCollisionDistance = maxCollisionDistance;
                    P1.friends.push(friend)
                    processColisions(P1, friend);
                }
            }
        }
    }
}

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
        // const m1Mm2 = P1.mass - P2.mass

        // interpolation
        let step = nbSteps
        let resolved = false;
        for (; step > 0; step--) {
            P1.position = Vector.add(P1.position, { x: p1xStep, y: p1yStep });
            P2.position = Vector.add(P2.position, { x: p2xStep, y: p2yStep });

            const p2Xmp1X = P2.position.x - P1.position.x;
            const p2Ymp1Y = P2.position.y - P1.position.y;

            if (Math.hypot(p2Xmp1X, p2Ymp1Y) <= friend.doubleRadius) {
                const vCollisionNorm = { x: (P2.position.x - P1.position.x) / friend.doubleRadius, y: (P2.position.y - P1.position.y) / friend.doubleRadius };

                const vRelativeVelocity = {
                    x: P1.force.x - P2.force.x,
                    y: P1.force.y - P2.force.y
                };

                const speed = (vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y);

                const impulse = 2 * speed / friend.totalMass;
                P1.force.x -= (impulse * P2.mass * vCollisionNorm.x);
                P1.force.y -= (impulse * P2.mass * vCollisionNorm.y);
                P2.force.x += (impulse * P1.mass * vCollisionNorm.x);
                P2.force.y += (impulse * P1.mass * vCollisionNorm.y);
                P1.force.scale(config.restitution.value)
                P2.force.scale(config.restitution.value)

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