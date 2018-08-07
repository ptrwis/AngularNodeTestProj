import { XRequest, XBaseMsg, VoidResponse, XEvent } from "./generic";
import { MSG_TYPE } from "./msg_types";

export class CreateRoomMsg extends XRequest<VoidResponse> {
    roomname: string;
    constructor( roomname: string){
        super( MSG_TYPE.CREATE_ROOM);
        this.roomname = roomname;
    }
}

export class RoomHasBeenCreated extends XEvent {
    constructor( public roomname: string ){
        super( MSG_TYPE.ROOM_HAS_BEEN_CREATED );
    }
}