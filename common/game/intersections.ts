import {Vec2d} from "./vec2d";
import { Segment } from "./segment";
import { Curve } from "./curve";
import { Shape } from "./shape";

class PlayerSnapshot {
    // structure:
    pos: Vec2d;
    dir: Vec2d;
    timestamp: number;
    event: GameEventType;
    // interface:
    state( dt: number );
    applyEvent( e: AbstractMoveEvent );
}
declare function intoShape( PlayerSnapshot, dt: number );
declare function timeToReach( PlayerSnapshot, pos: Vec2d );

class Player {
    head: PlayerSnapshot;
    tail: Shape[];
}

declare function intoShape( ps: PlayerSnapshot, time ): Shape ;
    // specialisation for every event
    declare function intoCurve( ps: PlayerSnapshot, dt: number ): Curve ;
    declare function intoSegment( ps: PlayerSnapshot, dt: number ): Segment ;
// declare function intersect( p1: PlayerSnapshot, p2: PlayerSnapshot ) ; // delegates to intersect(Shape,Shape) 
// declare function intersect( p1: PlayerSnapshot, p2: Curve ) ; // jw. for collisions with static shapes

class Crash {
    whoDied: Player;
    whoKilled: Player;
    when: number;
    place: Vec2d;
    // dir: Vec2d; direction of victim at the moment of crash
}

function crashTest( ps1: PlayerSnapshot, ps2: PlayerSnapshot, timestamp: number ): Crash {
    /*
        s1 = intoShape( ps1, timestamp - ps1.event.timestamp );
        s2 = intoShape( ps2, timestamp - ps2.event.timestamp );
        cps[] = intersections(s1, s2);
        firstCp = cps.sort( (cp1, cp2) => cp1.getTime( ) - cp2.getTime( ) )[0]
        k1 = timeToReach( ps1, firstCp );
        k2 = timeToReach( ps2, firstCp );
        return k1 < k2 ? Crash(ps1, ps2, k1, firstCp) : Crash(ps2, ps1, k2, firstCp);
    */
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