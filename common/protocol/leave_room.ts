import { MSG_TYPE, EVENT_TYPE } from "./msg_types";
import { XEvent, XCmd } from "./generic";

export class LeaveTheRoomCmd extends XCmd {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.LEAVE_THE_ROOM);
        this.roomid = roomid;
    }
}

/**
 * TODO: decide on "event" or "message"
 */
export class PeerLeftTheRoomMsg extends XEvent {
    peerid: number;
    roomid: number;
    constructor( peerid:number, roomid: number){
        super( EVENT_TYPE.PEER_LEFT_THE_ROOM );
        this.peerid = peerid;
        this.roomid = roomid;
    }
}