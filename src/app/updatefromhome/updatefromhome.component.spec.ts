import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatefromhomePage } from './updatefromhome.page';

describe('UpdatefromhomePage', () => {
  let component: UpdatefromhomePage;
  let fixture: ComponentFixture<UpdatefromhomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatefromhomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatefromhomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
