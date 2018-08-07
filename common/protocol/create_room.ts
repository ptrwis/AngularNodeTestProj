import { XRequest, XBaseMsg, VoidResponse, XEvent, XResponse } from "./generic";
import { MSG_TYPE, Result } from "./msg_types";
import { Room } from "./get_room_list";

export class CreateRoomMsg extends XRequest<RoomCreatedResp> {
    roomname: string;
    constructor( roomname: string){
        super( MSG_TYPE.CREATE_ROOM);
        this.roomname = roomname;
    }
}

export class RoomCreatedResp extends XResponse{
    constructor(
        req: CreateRoomMsg,
        public roomid: number,
        result: Result,
        error_msg?: string
    ){
        super( req, result, error_msg );
    }
}

export class RoomHasBeenCreated extends XEvent {
    constructor( public room: Room ){
        super( MSG_TYPE.ROOM_HAS_BEEN_CREATED );
    }
}