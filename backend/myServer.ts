import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { ChatMsg, JoinRoom, BaseMsg, MSG_TYPE } from './../common/protocol';


class Peer{
    id: number;
    rooms: Room[];
    ws: WebSocket;

    constructor( id:number, ws:WebSocket){
        this.id = id;
        this.ws = ws;
        this.rooms = [];
    }
    // send msg to this peer
    send(msg:string){
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
    broadcast( sender: Peer, msg: string, excludeSender: boolean) {
        if( excludeSender===false){
            this.peers.forEach( peer => peer.send( msg));
        }else{
            this.peers.forEach( peer => peer.id === sender.id ? peer.send( msg) : null );
        }
    }
    join( peer: Peer){
        this.peers.push( peer);
        this.broadcast( peer, `peer ${peer.id} joined the room ${this.roomname} `, true);
        peer.send(`You have joined room ${this.roomname}`);
    }
    leave( peer:Peer){
        this.broadcast( peer, `peer ${peer.id} left the room ${this.roomname} `, true);
        this.peers = this.peers.filter( (p) => p.id !== peer.id );
    }
}

class MyServer{
    rooms: Map<number, Room>;

    constructor(){
        let CafeLuna = new Room("Cafe Luna");
        this.rooms = new Map();
        this.rooms.set( CafeLuna.id ,  CafeLuna);
    }
    rageQuit( peer: Peer){
        this.rooms.forEach( (room) => room.leave(peer) );
    }
    route( peer: Peer, message: string){
        let baseMsg = JSON.parse(message) as BaseMsg;
        switch( baseMsg.type){
            case MSG_TYPE.CHAT_MSG:{
                let chatMsg = baseMsg as ChatMsg;
                let room = this.rooms.get(chatMsg.roomid);
                if( room != undefined )
                    // check if peer is in the room
                    // or forward message to room, dont broadcast here
                    room.broadcast( peer, `${peer.id}: ${message}`, true);
                else
                    peer.send(`Server: no such room`);
            }break;
            case MSG_TYPE.JOIN_ROOM:{
                let joinRoomMsg = baseMsg as JoinRoom;
                let room = this.rooms.get( joinRoomMsg.roomid);
                if( room != undefined )
                    room.join(peer);
                else
                    // this.rooms.set( joinRoomMsg.roomid , new Room(joinRoomMsg.roomname) );
                    peer.send(`No such room!`);
            }break;
            // case MSG_TYPE.GET_ROOMS_LIST:{}break;
        }
    }
    
}

const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let myServer = new MyServer();

wss.on('connection', (ws: WebSocket) => {
    // To chyba dziala jak domkniecie, w kazdym razie- dziala.
    let peer = new Peer( Math.floor(Math.random() * 100_000) + 1 , ws);
    ws.on('message', (message: string) => myServer.route( peer, message) );
    ws.on('close', () => myServer.rageQuit( peer) );
});

//start our server
server.listen(process.env.PORT || 8999);