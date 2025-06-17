import { TestBed } from '@angular/core/testing';

import { Colaborador } from './colaborador';

describe('Colaborador', () => {
  let service: Colaborador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Colaborador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
