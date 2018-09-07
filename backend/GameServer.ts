import { AddTwoNumbersReq, AddResultResp } from './../common/protocol/addition';
import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, Result } from '../common/protocol/msg_types';
import { XBaseMsg, XRequest, XCmd } from '../common/protocol/generic';
import { PeerJoinedTheRoomMsg, JoinRoomReq, JoinRoomResp } from '../common/protocol/join_room';
import { LeaveTheRoomCmd, PeerLeftTheRoomMsg } from '../common/protocol/leave_room';
import { ChatEvent, ChatMsg } from '../common/protocol/chat';
// import { ServerMsg } from '../common/protocol/server_msg';
import { CreateRoomReq, RoomCreatedResp, RoomCreatedEvent } from '../common/protocol/create_room';
import { SignInReq, SignInResp } from '../common/protocol/sign_in';
import { SignUpReq, SignUpResp } from '../common/protocol/sign_up';
import { GetRoomListReq, RoomListResp } from '../common/protocol/get_room_list';
import { RoomDTO } from '../common/protocol/dto/room_dto';
import { PlayerDTO } from '../common/protocol/dto/player_dto';
import { GetRoomDetailsReq, RoomDetailsResp } from '../common/protocol/get_room';


/**
 * 
 */
class UserEntity {
    constructor(
        public id: number,
        public username: string,
        public password: string) {
    }
}


/**
 * 
 */
class UserDatabase {

    userIdSeq: number;
    userbase: UserEntity[];

    constructor() {
        this.userbase = [
            new UserEntity(1, 'John Rambo', 'qwe'),
            new UserEntity(2, 'Billy Kid', 'asd'),
            new UserEntity(3, 'Jimmy 11Fingerz', 'zxc'),
        ];
        const max = this.userbase.reduce((a, b) => a.id > b.id ? a : b);
        this.userIdSeq = max.id;
    }

    findByCredentials(username: string, password: string) {
        return this.userbase.find((x) => x.username === username && x.password === password);
    }

    findById(id: number) {
        return this.userbase.find((x) => x.id === id);
    }

    insert(username: string, password: string) {
        this.userbase.push(new UserEntity(++this.userIdSeq, username, password));
        return this.userIdSeq;
    }

} let userDatabase = new UserDatabase();


/**
 * 
 */
class Peer {
    rooms: ServerRoom[];
    // requestPerSecondCounter // increase on every request, if too much- kick fucker

    constructor(public user: UserEntity, // negative id means guest
        public ws: WebSocket) {
        this.rooms = [];
    }
    // send msg to this peer
    send(msg: XBaseMsg) {
        // this.ws.send( JSON.stringify(msg) );
        if( this.ws.readyState === WebSocket.OPEN )
            this.ws.send(msgpack.encode(msg));
    }
    // don't encode, useful for broadcasts (msg is encoded once and as such broadcasted)
    justSend(msg: Buffer) {
        if( this.ws.readyState === WebSocket.OPEN )
            this.ws.send(msg);
    }
    join(room: ServerRoom) {
        this.rooms.push(room);
        room.join(this);
    }
    leave(room: ServerRoom) {
        this.rooms = this.rooms.filter((p) => p.roomname !== room.roomname);
        room.leave(this);
    }
    isGuest() { this.user.id < 0; }
}


/**
 * 
 */
class ServerRoom {
    static idcounter: number = 0;
    id: number = 0;
    peers: Peer[];
    roomname: string;
    constructor(name: string) {
        this.id = ++ServerRoom.idcounter;
        this.peers = [];
        this.roomname = name;
    }
    broadcast(sender: Peer, msg: XBaseMsg, excludeSender: boolean) {
        const m = msgpack.encode(msg);
        let receivingList = excludeSender === false ? this.peers : this.peers.filter((p) => p.user.id !== sender.user.id);
        receivingList.forEach(peer => peer.justSend(m));
    }
    join(peer: Peer) {
        this.peers.push(peer);
        console.log( `${peer.user.username} joined room ${this.roomname}, we have now ${this.peers.length} peers in this room` );
        this.broadcast(
            peer,
            new PeerJoinedTheRoomMsg( peer.user.id, peer.user.username, this.id),
            true
        );
        // peer.send(new ServerMsg(`You have joined room ${this.roomname}`));
    }
    leave(peer: Peer) {
        this.broadcast(
            peer,
            new PeerLeftTheRoomMsg(peer.user.id, this.id),
            true
        );
        this.peers = this.peers.filter((p) => p.user.id !== peer.user.id);
    }
}


