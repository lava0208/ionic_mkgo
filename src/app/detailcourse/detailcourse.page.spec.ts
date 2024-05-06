import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailcoursePage } from './detailcourse.page';

describe('DetailcoursePage', () => {
  let component: DetailcoursePage;
  let fixture: ComponentFixture<DetailcoursePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailcoursePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailcoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
