import { MSG_TYPE, Result } from "./msg_types";
import { XBaseMsg, XRequest, XResponse } from "./generic";

export class Room{
    constructor(
      public name: string,
      public num_of_players: number,
      public id: number
    ){ }
  }

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