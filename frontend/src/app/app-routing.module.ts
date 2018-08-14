import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/signin/signin.component';
import { RoomlistComponent } from './components/roomlist/roomslist.component';
import { CreateRoomComponent } from './components/createroom/createroom.component';
import { GamePlayComponent } from './components/gameplay/gameplay.component';
import { AuthGuard } from './guards/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/roomlist', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'roomlist',   component: RoomlistComponent, canActivate: [AuthGuard] },
  { path: 'settings',   component: SettingsComponent },
  { path: 'signin',     component: SignInComponent },
  { path: 'createroom/:id', component: CreateRoomComponent, canActivate: [AuthGuard] },
  { path: 'gameplay/:id',   component: GamePlayComponent, canActivate: [AuthGuard] }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
