export class ClickCounter {

    // every click is unix timestamp in ms
    clicks: number[] = [];

    inc() {
        this.clicks.push( new Date().getTime() );
    }

    getClicksPerSecond() {
        // remove everything below 1sec
        const now = new Date().getTime();
        while ( now - this.clicks[0] > 1000 ) {
            this.clicks.shift();
        }
        return this.clicks.length;
    }

}
