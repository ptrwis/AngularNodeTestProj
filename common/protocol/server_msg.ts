import { XEvent } from "./generic";
import { MSG_TYPE, EVENT_TYPE } from "./msg_types";

export class ServerMsg extends XEvent {
    constructor( public content: string ){
        super( EVENT_TYPE.SERVER_MSG );
    }
}