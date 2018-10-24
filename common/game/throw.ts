import { Vec2d } from "./vec2d";

export class Throw {
    constructor(
        public pos: Vec2d,
        public dir: Vec2d,
        public v0: number,
    ) {

    }
    timestamp: number;
    // Returns timestamp of the moment when distance between 'this' and 'other' is minimal, earliest in time.
    dist( other: Throw, at: number ): number | undefined {
        // 'at' is timestamp at which we count the distance.
        if ( at < this.timestamp || at < other.timestamp )
            return undefined;
        return 0;
    }
    count(dt: number) {
        return new Vec2d(
            this.pos.x + this.v0 * Math.cos(this.dir.angle()) * dt,
            this.pos.y + this.v0 * Math.sin(this.dir.angle()) * dt - 0.5 * 9.81 * (dt ** 2),
        );
    }
}