import { Vec2d } from "./vec2d";

/**
 * 
 */
enum Event{ 
    LEFT,    // pos = p.rotateAround( -wt, (p-dir.normal) * radious )
    RIGHT,   // pos = p.rotateAround(  wt, (p+dir.normal) * radious )
    NEUTRAL, // p(t) = p0 + v * dir * t
    /*SHOT*/ }

/**
 * 
 */
class GameEvent {
    time: number;
    event: Event;
    equals( other: GameEvent ) {
        return this.time === other.time && this.event === other.event;
    }
}

/**
 * Player's state when he's last event arrived.
 * Current player state is snapshot + event * t, 
 * same like x(t) = x0 + v * t
 * When game starts, time=0, pos and dir are eg random, 
 * event is some neutral event like 'go forward'.
 * Event is the event which happend when player was in (pos, dir, time)
 */
class PlayerSnapshot {
    time: number;
    pos: Vec2d;
    dir: Vec2d;
    event: GameEvent;
}

function update(snap: PlayerSnapshot,
                time: number ) : PlayerSnapshot {
    // update new snapshot with new time and new event outside this function
    return snap + snap.event * (time - snap.time);
}

/**
 * Like on comment above, to know foreign player's current
 * position we only need he's last event and snapshot from that moment
 */
class ForeignPlayer {
    snapshot: PlayerSnapshot;
    lastEvent: GameEvent;
    update( ev: GameEvent ) {
        this.snapshot = this.snapshot + this.lastEvent * dt;
        this.lastEvent = ev;
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