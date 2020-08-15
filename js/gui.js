

config.start = { name: `Démarrer (espace)`, value: simulation.play };
config.stop = { name: `Stop (espace)`, value: simulation.pause };
config.stepForward = { name: `Image par image (e)`, value: simulation.stepForward };



$('#controls-play').click(() => simulation.toggle());
$('#controls-step-forward').click(() => simulation.stepForward());

document.body.onkeyup = e => (e.keyCode === 32 && simulation.toggle()) || (e.keyCode === 69 && simulation.stepForward());


const gui = new dat.GUI({ name: 'Configuration', width: 600 });
const controls = {};

for (const paramName in config) {
    const val = config[paramName];
    if (isset(val.name) && isset(val.value)) {
        controls[paramName] = val.value;
        if (typeof val.value === 'function') {
            gui.add(controls, paramName).name(val.name);
        } else {
            const params = [];
            if (typeof val.value === 'number') params.push(...(isset(val.min, val.max) ? [val.min, val.max] : [0, 1]))
            const actualGui = gui.add(controls, paramName, ...params).name(val.name).onChange(value => {
                config[paramName].value = value;
                generateEnvironment();
            });
            if (val.step) actualGui.step(val.step);
        }
    }
}
gui.close();
