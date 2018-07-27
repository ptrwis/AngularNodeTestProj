import { MSG_TYPE } from "./msg_types";
import { BaseMsg } from "./generic";

export class JoinRoomMsg extends BaseMsg {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}

export class PeerJoinedTheRoomMsg extends BaseMsg {
    peerid: number;
    peername: string;
    roomid: number;
    constructor( peerid: number,
                 peername: string,
                 roomid: number) {
        super(MSG_TYPE.PEER_JOINED_THE_ROOM);
        this.peerid = peerid;
        this.peername = peername;
        this.roomid = roomid;
    }
}