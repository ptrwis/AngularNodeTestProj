import { Vec2d } from "./vec2d";

/**
 * 
 */
export enum GameEventType {
    TURN_LEFT,
    TURN_RIGHT,
    STR8_FORWARD,
    UP, DOWN // GAP
    /*SHOT*/
}

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

interface Shape {}
export class Segment implements Shape {
    constructor( public start: Vec2d, 
                 public end: Vec2d ) { }
}
export class Curve implements Shape {
    constructor( public center: Vec2d,
                 public radious: number,
                 public angleStart: number,
                 public angleEnd: number) {}
}
export class PlayerState {
    pos: Vec2d;
    dir: Vec2d;
    constructor(pos: Vec2d, dir: Vec2d) {
        this.pos = pos;
        this.dir = dir;
    }
}
export class SimplePlayer {

    moves: GameEvent[]
    lastState: PlayerState;
    shapes: Shape[];

    velocity = 0.1; // szybkosc liniowa
    radious = 50;
    w = this.velocity / this.radious;
 
    constructor( initialState: PlayerState, initialEvent: GameEvent ) {
        this.lastState = initialState;
        this.moves = [ initialEvent ];
    }

    /**
     * Player being at state 'state' making move 'eventType' for duration of 'dt'
     * makes shape 'Shape'
     * TODO: move outside
     * @param state 
     * @param eventType 
     * @param dt 
     */
    gameEventIntoShape( state: PlayerState, eventType: GameEventType, dt: number ): Shape {
        const pos = state.pos;
        const dir = state.dir;
        const v = this.velocity;
        switch( eventType ) {
            case GameEventType.STR8_FORWARD: {
                return new Segment( pos, pos.add(dir.mul(v * dt)));
            }
            case GameEventType.TURN_LEFT: {
                const w = this.w;
                const anchor = this.centerOfRotation( state, GameEventType.TURN_LEFT );
                const angleStart = pos.sub(anchor).angle();
                const angleEnd = angleStart - w * dt;
                return new Curve( 
                    anchor, 
                    this.radious,
                    angleStart, angleEnd
                );
            }
            case GameEventType.TURN_RIGHT: {
                const w = this.w;
                const anchor = this.centerOfRotation( state, GameEventType.TURN_RIGHT );
                const angleStart = pos.sub(anchor).angle();
                const angleEnd = angleStart + w * dt;
                return new Curve( 
                    anchor, 
                    this.radious,
                    angleStart, angleEnd
                );
            }
        }
    }

    applyEvent( e: GameEvent ) {
        this.lastState = this.countState( this.lastState, this.lastEvent().time, e );
        this.moves.push( e );
        // if state of brush is UP, apply event but dont add shape
        // on BRUSH DOWN event start creating a shape
    }

    lastEvent() {
        return this.moves[this.moves.length-1];
    }

    countState(state: PlayerState, dt: number, event: GameEvent): PlayerState {
        const v = this.velocity;
        const w = this.w;
        const pos = state.pos;
        const dir = state.dir;
        switch (event.eventType) {
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
        }
    }

    centerOfRotation( state: PlayerState, ev: GameEventType ) {
        const r = this.radious;
        const pos = state.pos;
        const dir = state.dir;
        switch( ev ){
            case GameEventType.TURN_LEFT: return pos.sub( dir.normal().mul(r) );
            case GameEventType.TURN_RIGHT: return pos.add( dir.normal().mul(r) );
        }
    }

}
