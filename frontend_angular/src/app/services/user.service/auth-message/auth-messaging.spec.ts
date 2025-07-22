import { TestBed } from '@angular/core/testing';

import { AuthMessaging } from './auth-messaging';

describe('AuthMessaging', () => {
  let service: AuthMessaging;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthMessaging);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
