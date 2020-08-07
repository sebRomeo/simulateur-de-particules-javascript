
function loop(config) {
    const disableGravity = config.gravity.value === 0;
    stats.registerEvents();
    return () => {
        stats.timeStart('main');
        const bodies = Composite.allBodies(world);
        let i1, i2, checked;
        const nbBodies = bodies.length;
        // we just begin the second loop with i+1 because previous pairs have been tested
        for (i1 = 0; i1 < nbBodies; i1++) {
            const bodyA = bodies[i1];
            const { mass: mass1, position: positionA, isStatic: isStaticA } = bodyA;
            if (isStaticA) continue;
            checked = i1 + 1;
            for (i2 = checked; i2 < nbBodies; i2++) {
                const bodyB = bodies[i2];
                const { mass: mass2, position: positionB, isStatic: isStaticB } = bodyB;
                if (isStaticB) continue;
                const distance = Math.hypot(positionB.x - positionA.x, positionB.y - positionA.y);
                // console.log(`distance`, distance) // 551
                // console.log('targetAngleA', targetAngleA) // 1.6
                // console.log('targetAngleB', targetAngleB) // -1.6
                // console.log(`bodyA.force`, bodyA.force) // { x, y }
                // console.log(`bodyA.size`, bodyA.size) // { x, y }

                if (distance < config.minDistanceForCollisionDetection) processColisions(bodyA, bodyB);

                if (!disableGravity) {
                    const gravityValue = config.gravity.value * ((gravitationalConstant * mass1 * mass2) / (distance ** 2))

                    const deltaVectorA = Matter.Vector.sub(positionB, positionA);
                    const normalizedDeltaA = Matter.Vector.normalise(deltaVectorA);
                    const normalizedDeltaB = { x: 0 - normalizedDeltaA.x, y: 0 - normalizedDeltaA.y };
                    const forceVectorA = Matter.Vector.mult(normalizedDeltaA, gravityValue);
                    const forceVectorB = Matter.Vector.mult(normalizedDeltaB, gravityValue);
                    Body.applyForce(bodyA, positionA, forceVectorA);
                    Body.applyForce(bodyB, positionB, forceVectorB);


                    //Body.applyForce(myBody, myBody.position, forceVector);
                    /* 
                                        const targetAngleA = Matter.Vector.angle(positionA, positionB);
                                        const targetAngleB = 0 - targetAngleA;
                                        console.log(`gravityValueA`, mass1, gravityValue)
                    
                                        Body.applyForce(bodyA, positionA, {
                                            x: Math.sin(targetAngleA) * gravityValue,
                                            y: Math.cos(targetAngleA) * gravityValue
                                        });
                                        Body.applyForce(bodyB, positionB, {
                                            x: Math.sin(targetAngleB) * gravityValue,
                                            y: Math.cos(targetAngleB) * gravityValue
                                        }); */
                }
            }
        }
        stats.timeEnd('main');
    }
}