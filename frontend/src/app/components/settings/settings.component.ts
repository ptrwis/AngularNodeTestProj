import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketClientService } from '../../services/websocket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'settings',
  template: `
  <h3>Settings</h3>
  `,
})
export class SettingsComponent {

  constructor(
    private authService: AuthService,
    private wss: WebsocketClientService,
    private router: Router,
  ) {}

}
