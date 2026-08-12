import { TestBed } from '@angular/core/testing';

import { PiletasService } from './PiletasService';

describe('Piletas', () => {
  let service: PiletasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiletasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
