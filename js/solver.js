function solver() {
    while (detectCollisionAndAdjust());
}

function detectCollisionAndAdjust() {
    let detectedOverlap = false;
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];
            const distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
            const doubleRadius = P1.radius + P2.radius;

            if (distance < doubleRadius) {
                // collision
                const vCollisionNorm = { x: (P2.position.x - P1.position.x) / distance, y: (P2.position.y - P1.position.y) / distance };
                const totalMass = P1.mass + P2.mass;
                const impulse = 2 / totalMass;
                P1.position.x -= impulse * P2.mass * vCollisionNorm.x;
                P1.position.y -= impulse * P2.mass * vCollisionNorm.y;
                P2.position.x += impulse * P1.mass * vCollisionNorm.x;
                P2.position.y += impulse * P1.mass * vCollisionNorm.y;

                detectedOverlap = true;
            }
        }
    }
    return detectedOverlap;
}