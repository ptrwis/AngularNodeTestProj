import { Vec2d } from "./vec2d";

/**
 * 
 */
enum GameEventType{ 
    TURN_LEFT,
    TURN_RIGHT,
    STR8_FORWARD,
    /*SHOT*/
}

/**
 * What player did and when
 * TODO: + which player
 */
class GameEvent {
    time: number;
    eventType: GameEventType;
    equals( other: GameEvent ) {
        return this.time === other.time && this.eventType === other.eventType;
    }
}


abstract class AbstractState{
}
abstract class GameObject<S extends AbstractState> {
    state: S;
    abstract stateFunction( e: GameEvent, time: number ): S;
}


class PlayerState extends AbstractState {
    pos: Vec2d;
    dir: Vec2d;
    constructor( pos: Vec2d, dir: Vec2d ) {
        super();
        this.pos = pos;
        this.dir = dir;
    }
}
class SimplePlayer extends GameObject<PlayerState> {

    stateFunction( e: GameEvent, time: number ): PlayerState{
        const dt = time - e.time;
        const w = 0.1; // predkosc kolowa
        const velocity = 0.1; // szybkosc
        const radious = 0.5;
        const pos = this.state.pos;
        const dir = this.state.dir;
        switch( e.eventType ) {
            case GameEventType.STR8_FORWARD: {
                // return p(t) = p0 + v * dir * t
                const newPos = this.state.pos.add( this.state.dir.mul(velocity * dt));
                return new PlayerState( newPos, this.state.dir );
            }
            case GameEventType.TURN_LEFT: {
                const newDir = this.state.dir.rot( - w * dt );
                const newPos = pos.rotdAround( - w * dt, pos.sub(dir.normal()).mul(radious) );
                return new PlayerState( newPos, newDir );
            }
            case GameEventType.TURN_RIGHT: {
                const newDir = this.state.dir.rot( + w * dt );
                const newPos = pos.rotdAround( + w * dt, pos.add(dir.normal()).mul(radious) );
                return new PlayerState( newPos, newDir );
            }
        }
    }
}


/**
 * PlayerSnapshot = State + GameEvent
 * Player's state when he's last event arrived.
 * Current player state is snapshot + event * t, 
 * same like x(t) = x0 + v * t
 * When game starts, time=0, pos and dir are eg random, 
 * event is some neutral event like 'go forward'.
 * Event is the event which happend when player was in (pos, dir, time)
 */
// 
/*class PlayerSnapshot {
    state: PlayerState;
    event: GameEvent;
}*/

/**
 * We must count all possible <events>, and store the first (in time).
 * After any event, we must recount all possible events only for this single player.
 * 1. Round Robin
 * 2. one <-> others
 * "Circle method" implementation
 * Outside, we should check crosscuting of functions, they must be of the same 
 * domain and image (?)
 */
function round_robin<T>( arr: T[], round: (a: T, b: T) => void ) {
    const n = arr.length;
    for( let i=0; i<n; i++ ) {
        for( let j=i+1; j<n; j++ ) {
            round(arr[i], arr[j]);
        }
    }
}

/**
 * Like on comment above, to know foreign player's current
 * position we only need he's last event and snapshot from that moment
 */
class ForeignPlayer {
    snapshot: PlayerSnapshot;
    update( ev: GameEvent ) {
        this.snapshot = update( this.snapshot, dt );
        this.snapshot.event = ev;
    }
}

/**
 * This is our player, we don't want to wait for server to send us back
 * our own moves, because this would make annoying lag (key lag).
 * We will save moves locally and accept them when server send us back
 * our moves (one after one), but if server will send us something different,
 * like drop some moves, we must rollback thos moves.
 */
class LocalPlayer {
    snapshot: PlayerSnapshot;
    unconfirmedEvents: GameEvent[];
    submitLocalEvent( ev: GameEvent) {
        this.unconfirmedEvents.push( ev);
    }
    submitRemoteEvent( ev: GameEvent) {
        this.unconfirmedEvents.forEach( e => {
            if( e.equals(ev) == false ) {
                this.unconfirmedEvents.shift();
            }
        });
        /*
        * 2. player.snapshot = player.snapshot + player.lastEvent * dt
        * 3. player.lastEvent = ev;
        */
    }
}

/**
 * 
 */
export class LocalGame {
    players: Set<ForeignPlayer>;
    player: LocalPlayer;
    // powerups
    // bullets
    closestEvent: GameEvent;
    submitRemoteEvent( ev: GameEvent ){
        /**
         * 1. find player
         * 2. player.snapshot = player.snapshot + player.lastEvent * dt
         * 3. player.lastEvent = ev;
         */
    }
    submitLocalEvent( ev: GameEvent ){
        this.player.submitLocalEvent( ev);
    }
    closestEventHandler( ev: GameEvent ){
        this.recountClosestEvent();
    }
    recountClosestEvent(){
        // optimize by counting only for lastEvent.player
        // cancel last timeout if any
        // recount closestEvent
        // setTimeout( closestEvent.timestamp, closestEventHandler )
    }
}

/**
 * 
 */
export class ServerGame {
    maxLag = 50; // [ms]
    players: Set<ForeignPlayer>;
    submitRemoteEvent( ev: GameEvent ){
        let now = new Date().getMilliseconds();
        if( Math.abs( ev.time - now ) > this.maxLag )
            return;
        this.recountClosestEvent();
        this.broadcast( ev );
    }
    async recountClosestEvent() { }
    async broadcast( ev: GameEvent ) { }
}