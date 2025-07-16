import { TestBed } from '@angular/core/testing';

import { ScrollToSection } from './scroll-to-section';

describe('ScrollToSection', () => {
  let service: ScrollToSection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollToSection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
