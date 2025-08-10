// src/app/auth/register/register.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { InstrumentService } from '../../core/services/instrument.service';
import { Instrument } from '../../core/models/instrument.model'; 

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let instrumentSpy: jasmine.SpyObj<InstrumentService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    authSpy.register.and.returnValue(of({ token: 'fake.jwt.token' }));

    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'put', 'delete']);
    httpSpy.post.and.returnValue(of({}));
    httpSpy.get.and.returnValue(of([])); // bands list used in ngOnInit

    instrumentSpy = jasmine.createSpyObj('InstrumentService', ['getAllInstruments']);
 instrumentSpy.getAllInstruments.and.returnValue(
  of([{ id: 1, name: 'Piano' } as Instrument]) // id as number
);

    const routerEvents$ = new Subject<any>();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'], { events: routerEvents$.asObservable() });

    const routeStub = {
      snapshot: {
        queryParams: {},
        queryParamMap: convertToParamMap({}),
      },
      queryParams: of({}),
      queryParamMap: of(convertToParamMap({})),
      params: of({}),
      data: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: InstrumentService, useValue: instrumentSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit subscriptions
  });

  it('should call AuthService.register on submit', () => {
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',     // required in the form
      role: 'Student',         // required in the form
      instrument: '',          // optional
      bandId: '',              // optional
      password: 'password123',
      confirmPassword: 'password123'
    } as any);

    component.onSubmit();
    expect(authSpy.register).toHaveBeenCalled();
  });
});
