import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]), // provides Router/ActivatedRoute
        HttpClientTestingModule,           // provides HttpClient
      ],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it(`should have the 'band-recruiting-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('band-recruiting-app');
  });
});
