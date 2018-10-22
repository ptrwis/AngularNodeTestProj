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
    constructor(
        public state0: Cursor,
        public event: AbstractMove // AbstractMove is like linked list, 'event' is the head
    ){}
    applyEvent( move: AbstractMove ) {
        move.prev = this.event;
    }
    state(  ) {
        return this.event.state();
        // let state = this.state0;
        // this.events.forEach( event => state = event.state( state ) ); // reduce?
    };
}

class Throw {
    pos: Vec2d;
    dir: Vec2d;
    timestamp: number;
    // Returns timestamp of the moment when distance between 'this' and 'other' is minimal, earliest in time.
    dist( other: Throw, at: number ): number | undefined {
        // 'at' is timestamp at which we count the distance.
        if ( at < this.timestamp || at < other.timestamp )
            return undefined;
        return 0;
    }
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

class TheGame {
    startTs: number;
    seed: number;
    players: Player[]; // inc local player

    start() {
        this.handleEvent( this.countClosestEvent() );
        this.startTs = Date.now();
    }
    countClosestEvent( ) {

    } 
    // game loop:
    handleEvent( event ) {
        setTimeout( () => {
            // handle
            event = this.countClosestEvent();
            this.handleEvent( event ); // this is not recursion
        },
        now - event.timestamp )
    }
}

// services -> websocket.service
class Networking {
    onEvent( lambda: (event: AbstractMove) => void ) {
        lambda.apply( event );
    }
}

class GameSystem {
    /**
     *  Keyboard   --> [ submitLocalEvent -> TheGame.players[id].applyEvent(e) ]
     *  Network    --> [ submitRemoteEvent -> TheGame.players[id].applyEvent(e) ]
     *  AI (local) --> [ submitLocalEvent -> TheGame.players[id].applyEvent(e) ]
     */
    networking: Networking;
    localPlayer: Player;
    constructor() {
        this.networking.onEvent( (event) => this.submitRemoteEvent(event) );
    }
    submitLocalEvent( event: AbstractMove ) {
        game.playerById(event.playerId).applyEvent(event.timestamp);
        this.networking.broadcast( event );
    }
    submitRemoteEvent( event ) {
        game.playerById(event.playerId).applyEvent( event ); // resync
    }
}

function keyboard( key ) {
    // player = playerByKey[key]; // if many players on a single keyboard
    event = eventByKey[key]; 
    this.localPlayer.applyEvent( event );
}