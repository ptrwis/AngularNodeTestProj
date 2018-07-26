import { BaseMsg, PeerToServer } from "./generic";
import { MSG_TYPE } from "./types";

// command, reponse, broadcast

export class CreateRoomMsg extends BaseMsg implements PeerToServer {
    roomname: string;
    constructor( roomname: string){
        super( MSG_TYPE.CREATE_ROOM);
        this.roomname = roomname;
    }
}