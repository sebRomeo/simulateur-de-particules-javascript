function gravity() {
    let i1, i2, checked;
    // we just begin the second loop with i+1 because previous pairs have been tested
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];
            const distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
            P1.speed = P1.force.length();
            P2.speed = P2.force.length();

            const doubleRadius = P1.radius + P2.radius;
            const maxCollisionDistance = doubleRadius + P1.speed + P2.speed; // distance max en px parcourue

            if (distance < maxCollisionDistance + config.broadPhaseDistanceMargin) {
                P1.friends.push({
                    P: P2,
                    distance,
                    maxCollisionDistance,
                })
            }

            if (!config.disableGravity) {
                //const distSoft = Math.max(distance, doubleRadius);
                const gravityValue = getGravityValue(distance);
                P1.addGravity(Vector.sub(P2.position, P1.position).normalize().scale(gravityValue));
                P2.addGravity(Vector.sub(P1.position, P2.position).normalize().scale(gravityValue));

                //(1 / distance) * config.gravity.value// 1000 * config.gravity.value * ((gravitationalConstant * P1.mass * P2.mass) / distSquared)
                /*  const deltaVectorA = Vector.sub(P2.position, P1.position);
                 const normalizedDeltaA = Vector.norm(deltaVectorA);
                 const normalizedDeltaB = { x: 0 - normalizedDeltaA.x, y: 0 - normalizedDeltaA.y };
                 const forceVectorA = Vector.mult(normalizedDeltaA, gravityValue);
                 const forceVectorB = Vector.mult(normalizedDeltaB, gravityValue); */

                /*  const subA = Vector.sub(P2.position, P1.position)
                 const normA = Vector.norm(subA)
                 const multA = Vector.mult(normA, gravityValue)
                 const subB = Vector.sub(P1.position, P2.position)
                 const normB = Vector.norm(subB)
                 const multB = Vector.mult(normB, gravityValue) */
                // particles[i].addSpeed(Vector.sub(this, particles[i]).normalize().scale(this.gravity));

                /* P1.force.x += forceVectorA.x;
                P1.force.y += forceVectorA.y;
                P2.force.x += forceVectorB.x;
                P2.force.y += forceVectorB.y; */
                // P1.force = Vector.add(P1.force, multA);
                // P2.force = Vector.add(P2.force, multB);
                // P1.addSpeed(Vector.sub(P2.position, P1.position).normalize().scale(gravityValue))
                // P2.addSpeed(Vector.sub(P1.position, P2.position).normalize().scale(gravityValue))
            }
        }
    }
}