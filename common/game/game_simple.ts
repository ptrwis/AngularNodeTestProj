// driving vectors multiplayer 

import { Vec2d } from "./vec2d";

enum DIR { RIGHT = 1, LEFT = -1 }

/**
 * player's position and direction
 */
class Arrow {
    constructor(
        public pos: Vec2d,
        public dir: Vec2d
    ) { }

    forward( distance: number ) {
        return new Arrow(
            this.pos.add( this.dir.mul(distance) ),
            this.dir
        );
    }

    /**
     * Rotates vector around anchor placed on vector normal to this one,
     *  with length 'radious'.
     * @param angle 
     * @param radious 
     */
    turn( angle: number, radious: number ) {
        const k = (angle <= 0) ? (-1) : (+1); // left/right factor
        const anchor = this.pos.add( this.dir.normal().mul( k * radious) );
        const newPos = this.pos.rotAround( angle, anchor);
        // Przenosimy punkt w okol ktorego krecimy do (0,0), newPos znajduje sie
        // na jego brzegu. newDir to styczna do okregu w punkcie newPos
        const newDir = newPos.sub(anchor).normal().mul( k );
        return new Arrow(newPos, newDir);
    }

}

abstract class AbstractMove {
    constructor( public timestamp: number ) {}
    abstract state( before: Arrow ): Arrow;
}
class MoveForward extends AbstractMove {
    state( before: Arrow ): Arrow {
        return before.forward( 1.0 * this.timestamp );
    }
}
class TurnLeft extends AbstractMove {
    state( before: Arrow ): Arrow {
        return before.turn( - 1.0 * this.timestamp, 10.0 );
    }
}
class TurnRight extends AbstractMove {
    state( before: Arrow ): Arrow {
        return before.turn( + 1.0 * this.timestamp, 10.0 );
    }
}

/**
 * 
 */
class Player{
    moves: AbstractMove[];
    snap: Arrow; // arrow on last move
    constructor(
        public origin: Arrow,
        public firstEvent: AbstractMove
    ){
        this.events = [ firstEvent ];
    }
    applyEvent( move: AbstractMove ) {
        this.events.push( move );
        this.snap = this.state( move.timestamp );
    }
    state( ts: number ): Arrow {
        let state = this.origin;
        this.events.forEach( event => state = event.state( state ) ); // reduce?
        return state;
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
