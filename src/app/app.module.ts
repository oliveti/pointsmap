import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AgmCoreModule} from '@agm/core';
import {MapModule} from './map/map.module';
import {EntriesModule} from './entries/entries.module';
import {MatButtonModule, MatToolbarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from './map/map.component';
import {EntriesComponent} from './entries/entries/entries.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StatsModule} from './stats/stats.module';
import {StatsComponent} from './stats/stats/stats.component';
import {firebaseConfig} from '../environments/firebase.config';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import 'hammerjs';

const appRoutes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'entries', component: EntriesComponent},
  {path: 'stats', component: StatsComponent},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
  {path: '**', redirectTo: 'map'},
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot(
      appRoutes
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDT44rkxSuVWkD-4uqwbmmvNwwDkVyYVGM',
      libraries: ['places']
    }),
    MapModule,
    EntriesModule,
    StatsModule,
    MatToolbarModule,
    MatButtonModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
