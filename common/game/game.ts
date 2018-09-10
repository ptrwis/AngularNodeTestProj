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

    //moves: GameEvent[]; // replace with shapes[]
    shapes: Shape[];

    lastState: PlayerState;
    lastMove: GameEvent;

    brushState: BRUSH_STATE;
    brushDownTime: number;

    velocity = 0.1; // szybkosc liniowa
    radious = 50;
    w = this.velocity / this.radious;
 
    constructor( initialState: PlayerState, initialEvent: GameEvent ) {
        this.lastState = initialState;
        this.brushState = BRUSH_STATE.DOWN;
        this.shapes = [];
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

    /**
     * A shape of current move, it's not yet in this.shapes
     */
    lastShape( currentTime: number ) {
        return this.gameEventIntoShape( 
            this.lastState, 
            this.lastMove.eventType, 
            currentTime - this.lastMove.time
        );
    }

    applyEvent( e: GameEvent ) {
        switch( e.eventType ) {
            case GameEventType.STR8_FORWARD:
            case GameEventType.TURN_LEFT:
            case GameEventType.TURN_RIGHT:
                this.lastState = this.countState( this.lastState, this.lastEvent().time, e );
                if ( this.brushState === BRUSH_STATE.DOWN ) {
                    // close current shape
                    this.shapes.push( 
                        this.gameEventIntoShape( 
                            this.lastState, 
                            this.lastMove.eventType, 
                            e.time - this.lastMove.time 
                        )
                    );
                }
            break;
            case GameEventType.DOWN:
                // assert this.brushState == BRUSH_STATE.UP
                this.brushState = BRUSH_STATE.DOWN;
                this.brushDownTime = e.time;
                // start shape, remember this Shape(state, time, event)
            break;
            case GameEventType.UP:
                // assert this.brushState == BRUSH_STATE.DOWN
                this.brushState = BRUSH_STATE.UP;
                // close current shape
                this.shapes.push(
                    this.gameEventIntoShape( 
                        this.lastState, 
                        this.lastMove.eventType, 
                        e.time - this.lastMove.time
                    )
                );
            break;
        }
    }

    lastEvent() {
        return this.lastMove;
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
