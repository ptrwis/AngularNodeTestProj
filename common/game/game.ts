import { Vec2d } from "./vec2d";

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

export class LocalGame {
    players: Set<ForeignPlayer>;
    player: LocalPlayer;
    // powerups
    // bullets
    closestEvent: GameEvent;
    submitRemoteEvent( ev: GameEvent ){
        /* if( ev.player == this.player )
            this.player.submitRemoteEvent( ev );
        this.recountClosestEvent(); */
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

enum Event{ LEFT, RIGHT, STRAIGHT, /*SHOT*/ }

class GameEvent {
    time: number;
    event: Event;
}

class PlayerSnapshot {
    time: number;
    pos: Vec2d;
}

/**
 * Player being in state (place) 'snapshot' did action Event
 */
class ForeignPlayer {
    lastEvent: GameEvent;
    snapshot: PlayerSnapshot;
}

class LocalPlayer {
    snapshot: PlayerSnapshot;
    unconfirmedEvents: GameEvent[];
    submitLocalEvent( ev: GameEvent){
        this.unconfirmedEvents.push( ev);
    }
    submitRemoteEvent( ev: GameEvent){
        if( ev == this.unconfirmedEvents[0] ){
            this.unconfirmedEvents.shift();
            // recount this.snapshot (ev)
        }else{
            this.unconfirmedEvents = [];
            // recount this.snapshot (ev)
        }
    }
}