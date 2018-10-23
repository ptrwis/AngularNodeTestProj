import {Vec2d} from "./vec2d";
import { Segment } from "./segment";
import { Curve } from "./curve";
import { Shape } from "./shape";
import { Renderer } from "../../frontend/src/app/components/renderer/renderer.interface";

const sin = Math.sin;
const cos = Math.cos;

/**
 * throw:
 * x(t) = x0 + v0*t*cos(a)
 * y(t) = y0 + v0*t*sin(a) - (gt^2)/2
 * TODO: https://en.wikipedia.org/wiki/Newton%27s_method
 */

 /*
function distThrow() {
    const t0 = 123;
    const t1 = 321;
    return Math.sqrt(
        (
            (x0 + v0 * (t-t0) * cos(α))
            -
            (x1 + v1 * (t-t1) * cos(β))
        )^2 
        + 
        (
            (y0 + v0 * (t-t0) * sin(α) - 0.5 * g * (t-t0)^2 )
            -
            (y1 + v1 * (t-t1) * sin(β) - 0.5 * g * (t-t1)^2 )
        )^2 
    );
}

// for what t dist(center1, center2) = r1 + r2

function wmMaximaDerivationOfDist () {
    let
        t0, t1, 
        v0, v1,
        α, β,
        g, 
        y0, y1,
        x0, x1;
    return
    (
        2
        *(-v1*sin(β)+v0*sin(α)+1.0*g*(t-t1)-1.0*g*(t-t0))
        *(-(t-t1)*v1*sin(β)+(t-t0)*v0*sin(α)-y1+y0+0.5*g*(t-t1)^2-0.5*g*(t-t0)^2)
        +
        2
        *(v0*cos(α)-v1*cos(β))
        *(-(t-t1)*v1*cos(β)+(t-t0)*v0*cos(α)-x1+x0)
    )
    /
    (
        2
        *sqrt(
            (-(t-t1)*v1*sin(β)+(t-t0)*v0*sin(α)-y1+y0+0.5*g*(t-t1)^2-0.5*g*(t-t0)^2)^2
            +
            (-(t-t1)*v1*cos(β)+(t-t0)*v0*cos(α)-x1+x0)^2
        )
    );
}
*/

function timeForZeroNominator(){
    // t = (2*t1*v1^2*sin(β)^2+((-2*t1-2*t0)*v0*v1*sin(α)-2*v1*y1+2*v1*y0+(3*g*t1^2-2*g*t0*t1-g*t0^2)*v1)*sin(β)-2*t1*v1^2*cos(β)^2+((2*t1+2*t0)*v0*v1*cos(α)+2*v1*x1-2*v1*x0)*cos(β)+2*t0*v0^2*sin(α)^2+(2*v0*y1-2*v0*y0+(-g*t1^2-2*g*t0*t1+3*g*t0^2)*v0)*sin(α)-2*t0*v0^2*cos(α)^2+(2*v0*x0-2*v0*x1)*cos(α)+(2*g*t0-2*g*t1)*y1+(2*g*t1-2*g*t0)*y0+g^2*t1^3-g^2*t0*t1^2-g^2*t0^2*t1+g^2*t0^3)/(2*v1^2*sin(β)^2+((4*g*t1-4*g*t0)*v1-4*v0*v1*sin(α))*sin(β)-2*v1^2*cos(β)^2+4*v0*v1*cos(α)*cos(β)+2*v0^2*sin(α)^2+(4*g*t0-4*g*t1)*v0*sin(α)-2*v0^2*cos(α)^2+2*g^2*t1^2-4*g^2*t0*t1+2*g^2*t0^2);
    let
        t0, t1, 
        v0, v1,
        α, β,
        g, 
        y0, y1,
        x0, x1;
    const sina = Math.sin(α);
    const sinb = Math.sin(β);
    const cosa = Math.cos(α);
    const cosb = Math.cos(β);
    return (2*t1*v1^2*sinb^2+((-2*t1-2*t0)*v0*v1*sina-2*v1*y1+2*v1*y0+(3*g*t1^2-2*g*t0*t1-g*t0^2)*v1)*sinb-2*t1*v1^2*cosb^2+((2*t1+2*t0)*v0*v1*cosa+2*v1*x1-2*v1*x0)*cosb+2*t0*v0^2*sina^2+(2*v0*y1-2*v0*y0+(-g*t1^2-2*g*t0*t1+3*g*t0^2)*v0)*sina-2*t0*v0^2*cosa^2+(2*v0*x0-2*v0*x1)*cosa+(2*g*t0-2*g*t1)*y1+(2*g*t1-2*g*t0)*y0+g^2*t1^3-g^2*t0*t1^2-g^2*t0^2*t1+g^2*t0^3)/(2*v1^2*sinb^2+((4*g*t1-4*g*t0)*v1-4*v0*v1*sina)*sinb-2*v1^2*cosb^2+4*v0*v1*cosa*cosb+2*v0^2*sina^2+(4*g*t0-4*g*t1)*v0*sina-2*v0^2*cosa^2+2*g^2*t1^2-4*g^2*t0*t1+2*g^2*t0^2);
}

