import {Vec2d} from "./vec2d";
import { Segment } from "./segment";
import { Curve } from "./curve";
import { Shape } from "./shape";
import { Renderer } from "../../frontend/src/app/components/renderer/renderer.interface";

/*
main(){
    handeEvent( countClosestEvent() );
}
game loop:
function handleEvent( event ) {
    setTimeout( () => {
        // handle
        event = countClosestEvent();
        handeEvent( event );
    },
    event.timestamp - now )
}
*/

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
class PlayerSnapshot {
    constructor(
        public head: Cursor,
        public move: AbstractMove,
        public timestamp: number
    ){
        // ...
    }
}

/**
 * 
 */
class Player {
    head: PlayerSnapshot;
    tail: Shape[]; // or PlayerSnapshot[]
    snake: PlayerSnapshot[];
    pullUp() {}
    pushDown() {}
    crashTest( timestamp: number, other: Player ) {
        const crash = crashTest( this, other, timestamp);
        if ( crash === undefined ) return undefined;
        return crash.when < timestamp ? crash : null;
    };
    applyEvent( timestamp: number, move: AbstractMove ) {
        const dt = timestamp - this.head.timestamp;
        // 0. new head
        const newHead = new PlayerSnapshot(
            this.head.move.state( dt ),
            move,
            timestamp
        );
        // 1. add head to tail
        this.tail.push( this.head.move.intoShape( dt ) );
        // 2. set new head
        this.head = newHead;
    }
}

/**
 * r, v, w are here because they can change per move.
 * When player takes 'speed' item a new move is being created
 * ?-> AbstractState, TurningLeft, TurningRight, MovingForward (?)
 */
abstract class AbstractMove {
    v = 1.0; // linear velocity (move outside or into AbstractMove)
    r = 10.0;
    constructor(
        public snap: PlayerSnapshot
    ) {}
    setVelocity = ( v: number ) => this.v = v;
    setRadious = ( r: number ) => this.r = r;
    w = () => this.v / this.r;
    abstract state( timestamp: number );
    abstract intoShape( timestamp: number );
    // This sucks, as we must assume that 'pos' lies on the path of this move. Should be accessible only by 'crashTest' function.
    abstract timeToReach( pos: Vec2d );
    abstract draw( timestamp: number, r : Renderer ); // Breaking SRP works for me. TODO: set Renderer globally or make singleton
}
/**
 * 
 */
class TurnLeftMove extends AbstractMove {
    centerOfRotation = ( ) => this.snap.head.pos.add( this.snap.head.dir.normal().mul( - this.r) );
    state( timestamp: number ) {
        const dt = timestamp - this.snap.timestamp;
        const anchor = this.centerOfRotation( );
        const newPos = this.snap.head.pos.rotAround( - this.w() * dt, anchor);
        const newDir = newPos.sub(anchor).normal().mul( -1 );
        return new Cursor(newPos, newDir);
    }
    draw( timestamp: number, r: Renderer ) {
        const dt = timestamp - this.snap.timestamp;
        r.drawCurve( this.intoShape(dt) );
    }
    timeToReach( pos: Vec2d ) {
        const center = this.centerOfRotation( );
        const a = this.snap.head.pos.angleBetween(center);
        const b = pos.angleBetween(center);
        return Math.abs(a - b) / this.w();
    }
    intoShape( timestamp: number ) {
        // if BRUSH_STATE == UP return null;
        const dt = timestamp - this.snap.timestamp;
        const anchor = this.centerOfRotation( );
        let angleStart = this.snap.head.pos.angleBetween(anchor);
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
    centerOfRotation = ( ) => this.snap.head.pos.add( this.snap.head.dir.normal().mul( + this.r) );
    state( timestamp: number ) {
        const dt = timestamp - this.snap.timestamp;
        const anchor = this.centerOfRotation( );
        const newPos = this.snap.head.pos.rotAround( + this.w() * dt, anchor);
        const newDir = newPos.sub(anchor).normal().mul( +1 );
        return new Cursor(newPos, newDir);
    }
    draw( timestamp: number, r: Renderer) {
        const dt = timestamp - this.snap.timestamp;
        r.drawCurve( this.intoShape(dt) );
    }
    timeToReach( pos: Vec2d ) {
        const center = this.centerOfRotation( );
        const a = this.snap.head.pos.angleBetween(center);
        const b = pos.angleBetween(center);
        return Math.abs(a - b) / this.w();
    }
    intoShape( timestamp: number ) {
        const dt = timestamp - this.snap.timestamp;
        const anchor = this.centerOfRotation( );
        const angleStart = this.snap.head.pos.angleBetween(anchor);
        const angleEnd = angleStart + this.w() * dt;
        return new Curve( anchor, this.r, angleStart, angleEnd );
    }
}
/**
 * 
 */
class Str8AheadMove extends AbstractMove {
    state( timestamp: number ) {
        const dt = timestamp - this.snap.timestamp;
        const newPos = this.snap.head.pos.add(this.snap.head.dir.mul(this.v * dt));
        return new Cursor(newPos, this.snap.head.dir);
    }
    draw( timestamp: number, r: Renderer) {
        const dt = timestamp - this.snap.timestamp;
        r.drawSegment( this.intoShape(dt) );
    }
    timeToReach = ( pos: Vec2d ) => this.v / this.snap.head.pos.dist( pos );
    intoShape( timestamp: number ) {
        const dt = timestamp - this.snap.timestamp;
        return new Segment( 
            this.snap.head.pos, 
            this.snap.head.pos.add(this.snap.head.dir.mul(this.v * dt))
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

    // test p1.head vs p2.tail
    p2.tail.map( p2shape =>
        intersections(
            p1.head.move.intoShape( timestamp ),
            p2shape
        )
    )
    .filter( k => k.length !== 0 )
    .reduce( (x,y) => x.concat(y), [] ) //flatMap
    .map( i => {
        const t = p1.head.move.timeToReach(i);
        return new Crash( p1, p2, t, i);
    } )
    .sort( (a, b) => a.when - b.when )
    .shift();


    return intersections(
        p2.head.move.intoShape( timestamp ),
        p1.head.move.intoShape( timestamp )
    )
    .map( i => { 
        const t1 = p1.head.move.timeToReach(i);
        const t2 = p2.head.move.timeToReach(i);
        return new Crash( // this is what we map 'i' into
            t1 < t2 ? p2 : p1, 
            t1 < t2 ? p1 : p2, 
            t1 < t2 ? t1 : t2,
            i
        );}
    )
    .sort( (a, b) => a.when - b.when )
    .shift(); // take first
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