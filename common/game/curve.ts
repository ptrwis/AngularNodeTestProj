import { Vec2d } from "./vec2d";
import { Shape } from "./shape";

export class Curve implements Shape {
    constructor( public center: Vec2d,
                 public radious: number,
                 public angleStart: number,
                 public angleEnd: number) {
    }

    copy = () => new Curve(this.center.copy(), this.radious, this.angleStart, this.angleEnd);

    isInDomain( p: Vec2d ) {
        const a = p.angleBetween(this.center);
        const start = this.normalizeAngle(this.angleStart);
        const end = this.normalizeAngle(this.angleEnd);
        if( start < end )
            return start <= a && a <= end;
        else 
            return !(end <= a && a <= start);
    }

    // util
    normalizeAngle( rad: number ) {
        rad %= (2*Math.PI);
        return rad >= 0 ? rad : rad += 2 * Math.PI;
    }

    length = () => (this.angleStart - this.angleEnd) * this.radious;

}