function solver() {
    while (detectCollisionAndAdjust());
}

function detectCollisionAndAdjust() {
    let detectedOverlap = false;
    for (const P1 of Particules) for (const friend of P1.friends) solveConstraint(P1, friend)
    return detectedOverlap;
}

function solveConstraint(P1, friend) {
    const { P: P2, distance, doubleRadius } = friend;
    if (distance < doubleRadius) {
        // collision
        const vCollisionNorm = new Vector(P2.position.x - P1.position.x, P2.position.y - P1.position.y).normalize();

        P1.position.x -= vCollisionNorm.x;
        P1.position.y -= vCollisionNorm.y;
        P2.position.x += vCollisionNorm.x;
        P2.position.y += vCollisionNorm.y;
        friend.distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
        detectedOverlap = true;
    }
}