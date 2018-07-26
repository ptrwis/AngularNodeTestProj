import { MSG_TYPE } from "./types";
import { BaseMsg, PeerToServer, ServerToPeer } from "./generic";


export class GetRoomList extends BaseMsg implements PeerToServer {
    constructor( roomid: number){
        super( MSG_TYPE.GET_ROOM_LIST);
    }
}


export class RoomList extends BaseMsg implements ServerToPeer {
    rooms: string[];
    constructor( ) {
        super(MSG_TYPE.RESPONSE);
    }
}