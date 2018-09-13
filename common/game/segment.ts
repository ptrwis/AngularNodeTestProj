import { Shape } from "./shape";

import { Vec2d } from "./vec2d";

export class Segment implements Shape {
    constructor( public start: Vec2d, 
                 public end: Vec2d ) {
                     
    }

    copy() { return new Segment(this.start.copy(), this.end.copy()); }

    //a() { return this.end.sub(this.start).angle(); }
    a() { return (this.end.y-this.start.y)/(this.end.x-this.start.x); }

    b(a:number) { return this.start.y - a * this.start.x; }

    isInDomain( p: Vec2d ) {
        const xs = [ +this.start.x, +this.end.x ].sort( (a, b) => a - b );
        const ys = [ +this.start.y, +this.end.y ].sort( (a, b) => a - b );
        return (xs[0] <= p.x && p.x <= xs[1]) && (ys[0] <= p.y && p.y <= ys[1]);
    }

}