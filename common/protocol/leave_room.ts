import { MSG_TYPE } from "./msg_types";
import { XRequest, XEvent, VoidResponse } from "./generic";

export class LeaveTheRoomMsg extends XRequest<VoidResponse> {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.LEAVE_THE_ROOM);
        this.roomid = roomid;
    }
}

export class PeerLeftTheRoomMsg extends XEvent {
    peerid: number;
    roomid: number;
    constructor( peerid:number, roomid: number){
        super( MSG_TYPE.PEER_LEFT_THE_ROOM);
        this.peerid = peerid;
        this.roomid = roomid;
    }
}