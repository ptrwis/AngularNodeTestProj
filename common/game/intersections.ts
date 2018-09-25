import {Vec2d} from "./vec2d";
import { Segment } from "./segment";
import { Curve } from "./curve";
import { Shape } from "./shape";
import { GameEventType } from "./game";

abstract class AbstractMove {
    // pos: Vec2d;
    // dir: Vec2d;
    timestamp: number;
    abstract state();
    abstract intoShape();
}
class TurnLeftMove extends AbstractMove {
    intoShape() {
        throw new Error("Method not implemented.");
    }
    state() {
        throw new Error("Method not implemented.");
    }
}
class TurnRightMove extends AbstractMove {
    intoShape() {
        throw new Error("Method not implemented.");
    }
    state() {
        throw new Error("Method not implemented.");
    }
}
class Str8AheadMove extends AbstractMove {
    intoShape() {
        throw new Error("Method not implemented.");
    }
    state() {
        throw new Error("Method not implemented.");
    }
}
function intoCurveLeft( ae: TurnLeftMove ) { }
function intoCurveRight( ae: TurnRightMove ) { }
function intoSeg( ae: Str8AheadMove ) { }
function drawCurve( c: Curve ) {}
function drawSegment( s: Segment ) {}

/**
 * 
 */
class PlayerSnapshot {
    // structure:
    pos: Vec2d;
    dir: Vec2d;
    timestamp: number;
    event: GameEventType;
    v: number; // libnear velocity
    // interface:
    state( dt: number ) { }
    w = () => this.v / (0.5 * this.v); // w = v / r and radious is a function of velocity
}

/**
 * 
 */
class Player {
    head: PlayerSnapshot;
    tail: Shape[];
    applyEvent( e: GameEventType ) { }
}


function intoShape( ps: PlayerSnapshot, time: number ): Shape {
    if( ps.event === GameEventType.STR8_FORWARD )
        return intoSegment(ps, time);
    if( ps.event === GameEventType.TURN_LEFT || ps.event === GameEventType.TURN_RIGHT )
        return intoCurve(ps, time);
    throw new Error( 'unhandled type' );
}

// ... or introduce 'TurnLeftEvent', 'TurnRightEvent', 'Str8AheadEvent'
function intoCurve( ps: PlayerSnapshot, dt: number ): Curve {
    switch( ps.event ) {
        case GameEventType.TURN_LEFT: {
            const anchor = this.centerOfRotation( ps, GameEventType.TURN_LEFT );
            let angleStart = ps.pos.angleBetween(anchor);
            // this way curves are always clock-wise
            // const angleEnd = angleStart - w * dt;
            const angleEnd = angleStart;
            angleStart = angleStart - ps.w() * dt;
            return new Curve( anchor, this.radious, angleStart, angleEnd  );

            /* const anchor = this.centerOfRotation( state, GameEventType.TURN_LEFT );
            const newState = this.countState(state, dt, eventType);
            return this.curveFromEndpoints( state.pos, newState.pos, anchor ); */
        }
        case GameEventType.TURN_RIGHT: {
            const anchor = this.centerOfRotation( ps, GameEventType.TURN_RIGHT );
            const angleStart = ps.pos.angleBetween(anchor);
            const angleEnd = angleStart + ps.w() * dt;
            return new Curve( anchor, this.radious, angleStart, angleEnd );
            /*const anchor = this.centerOfRotation( state, GameEventType.TURN_RIGHT );
            const newState = this.countState(state, dt, eventType);
            return this.curveFromEndpoints( state.pos, newState.pos, anchor );*/
        }
    }
}

function intoSegment( ps: PlayerSnapshot, dt: number ): Segment {
    return new Segment( ps.pos, ps.pos.add(ps.dir.mul(this.velocity * dt)));
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

    /**
     * Returns time to achive pos starting from ps.
     * In we assume pos is on the path of ps1.
     * @param ps1 
     * @param ps2 
     * @param timestamp 
     */
    function timeToReach( ps: PlayerSnapshot, pos: Vec2d ) {
        if( ps.event === GameEventType.STR8_FORWARD ) {
            return ps.v / ps.pos.dist( pos );
        }
        if( ps.event === GameEventType.TURN_LEFT || ps.event === GameEventType.TURN_RIGHT ) {
            // 100 is whatever dt [ms], we only need this to transform PlayerSnapshot into Curve and get it's center
            const center = intoCurve( ps, 100 ).center;
            const a = ps.pos.angleBetween(center);
            const b = pos.angleBetween(center);
            return Math.abs(a - b) / ps.w();
        }
    }

    return intersections(
        intoShape( p1.head, timestamp - p1.head.timestamp ),
        intoShape( p2.head, timestamp - p2.head.timestamp )
    )
        .map( i => { 
            const t1 = timeToReach(p1.head, i);
            const t2 = timeToReach(p2.head, i);
            return new Crash( 
                t1 < t2 ? p2 : p1, 
                t1 < t2 ? p1 : p2, 
                t1 < t2 ? t1 : t2,
                i
            );
        })
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