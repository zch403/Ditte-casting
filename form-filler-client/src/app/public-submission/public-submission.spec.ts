import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSubmissionComponent } from './public-submission.component';

describe('PublicSubmission', () => {
  let component: PublicSubmissionComponent;
  let fixture: ComponentFixture<PublicSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
