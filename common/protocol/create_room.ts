import { XRequest, XEvent, XResponse } from "./generic";
import { MSG_TYPE, Result, EVENT_TYPE } from "./msg_types";
import { RoomDTO } from "./dto/room_dto";

export class CreateRoomReq extends XRequest<RoomCreatedResp> {
    constructor( public roomname: string){
        super( MSG_TYPE.CREATE_ROOM);
    }
}

export class RoomCreatedResp extends XResponse{
    constructor(
        req: CreateRoomReq,
        result: Result,
        public room_id? : number,
        error_msg?: string
    ){
        super( req, result, error_msg );
    }
}

export class RoomCreatedEvent extends XEvent {
    constructor( public room: RoomDTO ){
        super( EVENT_TYPE.ROOM_HAS_BEEN_CREATED );
    }
}