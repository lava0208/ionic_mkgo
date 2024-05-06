import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecoursePage } from './updatecourse.page';

describe('UpdatecoursePage', () => {
  let component: UpdatecoursePage;
  let fixture: ComponentFixture<UpdatecoursePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatecoursePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
