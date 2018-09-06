import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetRoomList, RoomList } from '../../../../../common/protocol/get_room_list';
import { CreateRoomMsg, RoomCreatedResp } from '../../../../../common/protocol/create_room';
import { Result, EVENT_TYPE } from '../../../../../common/protocol/msg_types';
import { RoomDTO } from '../../../../../common/protocol/dto/room_dto';
import { AuthService } from '../../services/auth.service';
import { RoomHasBeenCreated } from '../../../../../common/protocol/create_room';
import { JoinRoomMsg } from '../../../../../common/protocol/join_room';
import { WebsocketService } from '../../services/webosocket.service';

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

  rooms: RoomDTO[];
  selectedRoom: RoomDTO;

  constructor(
    private authService: AuthService,
    private wss: WebsocketService,
    private router: Router,
  ) {}

  refresh() {
    this.wss.call(
      new GetRoomList(),
      (rl: RoomList) => this.rooms = rl.rooms
    );
  }

  ngOnInit(): void {
    this.refresh();
    this.wss.subscribeOnMessage(
      EVENT_TYPE.ROOM_HAS_BEEN_CREATED,
      (msg: RoomHasBeenCreated) =>
        this.rooms = [ new RoomDTO(msg.room.name, msg.room.num_of_players, msg.room.id ), ... this.rooms ]
    );
  }

  onRowSelect(event) {
    console.log( `navigate to ${this.selectedRoom.id}` );
    this.wss.send(
      new JoinRoomMsg( this.selectedRoom.id ),
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
