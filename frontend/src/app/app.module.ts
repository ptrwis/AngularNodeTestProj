import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app/app.component';
import { RoomlistComponent } from './components/roomlist/roomslist.component';
import { GamePlayComponent } from './components/gameplay/gameplay.component';
import { CreateRoomComponent } from './components/createroom/createroom.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './components/signin/signin.component';
import { OwlComponent } from './components/owl/owl.component';
import { CollisionsComponent } from './components/collisions/collisions.component';
import { StylingComponent } from './components/styling/styling.component';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/webosocket.service';
import { ThrowsgraphComponent } from './components/throwsgraph/throwsgraph.component';
import { FortumoComponent } from './components/fortumo/fortumo.component';
import { WebRtcComponent } from './components/webrtc/webrtc.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateRoomComponent,
    GamePlayComponent,
    RoomlistComponent,
    SignInComponent,
    SettingsComponent,
    OwlComponent,
    CollisionsComponent,
    ThrowsgraphComponent,
    StylingComponent,
    FortumoComponent,
    WebRtcComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    WebsocketService,
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
