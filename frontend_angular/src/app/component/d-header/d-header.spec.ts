import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DHeader } from './d-header';

describe('DHeader', () => {
  let component: DHeader;
  let fixture: ComponentFixture<DHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
