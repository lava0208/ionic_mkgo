import { TestBed } from '@angular/core/testing';

import { CourseClientService } from './course-client.service';

describe('CourseClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseClientService = TestBed.get(CourseClientService);
    expect(service).toBeTruthy();
  });
});
