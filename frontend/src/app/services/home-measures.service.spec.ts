import { TestBed } from '@angular/core/testing';

import { HomeMeasuresService } from './home-measures.service';

describe('HomeMeasuresService', () => {
  let service: HomeMeasuresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeMeasuresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
