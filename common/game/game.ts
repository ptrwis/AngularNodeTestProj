import { Vec2d } from "./vec2d";

/**
 * 
 */
export enum GameEventType {
    TURN_LEFT,
    TURN_RIGHT,
    STR8_FORWARD,
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


export abstract class AbstractState {
}
export abstract class GameObject<S extends AbstractState> {
    state: S;
    abstract getCurrentState(time: number): S;
}


export class PlayerState extends AbstractState {
    pos: Vec2d;
    dir: Vec2d;
    constructor(pos: Vec2d, dir: Vec2d) {
        super();
        this.pos = pos;
        this.dir = dir;
    }
}
export class SimplePlayer extends GameObject<PlayerState> {

    lastEvent: GameEvent;

    velocity = 0.1; // szybkosc liniowa
    radious = 50;
    // w = 2*Math.PI / 1000; // szybkosc kolowa, w rad/sec
    w = this.velocity / this.radious;
 
    constructor( ps: PlayerState, initialEvent: GameEvent ) {
        super();
        this.state = ps;
        this.lastEvent = initialEvent;
    }

    applyEvent( e: GameEvent ) {
        this.state = this.getCurrentState( e.time );
        this.lastEvent = e;
    }

    getCurrentState(time: number): PlayerState {
        const v = this.velocity;
        const w = this.w;
        const dt = time - this.lastEvent.time;
        const pos = this.state.pos;
        const dir = this.state.dir;
        const r = this.radious;
        switch (this.lastEvent.eventType) {
            case GameEventType.STR8_FORWARD: {
                // return p(t) = p0 + v * dir * t
                const newPos = pos.add(dir.mul(v * dt));
                return new PlayerState(newPos, this.state.dir);
            }
            case GameEventType.TURN_LEFT: {
                const anchor = this.centerOfRotation( GameEventType.TURN_LEFT );
                const newPos = pos.rotAround( -w * dt, anchor);
                const newDir = newPos.sub(anchor).normal().mul(-1);
                return new PlayerState(newPos, newDir);
            }
            case GameEventType.TURN_RIGHT: {
                const anchor = this.centerOfRotation( GameEventType.TURN_RIGHT );
                const newPos = pos.rotAround( +w * dt, anchor);
                const newDir = newPos.sub(anchor).normal().mul(+1);
                return new PlayerState(newPos, newDir);
            }
        }
    }

    centerOfRotation( ev: GameEventType ) {
        const r = this.radious;
        const pos = this.state.pos;
        const dir = this.state.dir;
        switch( ev ){
            case GameEventType.TURN_LEFT: return pos.sub( dir.normal().mul(r) );
            case GameEventType.TURN_RIGHT: return pos.add( dir.normal().mul(r) );
        }
    }

}
