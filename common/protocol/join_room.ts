import { MSG_TYPE, EVENT_TYPE } from "./msg_types";
import { XRequest, XEvent, VoidResponse } from "./generic";

export class JoinRoomMsg extends XRequest<VoidResponse> {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}

export class PeerJoinedTheRoomMsg extends XEvent {
    peerid: number;
    peername: string;
    roomid: number;
    constructor( peerid: number,
                 peername: string,
                 roomid: number) {
        super( EVENT_TYPE.PEER_JOINED_THE_ROOM );
        this.peerid = peerid;
        this.peername = peername;
        this.roomid = roomid;
    }
}