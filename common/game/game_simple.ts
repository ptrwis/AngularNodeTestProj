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
class Player{
    events: AbstractMove[];
    constructor(
        public snapshot: Cursor,
        public event: AbstractMove // AbstractMove is like linked list, 'event' is the head
    ){
        this.events = [ event ];
    }
    applyEvent( move: AbstractMove ) {
        move.prev = this.event;
    }
    state(  ) {
        return this.event.state();
        // let state = this.state0;
        // this.events.forEach( event => state = event.state( state ) ); // reduce?
    };
}

/**
 * 
 */
abstract class AbstractMove {
    prev?: AbstractMove;
    timestamp: number;
    abstract current_offset();
    state( prevState: Cursor ): Cursor {
        return prevState + current_offset();
    }
    // abstract draw( timestamp: number, r : Renderer ); // Breaking SRP works for me.
}

class MoveForward extends AbstractMove {
    current_offset( state: Cursor ): Cursor {
        return new Cursor(
            state.pos.add( state.dir.mul(this.timestamp - this.prev.timestamp) ) , 
            state.dir
        );
    }
}
class MoveLeft extends AbstractMove {
    current_offset( state: Cursor ): Cursor {
        throw new Error("Method not implemented.");
    }
}
class MoveRight extends AbstractMove {
    current_offset( state: Cursor ): Cursor {
        throw new Error("Method not implemented.");
    }
}

class GameServer {
    broadcast() { }
    onMsg( msg ) {
        if ( now - msg.timestamp < maxLag ) {
            this.broadcast( msg );
        }
    }
}

// enum?
abstract class AbstractEvent {
    constructor( public timestamp: number ) {}
}
// player hit the wall
class WallHit extends AbstractEvent { }
// player hit another player
class PlayerHit extends AbstractEvent { }
// player hit an item
class ItemHit extends AbstractEvent { }

// type IUnionType = WallHit | PlayerHit;

class GameClient {
    startTs: number;
    seed: number;
    players: Player[]; // inc local player
    events: AbstractEvent; // sorted by timestamp

    start() {
        this.handleEvent( this.countClosestEvent() );
        this.startTs = Date.now();
    }
    countClosestEvent( ) {

    } 
    // game loop:
    submitEvent( event ) {
        // game.playerById(event.playerId).applyEvent( event );
        // resync
        setTimeout( () => {
            // handle
            event = this.countClosestEvent();
            this.handleEvent( event ); // this is not recursion
            },
            now - event.timestamp
        );
    }
    handleEvent( e: AbstractMove ) {

    }
}

class GameSystem {
    networking: Networking;
    keyboard: Keyboard;
    localPlayerRef: Player;
    constructor() {
        this.networking.onEvent( (event) => this.submitRemoteEvent(event) );
        this.keyboard.onEvent( (event) => this.submitLocalEvent(eventByKey[key]) );
    }
    submitLocalEvent( event: AbstractMove ) {
        game.submitEvent( event );
        this.networking.sendToServer( event );
    }
    submitRemoteEvent( event ) {
        game.submitEvent( event );
    }
}
