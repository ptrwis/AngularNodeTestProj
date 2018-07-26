import { MSG_TYPE } from "./types";
import { BaseMsg, PeerToServer, ServerToPeer } from "./generic";

export class JoinRoomMsg extends BaseMsg implements PeerToServer {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}



export class PeerJoinedTheRoomMsg extends BaseMsg implements ServerToPeer {
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