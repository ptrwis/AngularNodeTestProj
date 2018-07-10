export enum MSG_TYPE { 
    SIGNIN, // rpc, request has crdentials and response has token/ session id
    SIGNUP,
    CHAT_MSG, // from peer to server
    CHAT_EVENT, // from server to peers
    CREATE_ROOM, // rpc, request has parameters and response has room's id(/ip)
    LEAVE_THE_ROOM, // peer or server
    PEER_LEFT_THE_ROOM, // server to other peers
    JOIN_ROOM, // rpc, request has room's id and response is ok/failure
    PEER_JOINED_THE_ROOM,
    SERVER_MSG,
    RPC_REQ, RPC_RESP,

    GET_ROOM_LIST, // rpc, response has list of rooms
    ROOM_HAS_BEEN_CREATED, // additionally, new rooms can be singaled by server
    ROOM_HAS_BEEN_CLOSED, // ... same as closing them
}

export abstract class BaseMsg {
    type: MSG_TYPE;
    constructor( type: MSG_TYPE){
        this.type = type;
    }
}

// naming (?)  ChatCmd , ChatEvent , ChatMsg
export abstract class PeerToServer extends BaseMsg{

}

export abstract class ServerToPeer extends BaseMsg{

}

// ============================
//      FROM PEER TO SERVER
// ============================

export class ChatMsg extends PeerToServer {
    msg: string;
    roomid: number;
    constructor( msg: string, roomid: number){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomid = roomid;
    }
}

export class CreateRoomMsg extends PeerToServer {
    roomname: string;
    constructor( roomname: string){
        super( MSG_TYPE.CREATE_ROOM);
        this.roomname = roomname;
    }
}

export class SignInMsg extends PeerToServer {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNIN);
        this.username = username;
        this.password = password;
    }
}

export class SignUpMsg extends PeerToServer {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNUP);
        this.username = username;
        this.password = password;
    }
}

export class LeaveTheRoomMsg extends PeerToServer {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.LEAVE_THE_ROOM);
        this.roomid = roomid;
    }
}

export class JoinRoomMsg extends PeerToServer {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}

export class RpcReq extends PeerToServer{
    msgid: number;
    constructor( msgid: number) {
        super( MSG_TYPE.RPC_REQ);
        this.msgid = msgid;
    }
}

// ============================
//     FROM SERVER TO PEER(S)
// ============================

export class ServerMsg extends ServerToPeer {
    msg: string;
    constructor( msg: string) {
        super(MSG_TYPE.SERVER_MSG)
        this.msg = msg;
    }
}

export class ChatEvent extends ServerToPeer {
    peerid: number;
    msg: string;
    roomid: number;
    constructor( peerid: number, msg: string, roomid: number){
        super( MSG_TYPE.CHAT_EVENT);
        this.peerid = peerid;
        this.msg = msg;
        this.roomid = roomid;
    }
}

export class PeerLeftTheRoomMsg extends ServerToPeer {
    peerid: number;
    roomid: number;
    constructor( peerid:number, roomid: number){
        super( MSG_TYPE.PEER_LEFT_THE_ROOM);
        this.peerid = peerid;
        this.roomid = roomid;
    }
}

export class PeerJoinedTheRoomMsg extends ServerToPeer {
    peerid: number;
    peername: string;
    roomid: number;
    constructor( peerid: number,
                 peername: string,
                 roomid: number) {
        super(MSG_TYPE.PEER_JOINED_THE_ROOM);
        this.peerid = peerid;
        this.peername = peername;
        this.roomid = roomid;
    }
}

// ============================
//    Remote Procedure Call
// ============================

// rpc message should be 2-way but for now lets assume only client can do request to server,
// and the server sends the response back

export class RpcReqMsg extends PeerToServer {
    id: number;
    constructor( id?: number) {
        super( MSG_TYPE.RPC_REQ );
        this.id = id ? id : Math.random();
    }
}

export class RpcRespMsg extends ServerToPeer {
    msgid: number;
    constructor( req: RpcReqMsg) {
        super( MSG_TYPE.RPC_RESP);
        this.msgid = req.id; // copy msg id from request
    }
}
