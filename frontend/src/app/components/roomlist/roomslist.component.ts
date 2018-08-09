import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { GetRoomList, RoomList, Room } from '../../../../../common/protocol/get_room_list';
import { CreateRoomMsg, RoomCreatedResp } from '../../../../../common/protocol/create_room';
import { Result } from '../../../../../common/protocol/msg_types';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'roomlist',
  template: `
  <h3>list of rooms awaiting for players to start</h3>
  <button (click)="onRefreshButtonClick()" >Refresh</button>
  <button (click)="onCreateRoomButtonClick()">Create Room</button>
  <p-table [value]="rooms">
    <ng-template pTemplate="header">
        <tr>
            <th>Name</th>
            <th>#Players</th>
            <th>room id</th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-room>
        <tr>
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