/**
 * 
 */
function ddd() {
    let
        t0, t1, 
        v0, v1,
        α, β,
        g, 
        y0, y1,
        x0, x1;
    const
    X =  8*t1*v1^2*sin(β)^2+((-8*t1-8*t0)*v0*v1*sin(α)-8*v1*y1+8*v1*y0+(12*g*t1^2-8*g*t0*t1-4*g*t0^2)*v1)*sin(β)+8*t1*v1^2*cos(β)^2+((-8*t1-8*t0)*v0*v1*cos(α)-8*v1*x1+8*v1*x0)*cos(β)+8*t0*v0^2*sin(α)^2+(8*v0*y1-8*v0*y0+(-4*g*t1^2-8*g*t0*t1+12*g*t0^2)*v0)*sin(α)+8*t0*v0^2*cos(α)^2+(8*v0*x1-8*v0*x0)*cos(α)+(8*g*t0-8*g*t1)*y1+(8*g*t1-8*g*t0)*y0+4*g^2*t1^3-4*g^2*t0*t1^2-4*g^2*t0^2*t1+4*g^2*t0^3 ,

    Y = 
    (   - 4 g^2 t0^3 
        + 4 g^2 t1 t0^2 
        - 12 g v0 sin(α) t0^2 
        + 4 g v1 sin(β) t0^2 
        + 4 g^2 t1^2 t0 
        - 8 v0^2 cos^2(α) t0 
        - 8 v0^2 sin^2(α) t0 
        + 8 g y0 t0 
        - 8 g y1 t0 
        + 8 v0 v1 cos(α) cos(β) t0 
        + 8 g t1 v0 sin(α) t0 
        + 8 g t1 v1 sin(β) t0 
        + 8 v0 v1 sin(α) sin(β) t0 
        - 4 g^2 t1^3 
        - 8 t1 v1^2 cos^2(β) 
        - 8 t1 v1^2 sin^2(β) 
        - 8 g t1 y0 
        + 8 g t1 y1 
        + 8 v0 x0 cos(α) 
        - 8 v0 x1 cos(α) 
        - 8 v1 x0 cos(β) 
        + 8 v1 x1 cos(β) 
        + 8 t1 v0 v1 cos(α) cos(β) 
        + 4 g t1^2 v0 sin(α) 
        + 8 v0 y0 sin(α) 
        - 8 v0 y1 sin(α) 
        - 12 g t1^2 v1 sin(β) 
        - 8 v1 y0 sin(β) 
        + 8 v1 y1 sin(β) 
        + 8 t1 v0 v1 sin(α) sin(β)
    )^2  - 4 * (
          4 t0^2 g^2 
        + 4 t1^2 g^2 
        - 8 t0 t1 g^2 
        + 8 t0 v0 sin(α) g 
        - 8 t1 v0 sin(α) g 
        - 8 t0 v1 sin(β) g 
        + 8 t1 v1 sin(β) g 
        + 4 v0^2 cos^2(α) 
        + 4 v1^2 cos^2(β) 
        + 4 v0^2 sin^2(α) 
        + 4 v1^2 sin^2(β) 
        - 8 v0 v1 cos(α) cos(β) 
        - 8 v0 v1 sin(α) sin(β)
    ) * (
          g^2 t0^4 
        + 4 g v0 t0^3 sin(α)  
        - 2 g^2 t1^2 t0^2 
        + 4 v0^2 t0^2 cos(α)^2 
        + 4 v0^2 t0^2 sin(α)^2 
        - 4 g y0 t0^2 + 4 g y1 t0^2 
        - 4 g t1 v1 sin(β) t0^2 
        - 8 v0 x0 cos(α) t0 
        + 8 v0 x1 cos(α) t0 
        - 8 t1 v0 v1 cos(α) cos(β) t0 
        - 4 g t1^2 v0 sin(α) t0 
        - 8 v0 y0 sin(α) t0 
        + 8 v0 y1 sin(α) t0 
        - 8 t1 v0 v1 sin(α) sin(β) t0 
        + g^2 t1^4 
        - 4 r^2 
        - 4 r0^2 
        + 4 x0^2 
        + 4 x1^2 
        + 4 y0^2 
        + 4 y1^2 
        + 4 t1^2 v1^2 cos(β)^2 
        + 4 t1^2 v1^2 sin(β)^2
        - 8 r r0 
        - 8 x0 x1 
        + 4 g t1^2 y0 
        - 4 g t1^2 y1 
        - 8 y0 y1 
        + 8 t1 v1 x0 cos(β) 
        - 8 t1 v1 x1 cos(β) 
        + 4 g t1^3 v1 sin(β) 
        + 8 t1 v1 y0 sin(β) 
        - 8 t1 v1 y1 sin(β)
    ),

    Z = 8*v1^2*sin(β)^2+((16*g*t1-16*g*t0)*v1-16*v0*v1*sin(α))*sin(β)+8*v1^2*cos(β)^2-16*v0*v1*cos(α)*cos(β)+8*v0^2*sin(α)^2+(16*g*t0-16*g*t1)*v0*sin(α)+8*v0^2*cos(α)^2+8*g^2*t1^2-16*g^2*t0*t1+8*g^2*t0^2;

    return
    {
        ( X - sqrt( Y ) ) / Z,
        ( X + sqrt( Y ) ) / Z
    };
}

 /**
  * round move:
  * x0 + r*sin(wt+f0)
  * y0 + r*cos(wt+f0)
  */