/**
 * 
 */
class GameServer {
    roomsById: Map<number, ServerRoom>;
    //allPeers: Peer[]; // TODO: Set<Peer>
    allPeers: Set<Peer>;

    constructor() {
        this.roomsById = new Map();
        this.allPeers = new Set();
    }
    /**
     * broadcast to this.allPeers
     * @param sender 
     * @param msg 
     * @param excludeSender 
     */
    broadcast(sender: Peer, msg: XBaseMsg, excludeSender: boolean) {
        const m = msgpack.encode(msg);
        if( excludeSender==true ) {
            this.allPeers.forEach( peer => peer!=sender ? peer.justSend(m) : null );
        }else{
            this.allPeers.forEach( peer => peer.justSend(m) );
        }
    }
    /**
     * called after websocket disconnection
     * @param peer 
     */
    rageQuit(peer: Peer) {
        // here we assume peer can be in many rooms ( like in chat )
        // this.roomsById.forEach((room) => room.leave(peer)); // for games it sucks
        console.log( `Rage Quit [${peer.user.username}] in ${peer.rooms.length} rooms` );
        peer.rooms.forEach((room) => 
            this.route(peer, msgpack.encode( new LeaveTheRoomCmd(room.id) ) )
        );
        this.allPeers.delete(peer);
    }
    /**
     * 
     * @param peer 
     */
    addPeer( peer: Peer ){
        this.allPeers.add( peer );
    }
    /**
     * 
     * @param sender 
     * @param message 
     */
    route(sender: Peer, message: Buffer) {
        // we have to parse it here, to forward message to apporpriate room
        // let baseMsg = JSON.parse(message) as BaseMsg; // JSON string

        //let baseMsg = msgpack.decode( message ) as XRequest<any>;
        let baseMsg = msgpack.decode( message ) as XRequest<any>|XCmd; // effectively XBaseMsg;

        // TODO: safe casting (we can immidiatelly drop user and ban him on exception)
        // TODO: check if user is singed in
        switch (baseMsg.type) {
            case MSG_TYPE.CHAT_MSG: {
                let chatMsg = baseMsg as ChatMsg;
                this.runCallbackWithGuard(sender, chatMsg.roomid,
                    (room: ServerRoom) => room.broadcast(
                        sender,
                        new ChatEvent(sender.user.id, `${sender.user.username}: ${chatMsg.msg}`, room.id),
                        false // re-send message to sender
                    )
                );
            } break;
            case MSG_TYPE.JOIN_ROOM: {
                let request = baseMsg as JoinRoomReq;
                this.runCallbackWithGuard( sender, request.roomid,
                    (room: ServerRoom) => { 
                        console.log( `[${sender.user.username}] joined [${room.roomname}]` );
                        const peers_dtos = room.peers.map(peer => new PlayerDTO(peer.user.id,peer.user.username));
                        sender.send( new JoinRoomResp( peers_dtos, request, Result.RESULT_OK) );
                        sender.join(room);
                    }
                );
            } break;
            case MSG_TYPE.LEAVE_THE_ROOM: {
                let request = baseMsg as LeaveTheRoomCmd;
                this.runCallbackWithGuard( sender, request.roomid,
                    (room: ServerRoom) => {
                        // TODO: if owner left then choose new one from other peers in this room.
                        room.leave( sender ); 
                        console.log( `[${sender.user.username}] left [${room.roomname}], which now has ${room.peers.length} peers` );
                        if( room.peers.length === 0 ) {
                            console.log( `Removing [${room.roomname}]` );
                            this.roomsById.delete( room.id );
                        }else{
                            room.broadcast(
                                sender, 
                                new PeerLeftTheRoomMsg(sender.user.id, room.id), 
                                true
                            );
                        }
                    }
                );
            } break;
            case MSG_TYPE.CREATE_ROOM: {
                let request = baseMsg as CreateRoomReq;
                console.log( `[${sender.user.username}] created [${request.roomname}]` );
                let newRoom = new ServerRoom(request.roomname);
                this.roomsById.set(newRoom.id, newRoom); // weak- ugly
                sender.send(new RoomCreatedResp(request, Result.RESULT_OK, newRoom.id));
                sender.join( newRoom );
                // For each player in idle send info (event) about new room. Otherwise just force players to click "refresh"
                this.broadcast(
                    sender,
                    new RoomCreatedEvent( new RoomDTO( request.roomname, 1, newRoom.id)),
                    false
                );
            } break;
            case MSG_TYPE.SIGNIN: {
                // TODO: we can broadcast this message to this.allPeers, it would be funny to see it on the bar who just came in
                let request = baseMsg as SignInReq;
                let usr = userDatabase.findByCredentials(request.username, request.password);
                if (usr === undefined) {
                    sender.send(new SignInResp(request, Result.RESULT_FAIL, "Bad crdentials"));
                } else {
                    sender.user = usr;
                    sender.send(new SignInResp(request, Result.RESULT_OK));
                }
            } break;
            case MSG_TYPE.SIGNUP: {
                let request = baseMsg as SignUpReq;
                let userId = userDatabase.insert(request.username, request.password);
                // send email
                sender.send(new SignUpResp(request, Result.RESULT_OK));
            } break;
            case MSG_TYPE.ADD: {
                let request = baseMsg as AddTwoNumbersReq;
                sender.send(new AddResultResp(request));
            } break;
            case MSG_TYPE.GET_ROOM_LIST: {
                let request = baseMsg as GetRoomListReq;
                // TODO: Cache it, change when room is created or removed.
                // There is problem with caching because response is msgpacked, but we have to hange id of response
                // for every request (request.id==response.id). -> We can just send response as XEvent.
                let rooms: RoomDTO[] = [];
                this.roomsById.forEach((v, k) => rooms.push(new RoomDTO(v.roomname, v.peers.length, k)));
                sender.send( new RoomListResp(rooms, request) );
            } break;
            case MSG_TYPE.GET_ROOM_DETAILS: {
                let request = baseMsg as GetRoomDetailsReq;
                let room = this.roomsById.get( request.room_id );
                if( room === undefined ){
                    sender.send( 
                        new RoomDetailsResp( 
                            new RoomDTO("",0,0), 
                            [], // empty array of players
                            request, 
                            Result.RESULT_FAIL, "No such room exists!"
                        )
                    );
                    return;
                }
                sender.send( 
                    new RoomDetailsResp( 
                        new RoomDTO(room.roomname, room.peers.length, room.id), 
                        room.peers.map( p => new PlayerDTO(p.user.id, p.user.username) ),
                        request, 
                        Result.RESULT_OK
                    ) 
                );
            } break;
            default:
                console.log(`Nieznany typ wiadomosci ${baseMsg.type}`);
        }
    }
    /**
     * checks room's existence
     * @param sender 
     * @param roomid 
     * @param callback 
     */
    runCallbackWithGuard(sender: Peer, roomid: number, callback: (room: ServerRoom) => void) {
        let room = this.roomsById.get(roomid);
        if (room === undefined) {
            // sender.send(new ServerMsg(`Server: Such room does not exists!`));
        } else {
            callback(room);
        }
    }
}


/**
 * SETUP AND START
 */
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let gameServer = new GameServer();

wss.on('connection', (ws: WebSocket) => {
    // this works like closure- peer will be remembered
    let guestId = (- 1 - Math.floor(Math.random() * 100_000));
    let peer = new Peer(new UserEntity(guestId, "", ""), ws);
    gameServer.addPeer( peer );
    ws.on('message', (message: Buffer) => gameServer.route(peer, message));
    ws.on('close', () => gameServer.rageQuit(peer));
});

// start
server.listen(process.env.PORT || 8999);
