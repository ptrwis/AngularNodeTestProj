import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRoomDetails, RoomDetailsResp } from '../../../../../common/protocol/get_room';
import { LeaveTheRoomMsg, PeerLeftTheRoomMsg } from '../../../../../common/protocol/leave_room';
import { PeerJoinedTheRoomMsg } from '../../../../../common/protocol/join_room';
import { ChatMsg, ChatEvent } from '../../../../../common/protocol/chat';
import { Player } from '../../../../../common/protocol/dto/player';
import { EVENT_TYPE } from '../../../../../common/protocol/msg_types';
import { WebsocketService, EventSubscription } from '../../services/webosocket.service';

@Component({
  selector: 'createroom',
  template: `
  <h3>create room</h3>
  <h4> {{roomname}} {{roomid}}</h4>
  <input type="text" pInputText [(ngModel)]="roomname" placeholder="Cafe Luna">
  <button (click)="onUpdateRoomnameButtonClick()" >save</button>
  <br />
  <button (click)="onStartGameButtonClick()" >Start</button>
  <button (click)="onLeaveRoomButtonClick()" >Leave</button>

  <section>
    <h3>Users:</h3>
    <ul style='border: 1px solid green; width: fit-content' >
      <li *ngFor="let player of players">{{ player.username }}</li>
    </ul>
  </section>

  <section style='border: 1px solid blue; width: fit-content' >
    <h3>Chat:</h3>
    <ul>
      <li *ngFor="let msg of chatMsgs">{{ msg }}</li>
    </ul>
    <input type="text" pInputText [(ngModel)]="chatInput" />
    <p-button label="Send" (onClick)="sendChatMsg($event)" ></p-button>
  </section>
  `,
})
export class CreateRoomComponent implements OnInit, OnDestroy {

  roomid: number;
  roomname: string;
  private routeParamsSub: any; // subscription to route's parameters change

  private players: Player[];
  private chatMsgs: string[];
  private chatInput: string;

  private dontSignalLeavingTheRoomInNgOnDestroy: boolean;

  /**
   * Subscriptions to events/messages sent to client from server, related to this view.
   * Saving those subscriptions allows us to unsubscribe from them on abandoning this room
  */
  private peerJoinedTheRoomMsgSub: EventSubscription;
  private peerLeftTheRoomSub: EventSubscription;
  private chatEventSub: EventSubscription;

  constructor(
    private wss: WebsocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dontSignalLeavingTheRoomInNgOnDestroy = false;
    this.players = [];
    this.chatMsgs = [];
    this.chatInput = '';
  }

  ngOnInit(): void {
    this.routeParamsSub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
      this.wss.call(
        new GetRoomDetails(this.roomid),
        (resp: RoomDetailsResp) => {
          this.roomname = resp.room.name;
          this.players = resp.players;
        }
      );
      this.peerJoinedTheRoomMsgSub = this.wss.subscribeOnMessage(
        EVENT_TYPE.PEER_JOINED_THE_ROOM,
        (msg: PeerJoinedTheRoomMsg) => this.players = [ new Player(msg.peerid, msg.peername), ... this.players ]
      );
      this.peerLeftTheRoomSub = this.wss.subscribeOnMessage(
        EVENT_TYPE.PEER_LEFT_THE_ROOM,
        (msg: PeerLeftTheRoomMsg) => this.players = this.players.filter( p => p.id !== msg.peerid )
      );
      this.chatEventSub = this.wss.subscribeOnMessage(
        EVENT_TYPE.CHAT_EVENT,
        (msg: ChatEvent) => this.chatMsgs = [ msg.msg, ...this.chatMsgs ]
      );
    });
  }

  /**
   * TODO: here?
   * check if switching from /createroom/2 to /createroom/3 will trigger ngOnDestroy,
   *  maybe better to use this.route.params.subscribe
   */
  ngOnDestroy() {
    // ( subscription is in ngOnInit )
    this.routeParamsSub.unsubscribe();
    // unsubscribe from 'bussiness-logic' events
    this.wss.unsubscribeFromMessage( this.peerJoinedTheRoomMsgSub );
    this.wss.unsubscribeFromMessage( this.peerLeftTheRoomSub );
    this.wss.unsubscribeFromMessage( this.chatEventSub );
    // look at this.onStartGameButtonClick()
    if ( this.dontSignalLeavingTheRoomInNgOnDestroy !== true ) {
      this.wss.call( new LeaveTheRoomMsg( this.roomid ) );
    }
    console.log( 'leaving createroom' );
  }

  onStartGameButtonClick() {
    // we are not leaving the room, dont broadcast such message while abandoning the view (ngOnDestroy)
    this.dontSignalLeavingTheRoomInNgOnDestroy = true;
    this.router.navigate( ['./gameplay', this.roomid] );
  }

  onUpdateRoomnameButtonClick() {
    alert('Not implmeneted yet ;)');
  }

  sendChatMsg() {
    this.wss.call( new ChatMsg( this.chatInput, this.roomid ) );
    this.chatInput = '';
  }

  /**
   * This will trigger ngOnDestroy
   */
  onLeaveRoomButtonClick( ) {
    this.router.navigate( ['./roomlist'] );
  }

}