function distRoundMove(){
    let x0, y0, 
        x1, y1, 
        // w0, w1,
        w,
        t, t0, t1, 
        f0, f1, 
        r0, r1;
    return Math.sqrt( 
        ( (x0 + r0*sin(w*(t-t0)+f0)) - (x1 + r1*sin(w*(t-t1)+f1)) )^2 
        + 
        ( (y0 + r0*cos(w*(t-t0)+f0)) - (y1 + r1*cos(w*(t-t1)+f1)) )^2
    );
}

// dist by t
function derivativeDistRoundMove(){
    let x0, y0, 
        x1, y1, 
        w, 
        t, t0, t1, 
        f0, f1, 
        r0, r1;
    return 2 * w * (
        -(y0 - y1) * (r0 * sin(f0 + t * w - t0 * w) - r1 * sin(f1 + t * w - t1 * w)) 
        + r0 * (x0 - x1) * cos(f0 + w * (t - t0)) 
        + r1 * (x1 - x0) * cos(f1 + t * w - t1 * w)
    );
}



/**
 * 
 */
class Cursor {
    constructor(
        public pos: Vec2d,
        public dir: Vec2d
    ) {}
}


/**
 * 
 */
class Player {
    snake: AbstractMove[];
    pullUp() {}
    pushDown() {}
    crashTest( timestamp: number, other: Player ) {
        const crash = crashTest( this, other, timestamp);
        if ( crash === undefined ) return undefined;
        return crash.when < timestamp ? crash : null;
    };
    applyEvent( move: AbstractMove ) {
        this.last().dt = move.timestamp - this.last().timestamp;
        move.snap = this.last().state( move.timestamp );
        this.snake.push( move );
    }
    last = () => this.snake[ this.snake.length - 1 ];
}

