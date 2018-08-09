import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { CreateRoomMsg, RoomCreatedResp } from './../../../../../common/protocol/create_room';
import { Result } from '../../../../../common/protocol/msg_types';
import { GetRoomDetails, RoomDetailsResp } from '../../../../../common/protocol/get_room';
import { LeaveTheRoomMsg } from '../../../../../common/protocol/leave_room';

class Player {
  constructor(public name: string,
    public color: string,
    public skill: number) {
  }
}

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
              <th>Color</th>
              <th>skill</th>
          </tr>
      </ng-template>
      <ng-template pTemplate="body" let-player>
          <tr>
              <td>{{player.name}}</td>
              <td [style.color]="player.color" >#</td>
              <td>{{player.skill}}</td>
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
    this.players = [
      new Player('John Rambo', 'red', 623),
      new Player('Billy The Kid', 'green', 52),
      new Player('Jack Sparrow', 'blue', 6724)
    ];
    this.sub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
      this.wss.call(
        new GetRoomDetails(this.roomid),
        (resp: RoomDetailsResp) => {
          this.roomname = resp.room.name;
        }
      );
      /*
      this.wss.subscribeOnMessage<PeerJoinedTheRoomMsg>( (msg: PeerJoinedTheRoomMsg) => {
        this.players.remove( msg.userid );
      } );
      this.wss.subscribeOnMessage<PeerLeftTheRoomMsg>( (msg: PeerLeftTheRoomMsg) => {
        this.players.remove( msg.userid );
      } );
      */
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
