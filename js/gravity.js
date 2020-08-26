function gravity() {
    let i1, i2, checked;
    // we just begin the second loop with i+1 because previous pairs have been tested
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];
            const distanceSquared = Math.pow(P2.position.x - P1.position.x, 2) + Math.pow(P2.position.y - P1.position.y, 2)
            const distance = Math.sqrt(distanceSquared);
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

            if (!config.disableGravity) {
                const gravityValue = Math.min(getGravityValue(distanceSquared), friend.maxGravity);
                const v1 = Vector.sub(P2.position, P1.position).normalize();
                const v2 = Vector.invert(v1)
                P1.gravity.add(v1.scale(gravityValue * P2.mass));
                P2.gravity.add(v2.scale(gravityValue * P1.mass));
            }
        }
    }
}