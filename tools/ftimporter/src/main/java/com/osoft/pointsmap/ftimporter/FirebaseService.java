package com.osoft.pointsmap.ftimporter;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.tasks.Task;
import com.google.firebase.tasks.Tasks;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class FirebaseService {

  void init() throws IOException {
    InputStream serviceAccount =
      FirebaseService.class.getClassLoader().getResourceAsStream("firebase_key.json");

    FirebaseOptions options = new FirebaseOptions.Builder()
      .setCredentials(GoogleCredentials.fromStream(serviceAccount))
      .setDatabaseUrl("https://pointsmap-128a7.firebaseio.com")
      .setStorageBucket("pointsmap-128a7.appspot.com")
      .build();

    FirebaseApp.initializeApp(options);
  }


  Task<Void> updateEntry(Entry entry) throws IOException, ExecutionException, InterruptedException {
    final FirebaseDatabase database = FirebaseDatabase.getInstance();

    DatabaseReference entriesRef = database.getReference().child("/entries");
    DatabaseReference newEntryRef = entriesRef.push();

    entry.setFbId(newEntryRef.getKey());

    this.uploadPhoto(entry);

    Task<Void> task = newEntryRef.setValue(entry);

    Tasks.await(task);

    return task;
  }

  void uploadPhoto(Entry entry) throws IOException {
    final StorageClient storageClient = StorageClient.getInstance();

    Bucket bucket = storageClient.bucket();

    Blob blob = bucket.create(entry.fbId, Files.readAllBytes(Paths.get(entry.getPhoto().toURI())));

    entry.fbPhotoUrl = blob.signUrl(10000, TimeUnit.DAYS).toString();
  }

}
