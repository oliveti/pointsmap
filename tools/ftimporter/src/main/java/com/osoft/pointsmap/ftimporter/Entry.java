package com.osoft.pointsmap.ftimporter;

import com.google.firebase.database.Exclude;
import com.google.firebase.database.PropertyName;

import java.io.File;

public class Entry {

  String fbId;
  String fbPhotoUrl;

  String marker;
  Address address;
  String brewery;

  String name;

  String photoUrl;
  File photo;

  String createdDate;

  public Entry() {
    this.address = new Address();
  }

  public String getMarker() {
    return marker;
  }

  public void setMarker(String marker) {
    this.marker = marker;
  }

  public String getBrewery() {
    return brewery;
  }

  public void setBrewery(String brewery) {
    this.brewery = brewery;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhotoUrl() {
    return photoUrl;
  }

  public void setPhotoUrl(String photoUrl) {
    this.photoUrl = photoUrl;
  }

  @Exclude
  public File getPhoto() {
    return photo;
  }

  public void setPhoto(File photo) {
    this.photo = photo;
  }

  @Exclude
  public String getFbId() {
    return fbId;
  }

  public void setFbId(String fbId) {
    this.fbId = fbId;
  }

  @PropertyName("photo")
  public String getFbPhotoUrl() {
    return fbPhotoUrl;
  }

  public void setFbPhotoUrl(String fbPhotoUrl) {
    this.fbPhotoUrl = fbPhotoUrl;
  }

  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }
}
