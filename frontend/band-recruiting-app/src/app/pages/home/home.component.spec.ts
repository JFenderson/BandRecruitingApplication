import { ComponentFixture, TestBed }      from '@angular/core/testing';
import { HomeComponent }                  from './home.component';
import { RouterTestingModule }            from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule }        from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  // mock out whatever params/data your HomeComponent needs
  const activatedRouteStub = {
    snapshot: {
      paramMap: convertToParamMap({ /* your route params here */ }),
      data: {}                         // if you use resolved data
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,               // standalone!
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
