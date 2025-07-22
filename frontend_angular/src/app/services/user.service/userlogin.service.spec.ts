/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { UserloginService } from './user.login.service';

describe('Service: Userlogin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserloginService]
    });
  });

  it('should ...', inject([UserloginService], (service: UserloginService) => {
    expect(service).toBeTruthy();
  }));
});
