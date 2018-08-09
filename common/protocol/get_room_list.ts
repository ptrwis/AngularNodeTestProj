import { MSG_TYPE, Result } from "./msg_types";
import { XBaseMsg, XRequest, XResponse } from "./generic";
import { Room } from "./dto/room";


export class GetRoomList extends XRequest<RoomList>{
    constructor( ){
        super( MSG_TYPE.GET_ROOM_LIST );
    }
}

export class RoomList extends XResponse{
    constructor( public rooms: Room[],
                 req: GetRoomList ) {
        super( req, Result.RESULT_OK );
    }
}