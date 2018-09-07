import { MSG_TYPE, GAME_EVENT } from "./msg_types";
import { XBaseMsg } from "./generic";

export class GameAction extends XBaseMsg {
    constructor( public ev: GAME_EVENT, 
                 public timestamp: number ){
        super( MSG_TYPE.GAME_ACTION );
    }
}

export class TurnedLeft extends GameAction {
    constructor( public timestamp: number ){
        super( GAME_EVENT.TURN_LEFT, timestamp);
    }
}

export class TurnedRight extends GameAction {
    constructor( public timestamp: number ){
        super( GAME_EVENT.TURN_RIGHT, timestamp);
    }
}