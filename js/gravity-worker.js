importScripts('../libs/utils.js', '../libs/vector2.js')

let config, particleCouples, gravityValueWithoutFading, gravityValue;

onmessage = function (e) {
    const [type, ...data] = e.data;
    switch (type) {
        case 'updateGravity':
            updateGravity(data[0]);
            break;
        case 'registerGlobals':
            config = data[0]
            particleCouples = data[1]
            gravityValueWithoutFading = data[2]
            gravityValue = data[3]
            nbParticules = data[4]
            break;
    }
}

function updateGravity(Particules) {
    // loop starts
    let i1, i2, checked;
    // we just begin the second loop with i+1 because previous pairs have been tested
    const gravities = Array(nbParticules).fill(1).map(e => new Vector(0, 0));
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];
            const distanceSquared = Math.pow(P2.position.x - P1.position.x, 2) + Math.pow(P2.position.y - P1.position.y, 2)

            const friend = particleCouples[i1][i2]

            const gravityValue = Math.min(getGravityValue(distanceSquared), friend.maxGravity);
            const v1 = Vector.sub(P2.position, P1.position).normalize();
            const v2 = Vector.invert(v1)
            gravities[i1].add(v1.scale(gravityValue * P2.mass));
            gravities[i2].add(v2.scale(gravityValue * P1.mass));
        }
    }
    postMessage(gravities);
}

function getGravityValue(distanceSquared) {
    const withFading = config.gravityFadeWithDistance.value * (1 / (distanceSquared)) * (10 ** 3);
    return (withFading + gravityValueWithoutFading) * gravityValue;
} 