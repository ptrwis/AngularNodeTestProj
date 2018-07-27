import { MSG_TYPE } from "./msg_types";
import { BaseMsg } from "./generic";

export class ChatMsg extends BaseMsg {
    msg: string;
    roomid: number;
    constructor( msg: string, roomid: number){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomid = roomid;
    }
}

export class ChatEvent extends BaseMsg {
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