class Snapshot {
    timestamp: number;
    event: AbstractMove;
    state: Cursor;
}

/**
 * Now AbstractMove is like snapshot.
 * r, v, w are here because they can change per move.
 * When player takes 'speed' item a new move is being created
 * ?-> AbstractState, TurningLeft, TurningRight, MovingForward (?)
 */
abstract class AbstractMove {
    snap: Cursor;
    dt: number = null; // dt is being set when new move arrives
    v = 1.0;
    r = 10.0;
    constructor(
        public timestamp: number
    ) {}
    setVelocity = ( v: number ) => this.v = v;
    setRadious = ( r: number ) => this.r = r;
    w = () => this.v / this.r;
    abstract state( timestamp: number );
    abstract intoShape( timestamp: number );
    // This sucks, as we must assume that 'pos' lies on the path of this move. Should be accessible only by 'crashTest' function.
    abstract timeToReach( pos: Vec2d );
    abstract draw( timestamp: number, r : Renderer ); // Breaking SRP works for me.
}
/**
 * 
 */
class TurnLeftMove extends AbstractMove {
    centerOfRotation = ( ) => this.snap.pos.add( this.snap.dir.normal().mul( - this.r) );
    state( timestamp: number ) {
        const dt = timestamp - this.timestamp;
        const anchor = this.centerOfRotation( );
        const newPos = this.snap.pos.rotAround( - this.w() * dt, anchor);
        const newDir = newPos.sub(anchor).normal().mul( -1 );
        return new Cursor(newPos, newDir);
    }
    draw( timestamp: number, r: Renderer ) {
        const dt = timestamp - this.timestamp;
        r.drawCurve( this.intoShape(dt) );
    }
    timeToReach( pos: Vec2d ) {
        const center = this.centerOfRotation( );
        const a = this.snap.pos.angleBetween(center);
        const b = pos.angleBetween(center);
        return Math.abs(a - b) / this.w();
    }
    intoShape( timestamp: number ) {
        // if BRUSH_STATE == UP return null;
        const dt = this.dt !== null ? this.dt : timestamp - this.timestamp ;
        const anchor = this.centerOfRotation( );
        let angleStart = this.snap.pos.angleBetween(anchor);
        let angleEnd = angleStart - this.w() * dt;
        // counter clock-wise to clock-wise
        [angleStart, angleEnd] = [angleEnd, angleStart];
        return new Curve( anchor, this.r, angleStart, angleEnd  );
    }
}
/**
 * 
 */
class TurnRightMove extends AbstractMove {
    centerOfRotation = ( ) => this.snap.pos.add( this.snap.dir.normal().mul( + this.r) );
    state( timestamp: number ) {
        const dt = timestamp - this.timestamp;
        const anchor = this.centerOfRotation( );
        const newPos = this.snap.pos.rotAround( + this.w() * dt, anchor);
        const newDir = newPos.sub(anchor).normal().mul( +1 );
        return new Cursor(newPos, newDir);
    }
    draw( timestamp: number, r: Renderer) {
        const dt = timestamp - this.timestamp;
        r.drawCurve( this.intoShape(dt) );
    }
    timeToReach( pos: Vec2d ) {
        const center = this.centerOfRotation( );
        const a = this.snap.pos.angleBetween(center);
        const b = pos.angleBetween(center);
        return Math.abs(a - b) / this.w();
    }
    intoShape( timestamp: number ) {
        const dt = this.dt !== null ? this.dt : timestamp - this.timestamp ;
        const anchor = this.centerOfRotation( );
        const angleStart = this.snap.pos.angleBetween(anchor);
        const angleEnd = angleStart + this.w() * dt;
        return new Curve( anchor, this.r, angleStart, angleEnd );
    }
}
/**
 * 
 */
