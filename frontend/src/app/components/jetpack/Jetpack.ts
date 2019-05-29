import { Vec2d } from '../../../../../common/game/vec2d';
import { g } from '../../../../../common/game/Throw';
import { solveP4 } from './P4Solver';


export class Jetpack {

    r: number; // radious
    // m: number; // mass

    a: Vec2d;

    // jetpack (was) at position pos, (v,α) at time t
    t: number;
    pos: Vec2d;
    v: Vec2d;

    // force: left/right/none

    /**
     * ay = 0.5((F/m)cosα -g)
     * by = 0.5((F/m)cosβ -g)
     * 
     * ax = 0.5((F/m)sinα)
     * bx = 0.5((F/m)sinβ)
     * 
     * vax = Va cos(a)
     * vay = Va sin(a)
     * 
     * vbx = Vb cos(b)
     * vby = Vb sin(b)
     * 
     * M = r1 + r2
     * 
            (i):
        (
            (
                ( x0 + v0*cosa*(t-t0) + 0.5*ax*(t-t0)^2 )
                -
                ( x1 + v1*cosb*(t-t1) + 0.5*bx*(t-t0)^2 )
            )^2
            +
            (
                ( y0 + v0*sina*(t-t0) - 0.5*ay*(t-t0)^2 )
                -
                ( y1 + v1*sinb*(t-t1) - 0.5*by*(t-t1)^2 )
            )^2
        ) = M^2
    
        ... becomes ... (ii):
    
        (
            (   -- substracting and grouping we got square function, still inside (^2)
                -- this is part "x"
                ( x0 + vax*(t-t0) + ax*(t-t0)^2 )
                -
                ( x1 + vbx*(t-t1) + bx*(t-t0)^2 )
            )^2
            +
            (   -- this is part "y"
                ( y0 + vay*(t-t0) - ay*(t-t0)^2 )
                -
                ( y1 + vby*(t-t1) - by*(t-t1)^2 )
            )^2
        ) = M^2
    
            (iii):
        (
            (         x01 + vdx*(t-t0) + dx*(t-t0)^2 )^2
            --"x":     c  +    bx      + ax^2
            +
            (         y01 + vdy*(t-t0) - dy*(t-t0)^2 )^2
            --"y":     c  +    bx      + ax^2
        ) = M^2
        
        */


    solve(p2: Jetpack) {

        const p1 = this;

        // "x" i "y" to te oznaczone w (iii)

        // x:
        const ax = p1.a.x - p2.a.y
        const bx = 2 * (p2.a.x * p2.t - p1.a.x * p1.t) + p1.v.x - p2.v.x
        const cx = p1.pos.x - p2.pos.x + p1.v.x * p1.t + p2.v.x * p2.t + p1.a.x * p1.t ** 2 - p2.a.x * p2.t ** 2

        // y:
        const ay = (p1.a.y - g) - (p2.a.y - g)
        const by = 2 * ((p2.a.y - g) * p2.t - (p1.a.y - g) * p1.t) + p1.v.y - p2.v.y;
        const cy = p1.pos.y - p2.pos.y + p1.v.y * p1.t + p2.v.y * p2.t
            + (p1.a.y - g) * p1.t ** 2 - (p2.a.y - g) * p2.t ** 2

        const r1 = 10,
            r2 = 15;

        const solutions =
            solveP4({
                a: (ax ** 2) + (ay ** 2),
                b: (2 * ax * bx) + (2 * ay * by),
                c: (2 * ax * cx + bx ** 2) + (2 * ay * cy + by ** 2),
                d: (2 * bx * cx) + (2 * by * cy),
                e: (cx ** 2) + (cy ** 2)
                    - (r1 + r2) ** 2 // M
            })
                .filter(x => x > p1.t && x > p2.t);

        return solutions;

    }

}

/**
 * position of jetpack at this.t after dt
 * @param dt
 */
/* count(dt: number) {
    return new Vec2d(
        this.pos.x + this.v * Math.cos(this.dir.angle()) * dt,
        this.pos.y + this.v * Math.sin(this.dir.angle()) * dt - 0.5 * g * (dt ** 2),
    );
} */
