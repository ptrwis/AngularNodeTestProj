// driving vectors multiplayer 

import { Vec2d } from "./vec2d";

/**
 * player's position and direction
 */
class Cursor {
    constructor(
        public pos: Vec2d,
        public dir: Vec2d
    ) { }
}

/**
 * 
 */
abstract class AbstractMove {
    snap: Cursor; // where was the user when he made this move
    // dt: number = null; // dt will be set when next move will arrive
    abstract state( timestamp: number ): Cursor;
    // abstract draw( timestamp: number, r : Renderer ); // Breaking SRP works for me.
}

/**
 * 
 */
class Player{
    events: AbstractMove[] = [];
    last = () => this.events[ this.events.length - 1 ];
    applyEvent( move: AbstractMove ) {
    }
    state = () => this.events.reduce( (prev, curr) => curr );
}

class MoveLeft extends AbstractMove {
    state(timestamp: number): Cursor {
        throw new Error("Method not implemented.");
    }
}
class MoveRight extends AbstractMove {
    state(timestamp: number): Cursor {
        throw new Error("Method not implemented.");
    }
}