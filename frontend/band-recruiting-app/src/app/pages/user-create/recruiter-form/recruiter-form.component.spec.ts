import { ComponentFixture, TestBed }      from '@angular/core/testing';
import { RecruiterFormComponent }         from './recruiter-form.component';
import { HttpClientTestingModule }        from '@angular/common/http/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


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

    component.group = new FormGroup({ bandId: new FormControl('') });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
