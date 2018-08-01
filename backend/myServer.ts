import { AddTwoNumbers, AddResult } from './../common/protocol/addition';
import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE } from '../common/protocol/msg_types';
import { BaseMsg } from '../common/protocol/generic';
import { ServerMsg } from '../common/protocol/server_msg';
import { PeerJoinedTheRoomMsg, JoinRoomMsg } from '../common/protocol/join_room';
import { LeaveTheRoomMsg, PeerLeftTheRoomMsg } from '../common/protocol/left_room';
import { ChatEvent, ChatMsg } from '../common/protocol/chat';
import { CreateRoomMsg } from '../common/protocol/create_room';

/**
 * 
 */
class Peer{
    id: number;
    // name: string;
    rooms: Room[];
    ws: WebSocket;

    constructor( id:number, ws:WebSocket){
        this.id = id;
        this.ws = ws;
        this.rooms = [];
    }
    // send msg to this peer
    send( msg: BaseMsg){
        // this.ws.send( JSON.stringify(msg) );
        this.ws.send( msgpack.encode( msg ) );
    }
    // don't encode, useful for broadcasts
    justSend( msg: Buffer){
        this.ws.send( msg );
    }
    join( room: Room){
        this.rooms.push(room);
        room.join(this);
    }
    leave( room: Room){
        this.rooms = this.rooms.filter( (p) => p.roomname !== room.roomname );
        room.leave(this);
    }
}


/**
 * 
 */
class Room{
    static idcounter: number = 0;
    id: number = 0;
    peers: Peer[];
    roomname: string;
    constructor( name:string){
        this.id = Room.idcounter++;
        this.peers = [];
        this.roomname = name;
    }
    broadcast( sender: Peer, msg: BaseMsg, excludeSender: boolean) {
        const m = msgpack.encode( msg );
        if( excludeSender===false){
            this.peers.forEach( peer => peer.justSend(m));
        }else{
            this.peers.forEach( peer => peer.id === sender.id ? peer.justSend(m) : null );
        }
    }
    join( peer: Peer){
        this.peers.push( peer);
        this.broadcast( 
            peer, 
            new PeerJoinedTheRoomMsg(peer.id, `Guest ${peer.id}`, this.id), 
            true
        );
        peer.send( new ServerMsg(`You have joined room ${this.roomname}`));
    }
    leave( peer:Peer){
        this.broadcast( 
            peer, 
            new PeerLeftTheRoomMsg(peer.id, this.id),
            true
        );
        this.peers = this.peers.filter( (p) => p.id !== peer.id );
    }
}


/**
 * 
 */
class MyServer{
    rooms: Map<number, Room>;

    constructor(){
        this.rooms = new Map();
    }
    rageQuit( peer: Peer){
        this.rooms.forEach( (room) => room.leave(peer) );
    }
    route( sender: Peer, message: Buffer){
        // we have to parse it here, to forward message to apporpriate room
        // let baseMsg = JSON.parse(message) as BaseMsg; // JSON string
        let baseMsg = msgpack.decode( message ) as BaseMsg;
        // TODO: safe casting
        // TODO: check if user is singed in
        switch( baseMsg.type){
            case MSG_TYPE.CHAT_MSG:{
                let chatMsg = baseMsg as ChatMsg;
                this.runCallbackWithGuard( sender, chatMsg.roomid, 
                    (room: Room) => room.broadcast( 
                        sender, 
                        new ChatEvent( sender.id, `${sender.id}: ${message}`, room.id), 
                        true
                    )
                );
            }break;
            case MSG_TYPE.JOIN_ROOM:{
                let msg = baseMsg as JoinRoomMsg;
                this.runCallbackWithGuard( sender, msg.roomid, 
                    (room: Room) => room.join( sender)
                );
            }break;
            case MSG_TYPE.LEAVE_THE_ROOM:{
                let msg = baseMsg as LeaveTheRoomMsg;
                this.runCallbackWithGuard( sender, msg.roomid, 
                    (room: Room) => room.broadcast( sender, new PeerLeftTheRoomMsg( sender.id, room.id), true)
                );
            }break;
            case MSG_TYPE.CREATE_ROOM:{
                let msg = baseMsg as CreateRoomMsg;
                let room = new Room(msg.roomname);
                if( this.rooms.get(room.id) === undefined )
                    this.rooms.set( room.id ,  room);
                else
                    sender.send( new ServerMsg(`Server: Such room already exists!`));
            }break;
            case MSG_TYPE.SIGNIN:{
                // Kick guests with 10*X time of inactivity.
                // So long, this user is "Guest", now we can assign him his username
                /**
                 * username = this.userDatabase.get(password);
                 * if( username !== underfined && username == msg.username )
                 *  ok!
                 */
            }break;
            case MSG_TYPE.SIGNUP:{
                // this.userDatabase.put( msg.password, msg.username )
            }break;
            case MSG_TYPE.ADD:{
                let msg = baseMsg as AddTwoNumbers;
                console.log( `${msg.a} + ${msg.b}` );
                sender.send( new AddResult( msg ));
            }break;
            /*
            case MSG_TYPE.RPC_REQ:
                let rpcReqMsg = baseMsg as RpcReqMsg;
                setTimeout(
                    () => sender.send( new RpcRespMsg( rpcReqMsg)), 
                    500 + 1000 * Math.random()
                );
            break;
            */
            // case MSG_TYPE.GET_ROOMS_LIST:{}break;
        }
    }
    /**
     * The "guard" is about to check room's existence
     * @param sender 
     * @param roomid 
     * @param callback 
     */
    runCallbackWithGuard( sender: Peer, roomid: number, callback: ( room: Room) => void) {
        let room = this.rooms.get( roomid);
        if( room === undefined ) {
            sender.send( new ServerMsg(`Server: Such room already exists!`));
        } else {
            callback( room);
        }
    }
}


/**
 * SETUP AND START
 */
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let myServer = new MyServer();

wss.on('connection', (ws: WebSocket) => {
    // To chyba dziala jak domkniecie, w kazdym razie- dziala.
    let peer = new Peer( Math.floor(Math.random() * 100_000) + 1 , ws);
    ws.on('message', (message: Buffer) => myServer.route( peer, message) );
    ws.on('close', () => myServer.rageQuit( peer) );
});

//start our server
server.listen(process.env.PORT || 8999);
