import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// PrimeNG components
import {ButtonModule} from 'primeng/button';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import {ListboxModule} from 'primeng/listbox';
import {TableModule} from 'primeng/table';

import { AppComponent } from './components/app/app.component';
import { RoomlistComponent } from './components/roomlist/roomslist.component';
import { GamePlayComponent } from './components/gameplay/gameplay.component';
import { CreateRoomComponent } from './components/createroom/createroom.component';
import { AppRoutingModule } from './app-routing.module';
import { InRoomComponent } from './components/inroom/inroom';
import { SignInComponent } from './components/signin/signin.component';
import { OwlComponent } from './components/owl/owl.component';

import { WebsocketClientService } from './services/websocket.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateRoomComponent,
    GamePlayComponent,
    InRoomComponent,
    RoomlistComponent,
    SignInComponent,
    OwlComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    ButtonModule,
    RadioButtonModule,
    BrowserAnimationsModule,
    CalendarModule,
    ListboxModule,
    TableModule
  ],
  providers: [
    WebsocketClientService,
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
