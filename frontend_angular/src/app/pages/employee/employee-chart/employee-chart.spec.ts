import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChart } from './employee-chart';

describe('EmployeeChart', () => {
  let component: EmployeeChart;
  let fixture: ComponentFixture<EmployeeChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
