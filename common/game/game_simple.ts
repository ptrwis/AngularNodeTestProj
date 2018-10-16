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
    prev?: AbstractMove;
    timestamp: number;
    abstract current_offset();
    state(  ): Cursor {
        return 
        this.prev == null ?
        state0 + current_offset
        :
        this.state( this.prev.state() ) + current_offset;
    }
    // abstract draw( timestamp: number, r : Renderer ); // Breaking SRP works for me.
}

/**
 * 
 */
class Player{
    constructor(
        state0: Cursor,
        event: AbstractMove // last event
    ){}
    applyEvent( move: AbstractMove ) {
        move.prev = this.event;
    }
    state() {
        // let state = this.state0;
        // this.events.forEach( event => state = event.state( state ) ); // reduce?
        return this.event.state();
    };
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
    players: Player[];

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

class Networking {
    onEvent( lambda: (event: AbstractMove) => void ) {
        // receive event from network
        lambda( new MoveLeft() );
    }
}

class GameSystem {
    /**
     *  Keyboard --> [Controller -> Player]
     *  Network  --> [Controller -> Player]
     *  AI       --> [Controller -> Player]
     */
    networking: Networking;
    constructor() {
        this.networking.onEvent( (event) => {
            switch( event ) {
                case TURN_LEFT: this.submitRemoteEvent(event); break;
            }
        } );
    }
    submitLocalEvent( event: AbstractMove ) {
        game.playerById(event.playerId).turnLeft(event.timestamp);
        this.networking.broadcast( event );
    }
    submitRemoteEvent( event ) {
        game.playerById(event.playerId).turnLeft(event.timestamp);
    }
}

function keyboard( key ) {
    player = keyMap.playerByKey(key);
    switch( key ) {
        case 'LEFT':
            gameSystem.onEvent(player.turnLeft());
            break;
    }
}