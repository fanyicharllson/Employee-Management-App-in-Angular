import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNotification } from './show-notification';

describe('ShowNotification', () => {
  let component: ShowNotification;
  let fixture: ComponentFixture<ShowNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
