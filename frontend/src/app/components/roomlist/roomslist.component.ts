import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { GetRoomList, RoomList } from '../../../../../common/protocol/get_room_list';
import { CreateRoomMsg, RoomCreatedResp } from '../../../../../common/protocol/create_room';
import { Result } from '../../../../../common/protocol/msg_types';
import { Room } from '../../../../../common/protocol/dto/room';
import { AuthService } from '../../services/auth.service';
import { RoomHasBeenCreated } from '../../../../../common/protocol/create_room';
import { JoinRoomMsg } from '../../../../../common/protocol/join_room';

@Component({
  selector: 'roomlist',
  template: `
  <h3>list of rooms awaiting for players to start</h3>
  <button (click)="onRefreshButtonClick()" >Refresh</button>
  <button (click)="onCreateRoomButtonClick()">Create Room</button>
  <p-table [value]="rooms" 
           selectionMode="single" 
           [(selection)]="selectedRoom" 
           (onRowSelect)="onRowSelect($event)" 
           dataKey="id" >
    <ng-template pTemplate="header">
        <tr>
            <th>Name</th>
            <th>#Players</th>
            <th>room id</th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-room >
        <tr [pSelectableRow]="room" >
            <td>{{room.name}}</td>
            <td>{{room.num_of_players}}</td>
            <td>{{room.id}}</td>
        </tr>
    </ng-template>
  </p-table>
  `,
})
export class RoomlistComponent implements OnInit {

  rooms: Room[];
  selectedRoom: Room;

  constructor(
    private authService: AuthService,
    private wss: WebsocketClientService,
    private router: Router,
  ) {}

  refresh() {
    this.wss.call( new GetRoomList(), (rl: RoomList) => this.rooms = rl.rooms );
  }

  ngOnInit(): void {
    this.refresh();
    this.wss.subscribeOnMessage(
      `x${new RoomHasBeenCreated(null).event_type}`,  // TODO: this sucks
      (msg: RoomHasBeenCreated) => {
        console.log( msg );
        this.rooms = [ new Room(msg.room.name, msg.room.num_of_players, msg.room.id ), ... this.rooms ];
      }
    );
  }

  onRowSelect(event) {
    console.log( `navigate to ${this.selectedRoom.id}` );
    this.wss.call( 
      new JoinRoomMsg( this.selectedRoom.id ), 
      undefined, // no reponse - no handler
      () => this.router.navigate( ['./createroom', +event.data.id] ) // call after sending
    );
  }

  onRefreshButtonClick() {
    this.refresh();
  }

  onCreateRoomButtonClick() {
    this.wss.call(
      new CreateRoomMsg( `${this.authService.username}'s room` ), // TODO: + user_id / owner_id
      (resp: RoomCreatedResp) => {
        switch ( resp.result ) {
          case Result.RESULT_OK:
            this.router.navigate( ['./createroom', +resp.roomid] );
          break;
          case Result.RESULT_FAIL:
            alert( resp.errormsg );
          break;
        }
      }
    );
  }

}
