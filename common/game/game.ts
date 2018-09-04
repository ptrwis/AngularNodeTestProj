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
    time: number;
    eventType: GameEventType;
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

    e: GameEvent;

    constructor( ps: PlayerState ) {
        super();
        this.state = ps;
    }

    applyEvent( e: GameEvent ) {
        this.state = this.getCurrentState( e.time );
        this.e = e;
    }

    getCurrentState(time: number): PlayerState {
        const dt = time - this.e.time;
        const w = 0.1; // predkosc kolowa
        const velocity = 0.1; // szybkosc
        const radious = 0.5;
        const pos = this.state.pos;
        const dir = this.state.dir;
        switch (this.e.eventType) {
            case GameEventType.STR8_FORWARD: {
                // return p(t) = p0 + v * dir * t
                const newPos = this.state.pos.add(this.state.dir.mul(velocity * dt));
                return new PlayerState(newPos, this.state.dir);
            }
            case GameEventType.TURN_LEFT: {
                const newDir = this.state.dir.rot(- w * dt);
                const newPos = pos.rotdAround(- w * dt, pos.sub(dir.normal()).mul(radious));
                return new PlayerState(newPos, newDir);
            }
            case GameEventType.TURN_RIGHT: {
                const newDir = this.state.dir.rot(+ w * dt);
                const newPos = pos.rotdAround(+ w * dt, pos.add(dir.normal()).mul(radious));
                return new PlayerState(newPos, newDir);
            }
        }
    }
}
