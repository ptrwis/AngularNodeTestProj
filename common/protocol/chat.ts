import { MSG_TYPE } from "./types";
import { BaseMsg, PeerToServer, ServerToPeer } from "./generic";

// action, broadcast

export class ChatMsg extends BaseMsg implements PeerToServer {
    msg: string;
    roomid: number;
    constructor( msg: string, roomid: number){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomid = roomid;
    }
}

export class ChatEvent extends BaseMsg implements ServerToPeer {
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