import { MSG_TYPE, Result } from "./msg_types";
import { XRequest, XResponse } from "./generic";
import { PlayerDTO } from "./dto/player_dto";
import { RoomDTO } from "./dto/room_dto";

export class GetRoomDetails extends XRequest<RoomDetailsResp>{
    constructor( public room_id: number ){
        super( MSG_TYPE.GET_ROOM_DETAILS );
    }
}

export class RoomDetailsResp extends XResponse{
    constructor( public room: RoomDTO,
                 public players: PlayerDTO[],
                 req: GetRoomDetails,
                 result: Result,
                 err_msg?: string ) {
        super( req, result, err_msg );
    }
}