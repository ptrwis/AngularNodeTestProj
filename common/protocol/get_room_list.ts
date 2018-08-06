import { MSG_TYPE } from "./msg_types";
import { BaseMsg } from "./generic";

export class Room{
    constructor(
      public name: string,
      public num_of_players: number
    ){ }
  }

export class GetRoomList extends BaseMsg {
    constructor( ){
        super( MSG_TYPE.GET_ROOM_LIST);
    }
}


export class RoomList extends BaseMsg {
    constructor( public rooms: string[],
                 req: GetRoomList ) {
        super( MSG_TYPE.RESPONSE, req.id );
    }
}