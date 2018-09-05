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
    w = 0.15; // szybkosc kolowa
    radious = 50;

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
        const r = this.radious;
        const dt = time - this.lastEvent.time;
        const pos = this.state.pos;
        const dir = this.state.dir;
        switch (this.lastEvent.eventType) {
            case GameEventType.STR8_FORWARD: {
                // return p(t) = p0 + v * dir * t
                const newPos = this.state.pos.add(this.state.dir.mul(v * dt));
                return new PlayerState(newPos, this.state.dir);
            }
            case GameEventType.TURN_LEFT: {
                const anchor = pos.sub( dir.normal().mul(r) );
                const newDir = this.state.dir.rotd(- w * dt);
                const newPos = pos.rotdAround(- w * dt, anchor);
                return new PlayerState(newPos, newDir);
            }
            case GameEventType.TURN_RIGHT: {
                const anchor = pos.add( dir.normal().mul(r) );
                const newDir = this.state.dir.rotd(+ w * dt);
                const newPos = pos.rotdAround(+ w * dt, anchor);
                return new PlayerState(newPos, newDir);
            }
        }
    }
}
