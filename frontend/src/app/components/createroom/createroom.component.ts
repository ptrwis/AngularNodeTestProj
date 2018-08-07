import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { CreateRoomMsg, RoomCreatedResp } from './../../../../../common/protocol/create_room';
import { Result } from '../../../../../common/protocol/msg_types';

@Component({
  selector: 'createroom',
  template: `
  <h3>create room</h3>
  <input type="text" pInputText [(ngModel)]="roomname" placeholder="Cafe Luna">
  <button (click)="onCreateRoomButtonClick()" >Create</button>
  `,
})
export class CreateRoomComponent implements OnInit {

  roomname: string;

  constructor(
    private wss: WebsocketClientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  onCreateRoomButtonClick(){
    this.wss.call( 
      new CreateRoomMsg(this.roomname), 
      (resp: RoomCreatedResp) => { 
        switch( resp.result ){
          case Result.RESULT_OK:
            let navigationExtras: NavigationExtras = {
              queryParams: { 'room_id': resp.roomid }
            };
            this.router.navigate(['./inroom'], navigationExtras);
          break;
          case Result.RESULT_FAIL:
            alert( resp.errormsg );
          break;
        }
      }
    );
  }

}
