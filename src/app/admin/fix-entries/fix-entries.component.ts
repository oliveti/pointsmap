import {Component, OnInit} from '@angular/core';
import {EntriesService} from '../../entries/entries.service';
import {isNumber} from 'util';
import {AngularFireStorage} from '@angular/fire/storage';
import {SettableMetadata} from '@angular/fire/storage/interfaces';

@Component({
  selector: 'pm-fix-entries',
  templateUrl: './fix-entries.component.html',
  styleUrls: ['./fix-entries.component.scss']
})
export class FixEntriesComponent implements OnInit {

  constructor(private entriesService: EntriesService,
              private firebaseStorage: AngularFireStorage) {
  }

  ngOnInit() {
    const sub = this.entriesService.getEntriesWithKeys().subscribe(entries => {

      sub.unsubscribe();

      let countBrokenIds = 0;

      entries.forEach(entry => {
        if (entry.firebaseKey !== entry.entry.id) {
          console.log(entry);

          entry.entry.id = entry.firebaseKey;

          this.entriesService.saveEntry(entry.entry);

          countBrokenIds++;
        }
      });

      console.log('fixed broken ids : ' + countBrokenIds);


      let countBrokenImages = 0;

      entries.forEach(entry => {
        if (entry.entry.photo.indexOf('Signature') > 0) {
          const fileName = entry.entry.photo.substring(entry.entry.photo.lastIndexOf('/') + 1, entry.entry.photo.lastIndexOf('?'));

          const ref = this.firebaseStorage.storage.ref('entries/' + fileName);

          ref.getDownloadURL().then(downloadUrl => {
            entry.entry.photo = downloadUrl;

            this.entriesService.saveEntry(entry.entry);
          });


          countBrokenImages++;

        } else {
          const fileName = entry.entry.photo.substring(entry.entry.photo.lastIndexOf('%2F') + 3, entry.entry.photo.lastIndexOf('?'));

          const ref = this.firebaseStorage.storage.ref('entries/' + fileName);

          ref.getMetadata().then(metadata => {
            if (metadata.contentType === undefined || metadata.contentType.length === 0) {
              const updatedMetadata: SettableMetadata = {
                contentType: 'image/jpeg'
              };
              ref.updateMetadata(updatedMetadata);
              countBrokenImages++;
            }

          });
        }

      });

      console.log('fixed broken photos : ' + countBrokenImages);

      let countBrokenDates = 0;

      entries.forEach(entry => {
        if (isNumber(entry.entry.createdDate) === false) {
          const date = new Date(entry.entry.createdDate);

          entry.entry.createdDate = date.getTime();

          this.entriesService.saveEntry(entry.entry);

          countBrokenDates++;
        }
      });

      console.log('fixed broken dates : ' + countBrokenDates);
    });
  }

}
