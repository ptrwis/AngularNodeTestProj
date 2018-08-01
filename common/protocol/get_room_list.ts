import { MSG_TYPE } from "./msg_types";
import { BaseMsg } from "./generic";


export class GetRoomList extends BaseMsg {
    constructor( roomid: number){
        super( MSG_TYPE.GET_ROOM_LIST);
    }
}


export class RoomList extends BaseMsg {
    constructor( public rooms: string[],
                 req: GetRoomList ) {
        super( MSG_TYPE.RESPONSE, req.id );
    }
}