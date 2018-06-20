import { BrowserModule }from '@angular/platform-browser';
import { NgModule }     from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// PrimeNG components
import {ButtonModule}     from 'primeng/button';
import {RadioButtonModule}from 'primeng/radiobutton';
import {CalendarModule}   from 'primeng/calendar';
import {ListboxModule}    from 'primeng/listbox';

import { AppComponent }       from './app.component';
import { RoomlistComponent }  from './roomslist.component';
import { GamePlayComponent }  from './gameplay.component';
import { CreateRoomComponent }from './createroom.component';
import { AppRoutingModule }   from './app-routing.module';
import { InRoomComponent }    from './inroom';
import { SignInComponent }    from './signin.component';
import { OwlComponent }       from './owl.component';

import { WebsocketService } from './services/websocket.service';

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
    ListboxModule
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