class Str8AheadMove extends AbstractMove {
    state( timestamp: number ) {
        const dt = timestamp - this.timestamp;
        const newPos = this.snap.pos.add(this.snap.dir.mul(this.v * dt));
        return new Cursor(newPos, this.snap.dir);
    }
    draw( timestamp: number, r: Renderer) {
        const dt = timestamp - this.timestamp;
        r.drawSegment( this.intoShape(dt) );
    }
    timeToReach = ( pos: Vec2d ) => this.v / this.snap.pos.dist( pos );
    intoShape( timestamp: number ) {
        const dt = this.dt !== null ? this.dt : timestamp - this.timestamp ;
        return new Segment( 
            this.snap.pos, 
            this.snap.pos.add(this.snap.dir.mul(this.v * dt))
        );
    }
}

/**
 * 
 */
export class Crash {
    constructor(
        public whoDied: Player,
        public whoKilled: Player,
        public when: number,
        public place: Vec2d
    ) {
    }
}

export const thr0w = ( start: Cursor, dt: number ) => new Vec2d(
    start.pos.x + 1.0 * Math.cos( start.dir.x ) * dt,
    start.pos.y + 1.0 * Math.sin( start.dir.x ) * dt - 0.5 * 9.81 * dt**2
);

/**
 * Counts first (in time) intersection of two moves.
 * Returns Crash or undefined.
 * TODO: we can here check collisions with tail
 * 
 * @param ps1 
 * @param ps2 
 * @param timestamp 
 */
// export function crashTest( ps1: PlayerSnapshot, ps2: PlayerSnapshot, timestamp: number ): Crash {
export function crashTest( p1: Player, p2: Player, timestamp: number ): Crash {
    // if ps1 is Circle and dt >= Math.PI / p1.head.move.w(), then we have a 'self-crash'

    // head of p1 with whole p2:
    p2.snake.map( p2move =>
        {
            const is = intersections(
                p1.last().intoShape( timestamp ),
                p2move.intoShape( timestamp )
            );
            return is.length > 0 ? {a: is, move: p2move} : null;
        }
    )
    // head of p2 with whole p1:
    /* .concat(
        p1.snake.map( p1move =>
            intersections(
                p2.last().intoShape( timestamp ),
                p1move.intoShape( timestamp )
            )
        )
    ) */
    .filter( k => k !== null )
    // .reduce( (x,y) => x.concat(y), [] ) //flatMap
    .map( i => {
        const t1 = p1.last().timeToReach(i.a[0]);
        const t2 = i.move.timeToReach(i.a[0]);
        return new Crash( // this is what we map 'i' into
            t1 < t2 ? p2 : p1, 
            t1 < t2 ? p1 : p2, 
            t1 < t2 ? t1 : t2,
            i.a[0]
        );
    } )
    .sort( (a, b) => a.when - b.when )
    .shift();

    /*
    return intersections(
        p2.last().intoShape( timestamp ),
        p1.last().intoShape( timestamp )
    )
    .map( i => { 
        const t1 = p1.last().timeToReach(i);
        const t2 = p2.last().timeToReach(i);
        return new Crash( // this is what we map 'i' into
            t1 < t2 ? p2 : p1, 
            t1 < t2 ? p1 : p2, 
            t1 < t2 ? t1 : t2,
            i
        );}
    )
    .sort( (a, b) => a.when - b.when )
    .shift(); // take first
    */
}

/**
 * 
 * @param s1 
 * @param s2 
 */
function intersections( s1: Shape, s2: Shape ): Vec2d[] {
    if ( s1 instanceof Curve && s2 instanceof Curve )
        return intersectionCurveCurve(s1 as Curve, s2 as Curve);
    if ( s1 instanceof Segment && s2 instanceof Segment )
        return intersectionSegmentSegment(s1 as Segment, s2 as Segment);
    if ( s1 instanceof Segment && s2 instanceof Curve )
        return intersectionCurveSegment(s2 as Curve, s1 as Segment);
    if ( s1 instanceof Curve && s2 instanceof Segment )
        return intersectionCurveSegment(s1 as Curve, s2 as Segment);
    throw new Error( 'unhandled type / combination' );
}

/**
 * TODO: maybe split to Circle-Line and specialize to Curve / Segment later
 * @param c 
 * @param s 
 */
