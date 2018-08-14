import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { GetRoomDetails, RoomDetailsResp } from '../../../../../common/protocol/get_room';
import { LeaveTheRoomMsg, PeerLeftTheRoomMsg } from '../../../../../common/protocol/leave_room';
import { PeerJoinedTheRoomMsg } from '../../../../../common/protocol/join_room';
import { ChatMsg, ChatEvent } from '../../../../../common/protocol/chat';
import { Player } from '../../../../../common/protocol/dto/player';

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
  private sub: any; // subscription to route's parameters change

  private dontSignalLeavingTheRoom: boolean;
  private players: Player[];
  private chatMsgs: string[];
  private chatInput: string;

  constructor(
    private wss: WebsocketClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dontSignalLeavingTheRoom = false;
    this.players = [];
    this.chatMsgs = [];
    this.chatInput = '';
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
      this.wss.call(
        new GetRoomDetails(this.roomid),
        (resp: RoomDetailsResp) => {
          this.roomname = resp.room.name;
          this.players = resp.players;
        }
      );
      // TODO: implement unsubscribe
      // TODO: the way of making a key sucks hardly
      this.wss.subscribeOnMessage(
        WebsocketClientService.prefixEvent( new PeerJoinedTheRoomMsg(null, null, null) ),
        (msg: PeerJoinedTheRoomMsg) => this.players = [ new Player(msg.peerid, msg.peername), ... this.players ]
      );
      this.wss.subscribeOnMessage(
        WebsocketClientService.prefixEvent( new PeerLeftTheRoomMsg(null, null) ),
        (msg: PeerLeftTheRoomMsg) => this.players = this.players.filter( p => p.id !== msg.peerid )
      );
      this.wss.subscribeOnMessage(
        WebsocketClientService.prefixEvent( new ChatEvent(null, null, null) ),
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
    // subscription is in ngOnInit
    this.sub.unsubscribe();
    // look at this.onStartGameButtonClick()
    if ( this.dontSignalLeavingTheRoom !== true ) {
      this.wss.call( new LeaveTheRoomMsg(this.roomid) );
    }
  }

  onStartGameButtonClick() {
    this.dontSignalLeavingTheRoom = true;
    this.router.navigate( ['./gameplay', this.roomid] );
  }

  onUpdateRoomnameButtonClick() {
    alert('Not implmeneted yet ;)');
  }

  sendChatMsg() {
    this.wss.call( new ChatMsg(this.chatInput, this.roomid) );
    this.chatInput = '';
  }

  /**
   * This will trigger ngOnDestroy
   */
  onLeaveRoomButtonClick( ) {
    this.router.navigate( ['./roomlist'] );
  }

}
