const stats = {
    maxLengthForDurationArray: 16,
    lastStart: {},
    durations: {},
    lastTimeStamp: performance.now(),
    percent: {},
    fps: [1],
    registerEvents(...eventNames) {
        eventNames.push('main')
        for (const eventName of eventNames) {
            this.lastStart[eventName] = Date.now();
            this.durations[eventName] = [0];
            this.percent[eventName] = 0.1;
            if (eventName !== 'main') $('#stats').append(`<div>${eventName}<br><span id='stat-${eventName}'></span></div>`)
        }
        setInterval(this.updateUI.bind(this), 1000)
    },
    timeStart(eventName, timeStamp = performance.now()) {
        this.lastStart[eventName] = timeStamp;
    },
    timeEnd(eventName) {
        const msSinceLastFrame = performance.now() - this.lastStart[eventName];
        if (eventName === 'main') {
            this.fps.push(Math.round(1000 / msSinceLastFrame));
            if (this.fps.length > this.maxLengthForDurationArray) this.fps.shift();
        }
        this.durations[eventName].push(msSinceLastFrame);
        if (this.durations[eventName].length > this.maxLengthForDurationArray) this.durations[eventName].shift();
    },
    updateUI() {
        if (!simulation.paused) {
            const moyMainDurations = Math.max(1, moy(this.durations.main));
            const moyMainDurationToOne = 1 / moyMainDurations;
            for (const eventName in this.durations) {
                if (eventName !== 'main') {
                    const durations = this.durations[eventName];
                    const percent = Math.round(moyMainDurationToOne * moy(durations) * 100);
                    document.getElementById(`stat-${eventName}`).innerHTML = percent;
                } else {
                    // main MS
                    document.getElementById(`stat-${eventName}`).innerHTML = Math.round(moyMainDurations * 100) / 100;
                }
            }
            document.getElementById(`stat-fps`).innerHTML = Math.round(moy(this.fps));
        }
    }
}