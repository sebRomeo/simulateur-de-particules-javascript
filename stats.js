const stats = {
    maxLengthForDurationArray: 16,
    registerEvents(eventNames = []) {
        eventNames.push('main')
        this.lastStart = {};
        this.durations = {};
        this.percent = {};
        for (const eventName of eventNames) {
            this.lastStart[eventName] = Date.now();
            this.durations[eventName] = [0];
            this.percent[eventName] = 0.1;
            $('#stats').append(`<div>${eventName}<br><span id='stat-${eventName}'></span></div>`)
        }
        setInterval(this.updateUI.bind(this), 1000)
    },
    timeStart(eventName) {
        this.lastStart[eventName] = Date.now();
    },
    timeEnd(eventName) {
        this.durations[eventName].push(Date.now() - this.lastStart[eventName]);
        if (this.durations[eventName].length > this.maxLengthForDurationArray) this.durations[eventName].shift();
    },
    updateUI() {
        const moyMainDurationToOne = 1 / moy(this.durations.main);
        for (const eventName in this.durations) {
            if (eventName !== 'main') {
                const durations = this.durations[eventName]
                percent[eventName] = Math.round(moyMainDurationToOne * moy(durations) * 100)
                document.getElementById(`stat-${eventName}`).innerHTML = percent[eventName]
            }
        }
    }
}