import { ComponentFixture, TestBed }      from '@angular/core/testing';
import { RecruiterFormComponent }         from './recruiter-form.component';
import { HttpClientTestingModule }        from '@angular/common/http/testing';
import { ReactiveFormsModule }            from '@angular/forms';

describe('RecruiterFormComponent', () => {
  let fixture: ComponentFixture<RecruiterFormComponent>;
  let component: RecruiterFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecruiterFormComponent,     // standalone
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RecruiterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
