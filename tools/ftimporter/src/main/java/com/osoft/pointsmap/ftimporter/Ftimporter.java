package com.osoft.pointsmap.ftimporter;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.concurrent.ExecutionException;

public class Ftimporter {

  public static void main(String[] args) throws IOException, URISyntaxException, InterruptedException, ExecutionException {
    FirebaseFixerService fixerService = new FirebaseFixerService();
    fixerService.fix();
  }

}
