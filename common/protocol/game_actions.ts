import { MSG_TYPE } from "./msg_types";
import { BaseMsg } from "./generic";

// TODO: move it to Game.ts ?
enum GAME_EVENT{
    TURN_LEFT,
    TURN_RIGHT
}

export class GameAction extends BaseMsg {
    constructor( public ev: GAME_EVENT, 
                 public timestamp: number ){
        super( MSG_TYPE.ACTION );
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