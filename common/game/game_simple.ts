// driving vectors multiplayer 

import { Vec2d } from "./vec2d";

// ------------- abstractions ------------------

abstract class AbstractState {}

abstract class Event< T extends AbstractState > {
    snap: T;
    abstract cstate( timestamp: number ): T;
    constructor(
        public timestamp: number
    ) {}
}

abstract class GameObject< T extends Event<K>, K extends AbstractState > {
    events: T[]; // it's like event sourcing
}

// ------------- some impl ------------------

/**
 * player's position and direction
 */
class Cursor extends AbstractState {
    constructor(
        public pos: Vec2d,
        public dir: Vec2d
    ) {
        super();
    }
}

/**
 * 
 */
abstract class AbstractMove extends Event<Cursor> {
    // snap: Cursor; // where was the user when he made this move
    // dt: number = null; // dt will be set when next move will arrive
    abstract cstate( timestamp: number ): Cursor;
    // abstract draw( timestamp: number, r : Renderer ); // Breaking SRP works for me.
}

/**
 * 
 */
class Player extends GameObject<AbstractMove, Cursor> {
    events: AbstractMove[] = [];
    event = () => this.events[ this.events.length - 1 ];
    applyEvent( move: AbstractMove ) {
    }

}

class MoveLeft extends AbstractMove {
    cstate(timestamp: number): Cursor {
        throw new Error("Method not implemented.");
    }
}
class MoveRight extends AbstractMove {
    cstate(timestamp: number): Cursor {
        throw new Error("Method not implemented.");
    }
}