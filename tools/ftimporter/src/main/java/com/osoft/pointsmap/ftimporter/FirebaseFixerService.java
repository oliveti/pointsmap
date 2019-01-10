package com.osoft.pointsmap.ftimporter;

import com.google.firebase.database.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Semaphore;

public class FirebaseFixerService {

  void fix() throws IOException, URISyntaxException, ExecutionException, InterruptedException {

    FirebaseService firebaseService = new FirebaseService();

    firebaseService.init();

    final FirebaseDatabase database = FirebaseDatabase.getInstance();

    DatabaseReference entriesRef = database.getReference().child("/entries");

    final Semaphore semaphore = new Semaphore(0);

    entriesRef.addValueEventListener(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot snapshot) {
        System.out.println(snapshot.getChildrenCount());

        for (DataSnapshot postSnapshot : snapshot.getChildren()) {
          Entry entry = postSnapshot.getValue(Entry.class);
          System.out.println(entry.name);
        }

        semaphore.release();
      }

      @Override
      public void onCancelled(DatabaseError error) {
        System.out.println("Error");
      }
    });

    // wait until the onDataChange callback has released the semaphore
    semaphore.acquire();

  }
}
