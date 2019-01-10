import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map.component';
import {AgmCoreModule} from '@agm/core';
import {EntriesModule} from '../entries/entries.module';
import {AngularFirestoreModule} from '@angular/fire/firestore';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    AngularFirestoreModule,
    EntriesModule
  ],
  providers: [],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class MapModule {
}
