import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EntriesService} from '../../entries/entries.service';
import {Address} from '../../entries/address.model';
import {MapsAPILoader} from '@agm/core';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import * as _ from 'lodash';
import {Entry} from '../../entries/entry.model';
import {IMAGE_FILE_PROCESSOR, ImageResult, Options} from 'ngx-image2dataurl';
import {storage} from 'firebase/app';
import {RotateImageFileProcessor} from './rotate-image-file-processor';
import {UploadMetadata, UploadTaskSnapshot} from '@angular/fire/storage/interfaces';
import TaskState = storage.TaskState;
import TaskEvent = storage.TaskEvent;
import StringFormat = storage.StringFormat;
import FirestoreError = firebase.firestore.FirestoreError;
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'pm-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
  providers: [{
    provide: IMAGE_FILE_PROCESSOR,
    useClass: RotateImageFileProcessor,
    multi: true
  }]
})
export class EditEntryComponent implements OnInit {

  entryForm: FormGroup;

  entry: Entry;

  address: Address;
  photo: string;

  zoom: number;

  showMap = false;

  uploadProgress: number;

  imageUploadOptions: Options;

  message: string;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private entriesService: EntriesService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private router: Router,
              private angularFireStorage: AngularFireStorage,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.imageUploadOptions = {
      resize: {
        maxHeight: 1536,
        maxWidth: 2048
      }
    };

    this.activatedRoute.params.pipe(switchMap(routeParams => {
      const entryId = routeParams['entryId'];

      if (!_.isNil(entryId) && entryId !== '0') {
        return this.entriesService.getEntry(entryId);
      } else {
        this.entry = this.entriesService.createEntry();
        this.entry.createdDate = new Date().getTime();

        return of(this.entry);
      }
    })).subscribe(entry => {
      this.entry = entry;
      this.entryForm = this.formBuilder.group({
        name: [this.entry.name, Validators.required],
        brewery: [this.entry.brewery, Validators.required],
        photo: [this.entry.photo, Validators.required],
        marker: [this.entry.marker ? this.entry.marker : 'yellow-dot', Validators.required],
        address: [this.entry.address ? this.entry.address.address : '', Validators.required],
      });

      this.photo = this.entry.photo;

      setTimeout(() => this.initMap());
    });
  }

  initMap() {
    // set google maps defaults
    this.zoom = 4;

    if (!this.entry.address || !this.entry.address.address) {
      this.address = new Address();

      this.address.latitude = 39.8282;
      this.address.longitude = -98.5795;
    } else {
      this.address = this.entry.address;

      this.zoom = 10;
    }

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: []
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.address.placeId = place.place_id;
          this.address.name = place.name;
          this.address.address = place.formatted_address;
          this.address.website = place.website;
          this.address.mapUrl = place.url;

          if (!this.entryForm.value.brewery) {
            this.entryForm.get('brewery').setValue(place.name);
          }

          // set latitude, longitude and zoom
          this.address.latitude = place.geometry.location.lat();
          this.address.longitude = place.geometry.location.lng();
          this.zoom = 10;
        });
      });
    });
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  photoSelected(fileResult: ImageResult) {
    try {
      this.uploadPhoto(fileResult.resized.dataURL);
    } catch (err) {
      console.log(err);
    }
  }

  uploadPhoto(photoBase64: string) {

    const metadata: UploadMetadata = {
      contentType: 'image/jpeg'
    };

    const uploadTask = this.angularFireStorage.storage.ref().child(
      'test/' + this.entry.id + '_' + new Date().getTime() + '.jpg')
      .putString(photoBase64, StringFormat.DATA_URL, metadata);

    this.photo = null;

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(TaskEvent.STATE_CHANGED,
      (snapshot: UploadTaskSnapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        this.uploadProgress = progress;

        switch (snapshot.state) {
          case TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case TaskState.RUNNING: // or 'running'
            break;
        }
      }, (error: FirestoreError) => {

        console.error(error);

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'permission-denied':
            // User doesn't have permission to access the object
            break;

          case 'cancelled':
            // User canceled the upload
            break;

          case 'unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
          this.photo = downloadUrl;
        });
      }
    );
  }

  onSubmit() {

    this.entry.name = this.entryForm.value.name;
    this.entry.brewery = this.entryForm.value.brewery;
    this.entry.marker = this.entryForm.value.marker;

    if (this.photo) {
      this.entry.photo = this.photo;
    }

    this.entry.address = this.address;

    if (this.entry.address && this.entry.address.website === undefined) {
      this.entry.address.website = '';
    }

    try {
      this.entriesService.saveEntry(this.entry)
        .then(result => {
            this.message = 'Saved !';
            this.router.navigate(['/entries']);
          }
        ).catch(error => {
        console.error(error);
      });
    } catch (error) {
      this.message = error;
      console.error(error);
    }

  }

  private setCurrentPosition() {
    if (!this.entry.address && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.address.latitude = position.coords.latitude;
        this.address.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}
