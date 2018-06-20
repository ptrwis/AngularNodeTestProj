import { MyEnum } from './domain/myenum';
import { Component, OnInit } from '@angular/core';
import { Developer } from './domain/developer';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'maj app';
  wss: WebsocketService;

  constructor( websocketService: WebsocketService) {
    this.wss = websocketService;
  }

  ngOnInit(): void {
  }

  getState() {
    return this.wss.getState();
  }

  wsconnect() {
    this.wss.connect();
  }

  wsdisconnect() {
    this.wss.disconnect();
  }

}
