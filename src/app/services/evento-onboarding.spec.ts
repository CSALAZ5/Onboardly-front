import { TestBed } from '@angular/core/testing';

import { EventoOnboarding } from './evento-onboarding';

describe('EventoOnboarding', () => {
  let service: EventoOnboarding;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventoOnboarding);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
