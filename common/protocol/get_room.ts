import { MSG_TYPE, Result } from "./msg_types";
import { XRequest, XResponse } from "./generic";
import { Player } from "./dto/player";
import { Room } from "./dto/room";

export class GetRoomDetails extends XRequest<RoomDetailsResp>{
    constructor( public room_id: number ){
        super( MSG_TYPE.GET_ROOM_DETAILS );
    }
}

export class RoomDetailsResp extends XResponse{
    constructor( public room: Room,
                 public players: Player[],
                 req: GetRoomDetails,
                 result: Result,
                 err_msg?: string ) {
        super( req, result, err_msg );
    }
}