import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';

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
    /*
    this.wss.call( 
      new CreateRoom(this.roomname), 
      (sr: SimpleResult) => sr.result == true ? route ... : sroute
    );
    */
  }

}
