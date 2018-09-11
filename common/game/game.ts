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
    a() { return this.end.sub(this.start).angle(); }
    b(a:number) { return this.start.y - a * this.start.y; }
    intersectionS( s: Segment ): Vec2d {
        const a1 = this.a();
        const a2 = s.a();
        if( a1 === a2 ) {
            return null;
        }
        const b1 = this.b(a1);
        const b2 = s.b(a2);
        const x = (b1 - b2)/(a2 - a1);
        const y = a1 * x + b1;
        return new Vec2d(x, y);
    }
    intersectionC( c: Curve ) {
        return c.intersectionS(this);
    }
}
export class Circle implements Shape {
    constructor( public center: Vec2d,
                 public radious: number) {
    }
}
export class Curve implements Shape {
    constructor( public center: Vec2d,
                 public radious: number,
                 public angleStart: number,
                 public angleEnd: number) {
    }
    intersectionC( c: Curve ) {

    }
    // might be 2 points
    intersectionS( s: Segment ) {
        // 1. find intercetion of line and full circle
        // http://mathworld.wolfram.com/Circle-LineIntersection.html
        const r = this.radious;
        const   x1 = s.start.x, y1 = s.start.y, 
                x2 = s.end.x,   y2 = s.end.y;
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dr = Math.sqrt( dx**2 + dy**2 );
        const D = x1 * y2 - x2 * y1;
        const discriminant = r**2 * dr**2 - D**2;
        if ( discriminant < 0 ) { // no intersection
            return null;
        } else if ( discriminant < 0.000001 ) { // tangent
            const x = (D * dy) / dr**2;
            const y = (-D * dx) / dr**2;
            const p = new Vec2d(x,y);
            // 2. check domain for a curve
            // TODO
        } else if ( discriminant > 0.000001 ) { // intersection
            // p1
            const x1 = (D * dy + Math.sign(dy) * dx * discriminant**0.5 ) / dr**2;
            const y1 = (-D * dx + Math.abs(dy) * discriminant**0.5 ) / dr**2;
            const p1 = new Vec2d(x1,y1);
            // p2
            const x2 = (D * dy - Math.sign(dy) * dx * discriminant**0.5 ) / dr**2;
            const y2 = (-D * dx - Math.abs(dy) * discriminant**0.5 ) / dr**2;
            const p2 = new Vec2d(x2,y2);
            // 2. check domain for a curve
            // TODO
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
