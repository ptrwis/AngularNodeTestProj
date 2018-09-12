import { Vec2d } from "./vec2d";

/**
 * 
 */
export enum GameEventType {
    TURN_LEFT,
    TURN_RIGHT,
    STR8_FORWARD,
    PULL, PUSH // GAP
    /*SHOT*/
}

export enum BRUSH_STATE{ UP, DOWN }

/**
 * What player did and when
 * TODO: + which player
 */
export class GameEvent {
    constructor( public time: number,
                 public eventType: GameEventType ) {
    }
    equals(other: GameEvent) {
        return this.time === other.time && this.eventType === other.eventType;
    }
}

export abstract class Shape {}
export class Segment implements Shape {
    constructor( public start: Vec2d, 
                 public end: Vec2d ) { }

    copy() { return new Segment(this.start.copy(), this.end.copy()); }

    //a() { return this.end.sub(this.start).angle(); }
    a() { return (this.end.y-this.start.y)/(this.end.x-this.start.x); }

    b(a:number) { return this.start.y - a * this.start.x; }

    intersectionS( s: Segment ): Vec2d[] {
        const a1 = this.a();
        const a2 = s.a();
        /*if( a1 - a2 < 0.000001 ) {
            return [];
        }*/
        const b1 = this.b(a1);
        const b2 = s.b(a2);
        const x = (b2 - b1)/(a1 - a2);
        const y = a1 * x + b1;
        return [new Vec2d(x, y)];
    }

    intersectionC( c: Curve ) {
        return c.intersectionS(this);
    }
}
export class Circle implements Shape {
    constructor( public center: Vec2d,
                 public radious: number) {
    }
    copy() { return new Circle(this.center, this.radious); }
}
export class Curve implements Shape {
    constructor( public center: Vec2d,
                 public radious: number,
                 public angleStart: number,
                 public angleEnd: number) {
    }

    copy() {
        return new Curve(this.center.copy(), this.radious, this.angleEnd, this.angleEnd);
    }

    intersectionC( c: Curve ) {
        const origin = this.center;
        //
        const d = this.center.dist(c.center);
        const r = this.radious;
        const R = c.radious;
        if ( d > r + R ) {
            return [];
        }
        const c1 = this.copy();
        const c2 = c.copy();
        // move both circles so that one of them will lie on (0,0)
        c1.center = c1.center.sub(origin);
        c2.center = c2.center.sub(origin);
        // rotate second one to lie on OX. First doesn't change 'cus already lies on (0,0)
        const a = c2.center.angle();
        c2.center = c2.center.rot( - a );
        // http://mathworld.wolfram.com/Circle-CircleIntersection.html
        const x = (d**2 - R**2 + r**2) / (2*d);
        const y1 = +((r**2 - x**2)**0.5);
        const y2 = -((r**2 - x**2)**0.5);
        const p1 = new Vec2d(x, y1);
        const p2 = new Vec2d(x, y2);
        // rotate and translate results back
        return [ p1.rot(+a).add(origin), p2.rot(+a).add(origin) ];
    }
    
    intersectionS( s: Segment ): Vec2d[] {
        const start = s.start.sub(this.center);
        const end = s.end.sub(this.center);
        // 1. find intercetion of line and full circle
        // http://mathworld.wolfram.com/Circle-LineIntersection.html
        const r = this.radious;
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
            const p = new Vec2d(x,y);
            return [p.add(this.center)];
            // 2. TODO: check domains of shapes (segment's start and end and curve's angles)
        } else if ( discriminant > 0.000001 ) { // intersection
            // p1
            const x1 = (D * dy + Math.sign(dy) * dx * discriminant**0.5 ) / dr**2;
            const y1 = (-D * dx + Math.abs(dy) * discriminant**0.5 ) / dr**2;
            const p1 = new Vec2d(x1,y1);
            // p2
            const x2 = (D * dy - Math.sign(dy) * dx * discriminant**0.5 ) / dr**2;
            const y2 = (-D * dx - Math.abs(dy) * discriminant**0.5 ) / dr**2;
            const p2 = new Vec2d(x2,y2);
            // 2. TODO: check domains of shapes (segment's start and end and curve's angles)
            return [p1.add(this.center), p2.add(this.center)];
        }
    }
}
/**
 * position and direction of the head
 */
export class PlayerState {
    pos: Vec2d;
    dir: Vec2d;
    constructor(pos: Vec2d, dir: Vec2d) {
        this.pos = pos;
        this.dir = dir;
    }
}
export class SimplePlayer {
    
    shapes: Shape[];

    lastState: PlayerState;
    lastMove: GameEvent;
    brushState: BRUSH_STATE;

    velocity = 0.1; // szybkosc liniowa
    radious = 50;
    w = this.velocity / this.radious;
 
    constructor( initialState: PlayerState, initialEvent: GameEvent ) {
        this.lastState = initialState;
        this.lastMove = initialEvent;
        // this.lastShapeEvent = initialEvent;
        this.brushState = BRUSH_STATE.DOWN;
        this.shapes = [];
    }

