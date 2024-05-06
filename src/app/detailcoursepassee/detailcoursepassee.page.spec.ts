import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailcoursepasseePage } from './detailcoursepassee.page';

describe('DetailcoursepasseePage', () => {
  let component: DetailcoursepasseePage;
  let fixture: ComponentFixture<DetailcoursepasseePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailcoursepasseePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailcoursepasseePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
