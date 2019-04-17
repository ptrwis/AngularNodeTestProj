import { MSG_TYPE, EVENT_TYPE } from "./msg_types";
import { XEvent, XCmd } from "./generic";

/**
 * Only room's owner can send cmd to start game
 */
export class StartGameMsg extends XCmd {
    constructor( ){
        super( MSG_TYPE.START_GAME);
    }
}

export class StartGameEvent extends XEvent {
    constructor( public seed: number ){
        super( EVENT_TYPE.START_GAME );
    }
}