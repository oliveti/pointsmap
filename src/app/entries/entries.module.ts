import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntriesComponent} from './entries/entries.component';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule,
    MatIconModule
  ],
  declarations: [EntriesComponent],
  exports: [EntriesComponent]
})
export class EntriesModule {
}
