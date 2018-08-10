import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { GetRoomDetails, RoomDetailsResp } from '../../../../../common/protocol/get_room';
import { LeaveTheRoomMsg, PeerLeftTheRoomMsg } from '../../../../../common/protocol/leave_room';
import { PeerJoinedTheRoomMsg } from '../../../../../common/protocol/join_room';
import { Player } from '../../../../../common/protocol/dto/player'; 

@Component({
  selector: 'createroom',
  template: `
  <h3>create room</h3>
  <h4> {{roomname}} {{roomid}}</h4>
  <input type="text" pInputText [(ngModel)]="roomname" placeholder="Cafe Luna">
  <button (click)="onSaveRoomnameButtonClick()" >save</button>
  <br />
  <button (click)="onStartGameButtonClick()" >Start</button>

  <p-table [value]="players">
      <ng-template pTemplate="header">
          <tr>
              <th>Name</th>
              <th>Id</th>
          </tr>
      </ng-template>
      <ng-template pTemplate="body" let-player>
          <tr>
              <td>{{player.username}}</td>
              <td>{{player.id}}</td>
          </tr>
      </ng-template>
  </p-table>

  `,
})
export class CreateRoomComponent implements OnInit, OnDestroy {

  roomid: number;
  roomname: string;
  players: Player[];
  private sub: any; // subscription to route's parameters change

  constructor(
    private wss: WebsocketClientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
      this.wss.subscribeOnMessage<PeerJoinedTheRoomMsg>( (msg: PeerJoinedTheRoomMsg) => {
        console.log( `adding player ${msg.peername} ${msg.peerid}` );
        this.players.push( new Player(msg.peerid, msg.peername) );
      } );
      this.wss.subscribeOnMessage<PeerLeftTheRoomMsg>( (msg: PeerLeftTheRoomMsg) => {
        console.log( `removing player ${msg.peerid}` );
        this.players = this.players.filter( p => p.id !== msg.peerid );
      } );
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
    this.wss.call( new LeaveTheRoomMsg(this.roomid) );
  }

  onStartGameButtonClick() {
    alert('Not implmeneted yet ;)');
  }

  onSaveRoomnameButtonClick() {
    alert('Not implmeneted yet ;)');
  }

}
