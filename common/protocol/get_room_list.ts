import { MSG_TYPE, Result } from "./msg_types";
import { XBaseMsg, XRequest, XResponse } from "./generic";
import { RoomDTO } from "./dto/room_dto";


export class GetRoomListReq extends XRequest<RoomListResp>{
    constructor( ){
        super( MSG_TYPE.GET_ROOM_LIST );
    }
}

export class RoomListResp extends XResponse{
    constructor( public rooms: RoomDTO[],
                 req: GetRoomListReq ) {
        super( req, Result.RESULT_OK );
    }
}