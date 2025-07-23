/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OnBoardingService } from './on-boarding.service';

describe('Service: OnBoarding', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnBoardingService]
    });
  });

  it('should ...', inject([OnBoardingService], (service: OnBoardingService) => {
    expect(service).toBeTruthy();
  }));
});
