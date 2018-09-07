import { MSG_TYPE, EVENT_TYPE } from "./msg_types";
import { XEvent, XCmd } from "./generic";

export class ChatMsg extends XCmd {
    constructor( public msg: string, 
                 public roomid: number){
        super( MSG_TYPE.CHAT_MSG);
    }
}

export class ChatEvent extends XEvent {
    constructor( public peerid: number, 
                 public msg: string, 
                 public roomid: number){
        super( EVENT_TYPE.CHAT_EVENT );
    }
}