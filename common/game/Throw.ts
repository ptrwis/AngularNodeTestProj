import { Vec2d } from "./vec2d";

export const g = 2.81;

export class Throw {
    constructor(
        public pos: Vec2d,
        public dir: Vec2d,
        public v0: number,
        public r: number,
        public t: number, //  throw timestamp
    ) {

    }

/**
    (
        ( ( x0 + v0*cosa*(t-t0) ) - ( x1 + v1*cosb*(t-t1) ) )^2
        +
        (
          ( y0 + v0*sina*(t-t0) - 0.5*g*(t-t0)^2 )
          -
          ( y1 + v1*sinb*(t-t1) - 0.5*g*(t-t1)^2 )
        )^2
    ) = M^2

 * @param other 
 */
    solve( other: Throw ): number {
        const
            t0 = this.t, t1 = other.t, // czasy rzutow
            v0 = this.v0, v1 = other.v0,
            α = this.dir.angle(), β = other.dir.angle(),
            x0 = this.pos.x, y0 = this.pos.y,
            x1 = other.pos.x, y1 = other.pos.y,
            r0 = this.r, r1 = other.r; // we are throwing balls
        const
            sina = Math.sin(α),
            cosa = Math.cos(α),
            sinb = Math.sin(β),
            cosb = Math.cos(β);

        const A = x0 - x1 + v1*t1*cosb - v0*t0*cosa;
        const B = v0*cosa - v1*cosb;
        const C = g*(t0-t1) + v0*sina - v1*sinb;
        const D = y0 - y1 + v0*t0*sina - v1*t1*sinb + 0.5*g*(t1**2-t0**2);
        const M = r0 + r1;
        const delta = (C**2 + B**2 ) * M**2 - B**2 * D**2 + 2*A*B*C*D - A**2 * C**2;
        if ( delta < 0 ) undefined;
        const result_t0 = - ( Math.sqrt(delta) + C*D + A*B ) / (C**2 + B**2);
        const result_t1 = + ( Math.sqrt(delta) - C*D - A*B ) / (C**2 + B**2);
        let result = [  ];
        if ( result_t0 > t0 ) result.push( result_t0 );
        if ( result_t1 > t1 ) result.push( result_t1 );
        return result.length > 0 ? result.sort()[0] : undefined;
    }

    /**
     * position of throw after from this.t to this.t + dt
     * @param dt 
     */
    count(dt: number) {
        return new Vec2d(
            this.pos.x + this.v0 * Math.cos(this.dir.angle()) * dt,
            this.pos.y + this.v0 * Math.sin(this.dir.angle()) * dt - 0.5 * g * (dt ** 2),
        );
    }

}