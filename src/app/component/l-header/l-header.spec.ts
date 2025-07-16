import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LHeader } from './l-header';

describe('LHeader', () => {
  let component: LHeader;
  let fixture: ComponentFixture<LHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
