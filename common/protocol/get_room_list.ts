import { MSG_TYPE, Result } from "./msg_types";
import { XBaseMsg, XRequest, XResponse } from "./generic";
import { RoomDTO } from "./dto/room_dto";


export class GetRoomList extends XRequest<RoomList>{
    constructor( ){
        super( MSG_TYPE.GET_ROOM_LIST );
    }
}

export class RoomList extends XResponse{
    constructor( public rooms: RoomDTO[],
                 req: GetRoomList ) {
        super( req, Result.RESULT_OK );
    }
}