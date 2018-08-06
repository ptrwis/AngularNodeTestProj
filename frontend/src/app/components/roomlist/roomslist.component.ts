import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { GetRoomList, RoomList, Room } from '../../../../../common/protocol/get_room_list';

@Component({
  selector: 'roomlist',
  template: `
  <h3>room list</h3>
  <button (click)="onRefreshButtonClick()" >Refresh</button>
  <button>Create</button>
  <p-table [value]="rooms">
    <ng-template pTemplate="header">
        <tr>
            <th>Name</th>
            <th>#Players</th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-room>
        <tr>
            <td>{{room.name}}</td>
            <td>{{room.num_of_players}}</td>
        </tr>
    </ng-template>
  </p-table>
  `,
})
export class RoomlistComponent implements OnInit {

  rooms: Room[];

  constructor(
    private wss: WebsocketClientService,
    private router: Router,
  ) {}

  refresh(){
    this.rooms = [];
    let numOfRooms = Math.floor(Math.random()*10)+1;
    for( let i=0; i<numOfRooms; i++ ){
      let numOfPlayers = Math.floor(Math.random()*10);
      let roomName = 'Room_'+Math.floor(Math.random()*100);
      this.rooms = [ new Room( roomName, numOfPlayers), ...this.rooms ];
    }
    // this.wss.call( new GetRoomList(), (rl: RoomList) => this.rooms = rl.rooms );
  }

  ngOnInit(): void {
    this.refresh();
  }

  onRefreshButtonClick(){
    this.refresh();
  }

}
