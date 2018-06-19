import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent }         from './app.component';
import { SignInComponent }      from './signin.component';
import { RoomlistComponent }    from './roomslist.component';
import { CreateRoomComponent }  from './createroom.component';
import { InRoomComponent }      from './inroom';
import { GamePlayComponent }    from './gameplay.component';

const routes: Routes = [
  { path: '', redirectTo: '/roomlist', pathMatch: 'full' },
  { path: 'roomlist',   component: RoomlistComponent },
  { path: 'signin',     component: SignInComponent },
  { path: 'createroom', component: CreateRoomComponent },
  { path: 'gameplay',   component: GamePlayComponent },
  { path: 'inroom',     component: InRoomComponent },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
