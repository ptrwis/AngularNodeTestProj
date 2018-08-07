import { MSG_TYPE } from "./msg_types";
import { XEvent, VoidResponse, XRequest } from "./generic";

export class ChatMsg extends XRequest<VoidResponse> {
    msg: string;
    roomid: number;
    constructor( msg: string, roomid: number){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomid = roomid;
    }
}

export class ChatEvent extends XEvent {
    peerid: number;
    msg: string;
    roomid: number;
    constructor( peerid: number, msg: string, roomid: number){
        super( MSG_TYPE.CHAT_EVENT);
        this.peerid = peerid;
        this.msg = msg;
        this.roomid = roomid;
    }
}