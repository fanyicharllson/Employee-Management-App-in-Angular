import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEmployees } from './project-employees';

describe('ProjectEmployees', () => {
  let component: ProjectEmployees;
  let fixture: ComponentFixture<ProjectEmployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEmployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEmployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
