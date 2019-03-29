import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetRoomListReq, RoomListResp } from '../../../../../common/protocol/get_room_list';
import { CreateRoomReq, RoomCreatedResp } from '../../../../../common/protocol/create_room';
import { Result, EVENT_TYPE } from '../../../../../common/protocol/msg_types';
import { RoomDTO } from '../../../../../common/protocol/dto/room_dto';
import { AuthService } from '../../services/auth.service';
import { RoomCreatedEvent } from '../../../../../common/protocol/create_room';
import { JoinRoomReq, JoinRoomResp } from '../../../../../common/protocol/join_room';
import { WebsocketService } from '../../services/webosocket.service';

@Component({
  selector: 'roomlist',
  template: `
  <h3>list of rooms awaiting for players to start</h3>
  <button (click)="onRefreshButtonClick()" >Refresh</button>
  <button (click)="onCreateRoomButtonClick()">Create Room</button>

  <table>
    <tr>
      <th>Name</th>
      <th>#Players</th>
      <th>room id</th>
    </tr>
    <tr *ngFor=" let room of rooms "
        (click)="onRowSelect(room)" >
      <td>{{room.name}}</td>
      <td>{{room.num_of_players}}</td>
      <td>{{room.id}}</td>
    </tr>
  </table>

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
      new GetRoomListReq(),
      (rl: RoomListResp) => this.rooms = rl.rooms
    );
  }

  ngOnInit(): void {
    this.refresh();
    this.wss.subscribeOnMessage(
      EVENT_TYPE.ROOM_HAS_BEEN_CREATED,
      (msg: RoomCreatedEvent) =>
        this.rooms = [ new RoomDTO(msg.room.name, msg.room.num_of_players, msg.room.id ), ... this.rooms ]
    );
  }

  onRowSelect(room) {
    // this.selectedRoom = room;
    console.log( `navigate to ${room.id}` );
    this.wss.call(
      new JoinRoomReq( room.id ),
      (resp: JoinRoomResp) => {
        if (resp.result === Result.RESULT_OK) {
          this.router.navigate( ['./createroom', +room.id] );
        } else {
          alert( resp.errormsg );
        }
      }
    );
  }

  onRefreshButtonClick() {
    this.refresh();
  }

  onCreateRoomButtonClick() {
    this.wss.call(
      new CreateRoomReq( `${this.authService.username}'s room` ), // TODO: + user_id / owner_id
      (resp: RoomCreatedResp) => {
        switch ( resp.result ) {
          case Result.RESULT_OK:
            this.router.navigate( ['./createroom', +resp.room_id] );
          break;
          case Result.RESULT_FAIL:
            alert( resp.errormsg );
          break;
        }
      }
    );
  }

}
