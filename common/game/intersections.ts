import {Vec2d} from "./vec2d";
import { Segment } from "./segment";
import { Curve } from "./curve";
import { Shape } from "./shape";

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
        public cursor: Cursor,
        public lastMove: AbstractMove // inc. timestamp
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
    applyEvent( move: AbstractMove ) {
        const dt = move.timestamp - this.head.lastMove.timestamp;
        // 0. new head
        const newHead = new PlayerSnapshot(
            this.head.lastMove.state( dt ),
            move
        );
        // 1. add head to tail
        this.tail.push( this.head.lastMove.intoShape( dt ) );
        // 2. set new head
        this.head =newHead;
    }
}

/**
 * r, v, w are here because they can change per move.
 * When player takes 'speed' item a new move is being created
 */
abstract class AbstractMove {
    v = 1.0; // linear velocity (move outside or into AbstractMove)
    r = 10.0;
    constructor(
        public snap: PlayerSnapshot,
        public timestamp: number
    ) {}
    setVelocity = ( v: number ) => this.v = v;
    setRadious = ( r: number ) => this.r = r;
    w = () => this.v / this.r; // w = v / r and radious is a function of velocity
    abstract state( dt: number );
    abstract intoShape( dt: number )
    abstract timeToReach( pos: Vec2d );
    abstract intersect( x: Segment | Curve );
}
/**
 * 
 */
class TurnLeftMove extends AbstractMove {
    centerOfRotation = ( ) => this.snap.cursor.pos.add( this.snap.cursor.dir.normal().mul( - this.r) );
    intersect( x: Segment | Curve ) {
        if( x instanceof Curve )
            return intersectionCurveCurve( this.intoShape(dt), x as Curve);
        if( x instanceof Segment )
            return intersectionCurveSegment( this.intoShape(dt), x as Segment);
    }
    timeToReach( pos: Vec2d ) {
        const center = this.centerOfRotation( );
        const a = this.snap.cursor.pos.angleBetween(center);
        const b = pos.angleBetween(center);
        return Math.abs(a - b) / this.w();
    }
    intoShape( dt: number ) {
        const anchor = this.centerOfRotation( );
        let angleStart = this.snap.cursor.pos.angleBetween(anchor);
        // this way curves are always clock-wise
        // const angleEnd = angleStart - w * dt;
        const angleEnd = angleStart;
        angleStart = angleStart - this.w() * dt;
        return new Curve( anchor, this.r, angleStart, angleEnd  );
    }
    state( dt: number ) {
        const anchor = this.centerOfRotation( );
        const newPos = this.snap.cursor.pos.rotAround( - this.w() * dt, anchor);
        const newDir = newPos.sub(anchor).normal().mul( -1 );
        return new Cursor(newPos, newDir);
    }
}
/**
 * 
 */
class TurnRightMove extends AbstractMove {
    intersect( x: Segment | Curve ) {
        if( x instanceof Curve )
            return intersectionCurveCurve( this.intoShape(dt), x as Curve);
        if( x instanceof Segment )
            return intersectionCurveSegment( this.intoShape(dt), x as Segment);
    }
    centerOfRotation = ( ) => this.snap.cursor.pos.add( this.snap.cursor.dir.normal().mul( + this.r) );
    timeToReach( pos: Vec2d ) {
        const center = this.centerOfRotation( );
        const a = this.snap.cursor.pos.angleBetween(center);
        const b = pos.angleBetween(center);
        return Math.abs(a - b) / this.w();
    }
    intoShape( dt: number ) {
        const anchor = this.centerOfRotation( );
        const angleStart = this.snap.cursor.pos.angleBetween(anchor);
        const angleEnd = angleStart + this.w() * dt;
        return new Curve( anchor, this.r, angleStart, angleEnd );
        /*const anchor = this.centerOfRotation( state, GameEventType.TURN_RIGHT );
        const newState = this.countState(state, dt, eventType);
        return this.curveFromEndpoints( state.pos, newState.pos, anchor );*/
    }
    state() {
        const anchor = this.centerOfRotation( );
        const newPos = this.snap.cursor.pos.rotAround( + this.w() * dt, anchor);
        const newDir = newPos.sub(anchor).normal().mul( +1 );
        return new Cursor(newPos, newDir);
    }
}
/**
 * 
 */
class Str8AheadMove extends AbstractMove {
    intersect(x: Segment | Curve) {
        if( x instanceof Segment )
            return intersectionSegmentSegment( this.intoShape(), x as Segment);
        if( x instanceof Curve )
            return intersectionCurveSegment( x as Curve, this.intoShape());
    }
    timeToReach = ( pos: Vec2d ) => this.v / this.snap.cursor.pos.dist( pos );
    intoShape() {
        return new Segment( 
            this.snap.cursor.pos, 
            this.snap.cursor.pos.add(this.snap.cursor.dir.mul(this.v * dt))
        );
    }
    state() {
        const newPos = this.snap.cursor.pos.add(this.snap.cursor.dir.mul(this.v * dt));
        return new Cursor(newPos, this.snap.cursor.dir);
    }
}

function drawCurve( c: Curve ) {}
function drawSegment( s: Segment ) {}

/**
 * 
 */
export class Crash {
    constructor(
        public whoDied: Player,
        public whoKilled: Player,
        public when: number,
        public place: Vec2d
        // dir: Vec2d; direction of victim at the moment of crash (?-already in whoDied.dir)
    ) {
    }
}

/**
 * 
 * @param ps1 
 * @param ps2 
 * @param timestamp 
 */
// export function crashTest( ps1: PlayerSnapshot, ps2: PlayerSnapshot, timestamp: number ): Crash {
export function crashTest( p1: Player, p2: Player, timestamp: number ): Crash {
    return intersections(
        p2.head.lastMove.intoShape( timestamp - p1.head.lastMove.timestamp ),
        p1.head.lastMove.intoShape( timestamp - p2.head.lastMove.timestamp )
    )
    .map( i => { 
        const t1 = p1.head.lastMove.timeToReach(i);
        const t2 = p2.head.lastMove.timeToReach(i);
        return new Crash( 
            t1 < t2 ? p2 : p1, 
            t1 < t2 ? p1 : p2, 
            t1 < t2 ? t1 : t2,
            i
        );}
    )
    .sort( (c1, c2) => c1.when - c2.when )
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
    throw new Error( 'unhandled type' );
}

/**
 * 
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
    c1.center = c1.center.sub(origin);
    c2.center = c2.center.sub(origin);
    // rotate second one to lie on OX. First doesn't change 'cus already lies on (0,0)
    const angle = c2.center.angle();
    c2.center = c2.center.rot( - angle );
    // http://mathworld.wolfram.com/Circle-CircleIntersection.html
    const x = (d**2 - R**2 + r**2) / (2*d);
    const y1 = +((r**2 - x**2)**0.5);
    const y2 = -((r**2 - x**2)**0.5);
    let p1 = new Vec2d(x, y1);
    let p2 = new Vec2d(x, y2);
    // rotate and translate results back
    p1 = p1.rot(+angle).add(origin);
    p2 = p2.rot(+angle).add(origin);
    // check domain
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