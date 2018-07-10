import { Vec2d } from './vec2d';


class Segment {

    v: number = 1.0;
    time: number;
    end: Vec2d;

    constructor(public start: Vec2d, public dir: Vec2d) {

    }

    between(p: number, a: number, b: number): boolean {
        const sorted = [a, b].sort();
        return p >= sorted[0] && p <= sorted[1];
    }

    crosscut(other: Segment): Vec2d {
        // [this.start, this.end] x [other.start, other.end]
        // say who hit who (who's dead)
        const a1 = (this.end.x - this.start.x) / (this.end.y - this.start.y);
        const a2 = (other.end.x - other.start.x) / (other.end.y - other.start.y);
        // print( 'a1: ${a1},\n a2: ${a2}' );
        if (a2 - a1 < 0.001)
            return null;
        const b1 = this.start.y - a1 * this.start.x;
        const b2 = other.start.y - a2 * other.start.x;
        const xcross = (b1 - b2) / (a2 - a1);
        const ycross = a1 * xcross + b1;
        // check domain
        if (this.between(xcross, this.start.x, this.end.x) &&
            this.between(xcross, other.start.x, other.end.x) &&
            this.between(ycross, this.start.x, this.end.x) &&
            this.between(ycross, other.start.x, other.end.x)) {
            return new Vec2d(xcross, ycross);
        } else {
            // print( 'cross point:\n ${xcross},\n ${ycross}' );
            return null;
        }
    }

}