export enum MSG_TYPE { 
    JOIN_ROOM, 
    CHAT_MSG
}

export abstract class BaseMsg {
    type: MSG_TYPE;
    constructor( type: MSG_TYPE){
        this.type = type;
    }
}

export class JoinRoom extends BaseMsg {
    roomname: string;
    constructor( roomname: string){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomname = roomname;
    }
}

export class ChatMsg extends BaseMsg {
    msg: string
    roomname: string;
    constructor( msg: string, roomname: string){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomname = roomname;
    }
}