export function intersectionCurveSegment( c: Curve, s: Segment ): Vec2d[] {
    const start = s.start.sub(c.center);
    const end = s.end.sub(c.center);
    // 1. find intercetion of line and full circle
    // http://mathworld.wolfram.com/Circle-LineIntersection.html
    const r = c.radious;
    const x1 = start.x, y1 = start.y, 
          x2 = end.x,   y2 = end.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr = ( dx**2 + dy**2 )**0.5;
    const D = x1 * y2 - x2 * y1;
    const discriminant = r**2 * dr**2 - D**2;
    if ( discriminant < 0 ) { // no intersection
        return [];
    } else if ( discriminant < 0.000001 ) { // tangent
        const x = (D * dy) / dr**2;
        const y = (-D * dx) / dr**2;
        let p = new Vec2d(x,y);
        // move back
        p = p.add(c.center);
        return c.isInDomain(p) && s.isInDomain(p) ? [p] : [];
    } else if ( discriminant > 0.000001 ) { // intersection
        // p1
        const x1 = (D * dy + Math.sign(dy) * dx * discriminant**0.5 ) / dr**2;
        const y1 = (-D * dx + Math.abs(dy) * discriminant**0.5 ) / dr**2;
        let p1 = new Vec2d(x1,y1);
        // p2
        const x2 = (D * dy - Math.sign(dy) * dx * discriminant**0.5 ) / dr**2;
        const y2 = (-D * dx - Math.abs(dy) * discriminant**0.5 ) / dr**2;
        let p2 = new Vec2d(x2,y2);
        // move back
        p1 = p1.add(c.center);
        p2 = p2.add(c.center);
        // check domain
        let result = [];
        if ( c.isInDomain(p1) && s.isInDomain(p1) ) {
            result.push(p1);
        }
        if ( c.isInDomain(p2) && s.isInDomain(p2) ) {
            result.push(p2);
        }
        return result;
    }
}

/**
 * 
 * @param c_1 
 * @param c_2 
 */
export function intersectionCurveCurve( c_1: Curve, c_2: Curve ): Vec2d[] {
    const c1 = c_1.copy();
    const c2 = c_2.copy();
    //
    const d = c1.center.dist(c2.center);
    const r = c1.radious;
    const R = c2.radious;
    if ( d > r + R ) {
        return [];
    }
    // move both circles so that one of them will lie on (0,0)
    const origin = c1.center;
    c1.center = c1.center.sub(origin); // c1.move( -origin )
    c2.center = c2.center.sub(origin);
    // rotate second one to lie on OX. First doesn't change 'cus already lies on (0,0)
    const angle = c2.center.angle();
    c2.center = c2.center.rot( - angle );
    // http://mathworld.wolfram.com/Circle-CircleIntersection.html
    const x = (d**2 - R**2 + r**2) / (2*d);
    const y1 = + ((r**2 - x**2)**0.5);
    const y2 = - ((r**2 - x**2)**0.5);
    let p1 = new Vec2d(x, y1);
    let p2 = new Vec2d(x, y2);
    // rotate and translate results back
    p1 = p1.rot(+angle).add(origin);
    p2 = p2.rot(+angle).add(origin);
    // Check domain. Rather than translating c1 and c2 back, use original c_1 and c_2
    let result = [];
    if ( c_1.isInDomain(p1) && c_2.isInDomain(p1) ) {
        result.push(p1);
    }
    if ( c_1.isInDomain(p2) && c_2.isInDomain(p2) ) {
        result.push(p2);
    }
    return result;
}

/**
 * 
 * @param s1 
 * @param s2 
 */
export function intersectionSegmentSegment( s1: Segment, s2: Segment ): Vec2d[] {
    const a1 = s1.a();
    const a2 = s2.a();
    /* if( a1 - a2 < 0.000001 ) {
        return [];
    } */
    const b1 = s1.b(a1);
    const b2 = s2.b(a2);
    const x = (b2 - b1)/(a1 - a2);
    const y = a1 * x + b1;
    const p = new Vec2d(x, y);
    return s1.isInDomain(p) && s2.isInDomain(p) ? [p] : [];
}