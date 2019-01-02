import { TestBed, inject } from '@angular/core/testing';

import { BellService } from './bell.service';

describe('BellService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BellService]
    });
  });

  it('should be created', inject([BellService], (service: BellService) => {
    expect(service).toBeTruthy();
  }));
});
