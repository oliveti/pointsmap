package com.osoft.pointsmap.ftimporter;

import com.google.firebase.tasks.Task;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class FtImporterService {

  void importFile() throws IOException, URISyntaxException, ExecutionException, InterruptedException {

    FirebaseService firebaseService = new FirebaseService();

    firebaseService.init();

    List<Entry> entries = this.readLines();

    this.downloadPhotos(entries);

    List<Task<Void>> tasks = new ArrayList<>();

    for (Entry entry : entries) {
      tasks.add(firebaseService.updateEntry(entry));
    }

  }

  List<Entry> readLines() throws IOException, URISyntaxException {

    URI fileUri = Ftimporter.class.getClassLoader().getResource("objectif_bieres.csv").toURI();

    List<String> lines = Files.readAllLines(Paths.get(fileUri));
    List<Entry> entries = new ArrayList<>(lines.size());

    for (String line : lines.subList(1, lines.size())) {
      String[] values = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");

      Entry entry = new Entry();

      switch (values[0]) {
        case "large_green":
          entry.marker = "green-dot";
          break;
        case "large_red":
          entry.marker = "red-dot";
          break;
        case "large_yellow":
        default:
          entry.marker = "yellow-dot";
          break;
      }

      entry.name = values[1].replace("\"", "");
      String[] coords = values[2].replace("\"", "").split(",");

      entry.getAddress().latitude = Float.parseFloat(coords[0]);
      entry.getAddress().longitude = Float.parseFloat(coords[1]);

      entry.getAddress().address = values[3].replace("\"", "");
      entry.brewery = values[4];
      entry.photoUrl = values[5];
      entry.createdDate = values[6];

      entries.add(entry);
    }

    return entries;
  }

  void downloadPhotos(List<Entry> entries) throws IOException {
    for (Entry entry : entries) {
      if (entry.photoUrl.length() == 0) {
        System.err.println("Image not defined for entry : " + entry.name);
        continue;
      }

      File file = new File("photos/" + entry.name + ".jpg");

      if (!file.exists()) {
        URL photoUrl = new URL(entry.photoUrl);
        BufferedImage img = ImageIO.read(photoUrl);
        ImageIO.write(img, "jpg", file);
      }

      entry.photo = file;
    }
  }
}