    /**
     * A shape of current move, it's not yet in this.shapes
     */
    lastShape( currentTime: number ) {
        return this.gameEventIntoShape( 
            this.lastState, 
            currentTime - this.lastMove.time, // lastTimeBrushWasPushed
            this.lastMove.eventType, 
        );
    }
    
    applyEvent( e: GameEvent ) {
        const dt = e.time - this.lastMove.time;
        switch( e.eventType ) {
            case GameEventType.STR8_FORWARD:
            case GameEventType.TURN_LEFT:
            case GameEventType.TURN_RIGHT:
            {
                const newShape = this.gameEventIntoShape( this.lastState, dt, this.lastMove.eventType);
                // If player makes turnes during gap
                if ( this.brushState !== BRUSH_STATE.UP ) {
                    this.shapes.push( newShape );
                }
                this.lastState = this.countState( this.lastState, dt , this.lastMove.eventType );
                this.lastMove = e;
            } break;
            case GameEventType.PUSH: {
                // assert this.brushState == BRUSH_STATE.UP
                this.brushState = BRUSH_STATE.DOWN;
                // start new shape
                this.lastState = this.countState( this.lastState, dt , this.lastMove.eventType );
                this.lastMove.time = e.time; // leave game event, just update time
            } break;
            case GameEventType.PULL: {
                // assert this.brushState == BRUSH_STATE.DOWN
                this.brushState = BRUSH_STATE.UP;
                // close current shape
                const newShape = this.gameEventIntoShape( this.lastState, dt, this.lastMove.eventType);
                this.shapes.push( newShape );
                this.lastState = this.countState( this.lastState, dt, this.lastMove.eventType );
                this.lastMove.time = e.time; // leave game event, just update time
                // DONT start new shape
            } break;
           default:
                console.log(`applyEvent: unknown event type ${GameEventType[e.eventType]}`);
        }
    }
   
    centerOfRotation( state: PlayerState, ev: GameEventType ) {
        const r = this.radious;
        const pos = state.pos;
        const dir = state.dir;
        switch ( ev ) {
            case GameEventType.TURN_LEFT: return pos.sub( dir.normal().mul(r) );
            case GameEventType.TURN_RIGHT: return pos.add( dir.normal().mul(r) );
            default:
                console.log(`centerOfRotation: unknown event type ${GameEventType[ev]}`);
        }
    }

    countState(state: PlayerState, dt: number, eventType: GameEventType): PlayerState {
        const v = this.velocity;
        const w = this.w;
        const pos = state.pos;
        const dir = state.dir;
        switch ( eventType ) {
            case GameEventType.STR8_FORWARD: {
                // return p(t) = p0 + v * dir * t
                const newPos = pos.add(dir.mul(v * dt));
                return new PlayerState(newPos, dir);
            }
            case GameEventType.TURN_LEFT: {
                const anchor = this.centerOfRotation( state, GameEventType.TURN_LEFT );
                const newPos = pos.rotAround( -w * dt, anchor);
                const newDir = newPos.sub(anchor).normal().mul(-1);
                return new PlayerState(newPos, newDir);
            }
            case GameEventType.TURN_RIGHT: {
                const anchor = this.centerOfRotation( state, GameEventType.TURN_RIGHT );
                const newPos = pos.rotAround( +w * dt, anchor);
                const newDir = newPos.sub(anchor).normal().mul(+1);
                return new PlayerState(newPos, newDir);
            }
            default:
                console.log(`countState: unknown event type ${GameEventType[eventType]}`);
        }
    }

    curveFromEndpoints( start: Vec2d, end: Vec2d, center: Vec2d ): Curve {
        return new Curve(center, this.radious, start.sub(center).angle(), end.sub(center).angle());
    }

    gameEventIntoShape( state: PlayerState, dt: number, eventType: GameEventType ): Shape {
        const w = this.w;
        switch( eventType ) {
            case GameEventType.STR8_FORWARD: {
                // const end = this.countState( state, dt, eventType );
                // return new Segment( state.pos, end.pos);
                return new Segment( state.pos, state.pos.add(state.dir.mul(this.velocity * dt)));
            }
            case GameEventType.TURN_LEFT: {
                const anchor = this.centerOfRotation( state, GameEventType.TURN_LEFT );
                const angleStart = state.pos.sub(anchor).angle();
                const angleEnd = angleStart - w * dt;
                return new Curve( anchor, this.radious, angleStart, angleEnd );
                /* const anchor = this.centerOfRotation( state, GameEventType.TURN_LEFT );
                const newState = this.countState(state, dt, eventType);
                return this.curveFromEndpoints( state.pos, newState.pos, anchor ); */
            }
            case GameEventType.TURN_RIGHT: {
                const anchor = this.centerOfRotation( state, GameEventType.TURN_RIGHT );
                const angleStart = state.pos.sub(anchor).angle();
                const angleEnd = angleStart + w * dt;
                return new Curve( anchor, this.radious, angleStart, angleEnd );
                /*const anchor = this.centerOfRotation( state, GameEventType.TURN_RIGHT );
                const newState = this.countState(state, dt, eventType);
                return this.curveFromEndpoints( state.pos, newState.pos, anchor );*/
            }
            default:
                console.log(`gameEventIntoShape: unknown event type ${GameEventType[eventType]}`);
        }
    }

}
