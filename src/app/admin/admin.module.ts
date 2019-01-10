import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EditEntryComponent} from './edit-entry/edit-entry.component';
import {LoginComponent} from './login/login.component';
import {MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatRadioModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {ImageToDataUrlModule} from 'ngx-image2dataurl';
import {FixEntriesComponent} from './fix-entries/fix-entries.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';

const appRoutes: Routes = [
  {path: 'edit-entry/:entryId', component: EditEntryComponent},
  {path: 'login', component: LoginComponent},
  {path: 'fix-entries', component: FixEntriesComponent},
  {path: '**', redirectTo: 'login'},
];

@NgModule({
  declarations: [
    EditEntryComponent,
    LoginComponent,
    FixEntriesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      appRoutes
    ),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    AngularFireAuthModule,
    AgmCoreModule,
    MatRadioModule,
    ImageToDataUrlModule,
    AngularFireStorageModule,
    MatButtonToggleModule
  ]
})
export class AdminModule {
}
