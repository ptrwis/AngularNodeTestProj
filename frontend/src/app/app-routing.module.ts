import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/signin/signin.component';
import { RoomlistComponent } from './components/roomlist/roomslist.component';
import { CreateRoomComponent } from './components/createroom/createroom.component';
import { GamePlayComponent } from './components/gameplay/gameplay.component';
import { AuthGuard } from './guards/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { CollisionsComponent } from './components/collisions/collisions.component';
import { ThrowsgraphComponent } from './components/throwsgraph/throwsgraph.component';
import { StylingComponent } from './components/styling/styling.component';
import { FortumoComponent } from './components/fortumo/fortumo.component';
import { WebRtcComponent } from './components/webrtc/webrtc.component';
import { AsdComponent } from './components/asd/asd.component';

const routes: Routes = [
  { path: '', redirectTo: '/roomlist', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'roomlist',       component: RoomlistComponent, canActivate: [AuthGuard] },
  { path: 'settings',       component: SettingsComponent },
  { path: 'signin',         component: SignInComponent },
  { path: 'collisions',     component: CollisionsComponent },
  { path: 'throws',         component: ThrowsgraphComponent },
  { path: 'styling',        component: StylingComponent },
  { path: 'fortumo',        component: FortumoComponent },
  { path: 'webrtc',         component: WebRtcComponent },
  { path: 'createroom/:id', component: CreateRoomComponent, canActivate: [AuthGuard] },
  { path: 'gameplay/:id',   component: GamePlayComponent, canActivate: [AuthGuard] },
  { path: 'asd',            component: AsdComponent}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
