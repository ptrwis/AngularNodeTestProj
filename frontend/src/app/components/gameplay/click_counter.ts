export class ClickCounter {

    // every click is unix timestamp in ms
    clicks: number[] = [];
    max = 0;

    inc() {
        this.clicks.push( new Date().getMilliseconds() );
    }

    getClicksPerSecond() {
        // remove everything below 1sec
        const now = new Date().getMilliseconds();
        this.clicks.s
    }

    getMaxClicksPerSecond() {

    }

}
