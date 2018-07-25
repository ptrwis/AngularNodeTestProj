import { PeerToServer, ServerToPeer } from './protocol';
import { WebsocketClientService } from './../../frontend/src/app/services/websocket.service';

/**
 * communication schemes:
 * cmd -> result ( "sign in"->"token" )
 * event -> broadcast ( "turn left", "chat" )
 * cmd -> result -> broadcast ( "create room" -> "ok" -> "room has been created" )
 * 
 * we can code it as:
 * cmd -> [optional result] -> [optional broadcast]
 * request -> [ response ] -> [ event ]
 */

class RemoteEndpoint {
    private ws: WebSocket;
    constructor( public url: string,
                 public onMessage: (ev: MessageEvent) => void,
                 public onClose: (ev: CloseEvent) => void){
    }
    sendX( msg: XRequest, 
          listener: (response: YResponse) => void ){
        // ws.send msgpack encode decode (msg)
    }
    sendY( msg: BroadcastMsg ){
      // ws.send msgpack encode decode (msg)
  }
    connect( url: string, 
             onMessage: (ev: MessageEvent) => void,
             onClose: (ev: CloseEvent) => void ){
        this.ws = new WebSocket( url );
        this.ws.onmessage = this.onMessage;
        this.ws.onclose = this.onClose;
    }
    disconnect(){
        this.ws.close();
    }
}

// just to mark classes
export interface PeerToServer { }
export interface ServerToPeer { }

 /**
  * 
  */
class XRequest implements PeerToServer {
    msg_id: number;
    type: MSG_TYPE;
    content: string;
}

/**
 * room list
 */
class YResponse implements ServerToPeer {
    correlation_id: number;
    content: string;
}

/**
 * i turned left
 */
class EventMsg implements PeerToServer {
    type: MSG_TYPE;
    content: string; // + what and when
}

/**
 * player X turned left
 */
class BroadcastMsg implements ServerToPeer {
    sender_id: number;
    type: MSG_TYPE;
    content: string;
}

class MESAGE{
    id?: number; // also as correlation id
    sender_id?: number;
    type: MSG_TYPE;
    content?: string;
}

export enum MSG_TYPE 
{ 
    // requests
    SIGNIN, // resp=token, rpc, request has crdentials and response has token/ session id
    SIGNUP, // resp=status
    CHAT_MSG, // resp=void, from peer to server
    CREATE_ROOM, // resp=rommid, rpc, request has parameters and response has room's id(/ip)
    LEAVE_THE_ROOM, // resp=void, peer or server
    JOIN_ROOM, // resp=status
    GET_ROOM_LIST, // resp=roomlist, rpc, response has list of rooms

    // response
    RESPONSE, // one type for all responses

    // broadcast / events
    CHAT_EVENT, // from server to peers
    PEER_LEFT_THE_ROOM, // server to other peers
    PEER_JOINED_THE_ROOM,
    SERVER_MSG,
    ROOM_HAS_BEEN_CREATED, // additionally, new rooms can be singaled by server
    ROOM_HAS_BEEN_CLOSED, // ... same as closing them
}

// -------------------- API ------------------------
// naming (?)  ChatCmd , ChatEvent , ChatMsg

export abstract class BaseMsg {
    id: number;
    type: MSG_TYPE;
    constructor( type: MSG_TYPE){
        this.type = type;
    }
}

export abstract class RpcRequest<CorrespondingResponse extends RpcResponse> {
    id: number; // odpowiedz bedzie miala to samo id
    constructor( id?: number) {
        this.id = id ? id : Math.random();
    }
    /**
     * typical implementation :
     *  toResp( resp: RpcResponse ) : RoomList {
     *      return resp as RoomList;
     *  }
     * @param req 
     */
    abstract castResponse( req: RpcRequest<CorrespondingResponse> ) : CorrespondingResponse;
}

export abstract class RpcResponse {
    id: number;
    // type: number;
    constructor( req: RpcRequest<RpcResponse>) {
        this.id = req.id; // zeby wiedziec na ktory request jest ta odpowiedz
    }
}

// ============================
//      FROM PEER TO SERVER
// ============================

export class ChatMsg extends BaseMsg implements PeerToServer {
    msg: string;
    roomid: number;
    constructor( msg: string, roomid: number){
        super( MSG_TYPE.CHAT_MSG);
        this.msg = msg;
        this.roomid = roomid;
    }
}

export class CreateRoomMsg extends BaseMsg implements PeerToServer {
    roomname: string;
    constructor( roomname: string){
        super( MSG_TYPE.CREATE_ROOM);
        this.roomname = roomname;
    }
}

export class SignInMsg extends BaseMsg implements PeerToServer {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNIN);
        this.username = username;
        this.password = password;
    }
}

export class SignUpMsg extends BaseMsg implements PeerToServer {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNUP);
        this.username = username;
        this.password = password;
    }
}

export class LeaveTheRoomMsg extends BaseMsg implements PeerToServer {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.LEAVE_THE_ROOM);
        this.roomid = roomid;
    }
}

export class JoinRoomMsg extends BaseMsg implements PeerToServer {
    roomid: number;
    constructor( roomid: number){
        super( MSG_TYPE.JOIN_ROOM);
        this.roomid = roomid;
    }
}

// ============================
//     FROM SERVER TO PEER(S)
// ============================

export class ServerMsg extends BaseMsg implements ServerToPeer {
    msg: string;
    constructor( msg: string) {
        super(MSG_TYPE.SERVER_MSG)
        this.msg = msg;
    }
}

export class ChatEvent extends BaseMsg implements ServerToPeer {
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

export class PeerLeftTheRoomMsg extends BaseMsg implements ServerToPeer {
    peerid: number;
    roomid: number;
    constructor( peerid:number, roomid: number){
        super( MSG_TYPE.PEER_LEFT_THE_ROOM);
        this.peerid = peerid;
        this.roomid = roomid;
    }
}

export class PeerJoinedTheRoomMsg extends BaseMsg implements ServerToPeer {
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

class GetRoomList extends RpcRequest<RoomListResponse> {
    castResponse( resp: RpcResponse ) : RoomListResponse {
        // we trust the server, just cast
        return resp as RoomListResponse;
    }
}

class RoomListResponse extends RpcResponse {
    rooms: String[];
    constructor( req: GetRoomList){
        super(req);
    }
}

/**
 * 
 * @param req 
 * @param listener - handler for response
 * @return function rowards value returned by listener
 */
export function
call
   // pierwsze jest potrzebne zeby moglo by uzyte w drugim
   // drugie bo to typ pierwszego argumentu
   < T extends RpcRequest<K>, /*where*/ K extends RpcResponse >
   ( req: T, listener: (response: RpcResponse) => any ): any {
       this.send( req); // send request with websocket
       // subscribe on queue for response with the same msg id as req.id
       return this.rpcBus.on( req.id.toString(), listener);
   }

let req = new GetRoomList();
let x =
call( req, (resp: RpcResponse) => { 
    let xresp = req.castResponse(resp);
    // resp.getResp(req);
    console.log( xresp.rooms);
    return 3;
} );
console.log(x);