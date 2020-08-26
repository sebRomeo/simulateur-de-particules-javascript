

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

//----------------------------------------
// VIEWPORT NAVIGATION
//----------------------------------------
let lastMouseDownCoord = new Vector(0, 0)
let simulationWasPlaying = false;

function mouseMoveHandler(e) {
    viewPort = lastViewportUpdate.clone()
    const actualMouseCoord = new Vector(e.clientX, e.clientY)
    const a = Vector.sub(lastMouseDownCoord, actualMouseCoord);
    viewPort.sub(a)
    redraw();
}

canvas.addEventListener("mousedown", function (e) {
    if (simulation.paused === false) {
        simulationWasPlaying = true;
        simulation.pause();
    }
    lastMouseDownCoord = new Vector(e.clientX, e.clientY)
    lastViewportUpdate = viewPort.clone();
    canvas.addEventListener("mousemove", mouseMoveHandler)
});
canvas.addEventListener("mouseup", function (e) {
    canvas.removeEventListener("mousemove", mouseMoveHandler)
    if (simulationWasPlaying) { simulation.play(); simulationWasPlaying = false; }
});
/* canvas.addEventListener("wheel", function () {
    console.log(`scrolled`)
    if (this.oldScroll > this.scrollY) {
      
    this.oldScroll = this.scrollY;
}) */


canvas.addEventListener('wheel', function (event) {
    if (event.deltaY < 0) {
        // scroll up
        zoom += 0.1;
        redraw(true);
    } else {
        // scroll down
        zoom -= 0.1;
        redraw(true);
    }
});