import { XEvent } from "./generic";
import { MSG_TYPE } from "./msg_types";

export class ServerMsg extends XEvent {
    constructor( public content: string ){
        super(MSG_TYPE.SERVER_MSG);
    }
}