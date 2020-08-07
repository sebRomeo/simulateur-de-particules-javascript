
function loop(event) {
    console.time('A');
    const bodies = Composite.allBodies(world);
    let i1, i2, checked;
    const nbBodies = bodies.length;
    // we just begin the second loop with i+1 because previous pairs have been tested
    console.timeEnd('A');
    for (i1 = 0; i1 < nbBodies; i1++) {
        console.log(`startLoop1`, i1)
        const bodyA = bodies[i1];
        const { mass: mass1, position: positionA, isStatic: isStaticA } = bodyA;
        if (isStaticA) continue;
        checked = i1 + 1;
        for (i2 = checked; i2 < nbBodies; i2++) {
            console.log(`startLoop2`, i2)
            console.time('B');
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
                const targetAngleA = Matter.Vector.angle(positionA, positionB);
                const targetAngleB = 0 - targetAngleA;
                const gravityValue = config.gravity.value * ((gravitationalConstant * mass1 * mass2) / (distance ** 2))
                console.log(`gravityValueA`, mass1, gravityValue)

                Body.applyForce(bodyA, positionA, {
                    x: Math.cos(targetAngleA) * gravityValue,
                    y: Math.sin(targetAngleA) * gravityValue
                });
                Body.applyForce(bodyB, positionB, {
                    x: Math.cos(targetAngleB) * gravityValue,
                    y: Math.sin(targetAngleB) * gravityValue
                });
            }
            console.timeEnd('B');
            //break;
            //Math.hypot(x2 - x1, y2 - y1)
        }
        //break;
    }
    console.log(`ENDINTERVAL`)
}