import { MSG_TYPE, EVENT_TYPE, Result } from "./msg_types";
import { XEvent, XCmd, XRequest, XResponse } from "./generic";
import { PlayerDTO } from "./dto/player_dto";

/**
 * TODO: FFS turn it into RPC
 */
export class JoinRoomReq extends XRequest<JoinRoomResp> {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}

export class JoinRoomResp extends XResponse {
    constructor(
        public players: PlayerDTO[],
        req: JoinRoomReq,
        result: Result,
        err_msg?: string ) {
            super( req, result, err_msg );
        }
}

/**
 * Other player joined the room
 */
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