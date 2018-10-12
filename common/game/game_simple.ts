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

/**
 * Human    -> Controller  -> Player.TurnLeft(now)
 * AI       -> VController -> Player.TurnLeft(now)
 * Network -> (V)Controller -> Server -> Client -> VController -> Player.TurnLeft(event.timestamp)
 */
class TheGame {
    seed: number;
    players: Player[];

    start() {
        this.handleEvent( this.countClosestEvent() );
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

class GameSystem {
    networking.onEvent( (event) => {
        switch( event ) {
            case TURN_LEFT: this.submitRemoteEvent(event); break;
        }
    } );
    submitLocalEvent( event ) {
        game.playerById(event.playerId).turnLeft(event.timestamp);
        networking.broadcast( event );
    }
    submitRemoteEvent( event ) {
        game.playerById(event.playerId).turnLeft(event.timestamp);
    }
}

function keyboard( key ) {
    switch( key ) {
        case 'LEFT':
            gameSystem.onEvent(localPlayer.turnLeft());
            break;
    }
}