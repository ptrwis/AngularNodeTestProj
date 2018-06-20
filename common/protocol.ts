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
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}

export class ChatMsg extends BaseMsg {
    msg: string;
    roomid: number;
    constructor( msg: string, roomid: number){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomid = roomid;
    }
}
