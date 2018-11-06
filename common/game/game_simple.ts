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

    forward( distance: number ) {
        return new Cursor(
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
        const j = (angle <= 0) ? (-1) : (+1);
        const anchor = this.pos.add( this.dir.normal().mul( j * radious) );
        const newPos = this.pos.rotAround( angle, anchor);
        // Przenosimy punkt w okol ktorego krecimy do (0,0), newPos znajduje sie
        // na jego brzegu. newDir to styczna do okregu w punkcie newPos
        const newDir = newPos.sub(anchor).normal().mul( j );
        return new Cursor(newPos, newDir);
    }

}

/**
 * 
 */
class Player{
    events: AbstractMove[];
    constructor(
        public cursor: Cursor,
        public event: AbstractMove
    ){
        this.events = [ event ];
    }
    applyEvent( move: AbstractMove ) {
        move.prev = this.event;
        if ( move instanceof MoveForward ) {
            this.cursor.forward( v * dt );
        }
    }
    state(  ) {
        return this.event.state();
        // let state = this.state0;
        // this.events.forEach( event => state = event.state( state ) ); // reduce?
    }
}

/**
 * AbstractMove is like linked list
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
abstract class Turn extends AbstractMove { }
class TurnLeft extends Turn {
    current_offset( state: Cursor ): Cursor {
        throw new Error("Method not implemented.");
    }
}
class TurnRight extends Turn {
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
