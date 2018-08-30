import { Vec2d } from "./vec2d";

/**
 * 
 */
enum GameEventType{ 
    LEFT,
    RIGHT,
    NEUTRAL,
    /*SHOT*/ }

/**
 * Focus - it does not return a PlayerSnapshot, but FUNCTION which takes 0 args and returnes PlayerSnapshot.
 * @param e 
 */
function functionByEvent( e: GameEventType ): () => PlayerSnapshot {
    switch( e ) {
        case GameEventType.NEUTRAL:
            return () => new PlayerSnapshot(); // return p(t) = p0 + v * dir * t
        case GameEventType.LEFT:
            return () => new PlayerSnapshot(); // return p.rotateAround( -w * t, (p-dir.normal) * radious )
        case GameEventType.RIGHT:
            return () => new PlayerSnapshot(); // return p.rotateAround(  w * t, (p+dir.normal) * radious )
    }
}

/**
 * What player did and when
 */
class GameEvent {
    time: number;
    event: GameEventType;
    equals( other: GameEvent ) {
        return this.time === other.time && this.event === other.event;
    }
}

class State {
    pos: Vec2d;
    dir: Vec2d;
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
class PlayerSnapshot {
    state: State;
    event: GameEvent;
}

/**
 * We must count all possible <events>, and store the first (in time).
 * After any event, we must recount all possible events only for this single player.
 * 1. Round Robin
 * 2. one <-> others
 * "Circle method" implementation
 */
function round_robin<T>( arr: T[], round: (a: T, b: T) => void ) {
    // const n = arr.length % 2 == 0 ? arr.length / 2 : (arr.length+1) / 2;
    const n = arr.length;
    // const k = n % 2 == 0 ? (n-1)*(n/2) : n*((n-1)/2);
    for( let i=0; i<n*n; i++ ) {
        round(arr[i], arr[i+n]);
    }
}

function update(snap: PlayerSnapshot,
                time: number ) : State {
    // update new snapshot with new time and new event outside this function
    return snap.state + functionByEvent(snap.event.event).call(time - snap.event.time);
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