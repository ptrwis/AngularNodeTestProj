import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { SignInComponent } from './components/signin/signin.component';
import { RoomlistComponent } from './components/roomlist/roomslist.component';
import { CreateRoomComponent } from './components/createroom/createroom.component';
import { InRoomComponent } from './components/inroom/inroom';
import { GamePlayComponent } from './components/gameplay/gameplay.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/roomlist', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'roomlist',   component: RoomlistComponent, canActivate: [AuthGuard] },
  { path: 'signin',     component: SignInComponent },
  { path: 'createroom', component: CreateRoomComponent, canActivate: [AuthGuard] },
  { path: 'gameplay',   component: GamePlayComponent, canActivate: [AuthGuard] },
  { path: 'inroom',     component: InRoomComponent, canActivate: [AuthGuard] },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
