import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixEntriesComponent } from './fix-entries.component';

describe('FixEntriesComponent', () => {
  let component: FixEntriesComponent;
  let fixture: ComponentFixture<FixEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
