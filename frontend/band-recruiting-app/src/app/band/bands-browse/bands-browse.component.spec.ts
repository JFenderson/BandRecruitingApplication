import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandsBrowseComponent } from './bands-browse.component';

describe('BandsBrowseComponent', () => {
  let component: BandsBrowseComponent;
  let fixture: ComponentFixture<BandsBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandsBrowseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
