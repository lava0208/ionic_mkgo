import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatestatusPage } from './updatestatus.page';

describe('UpdatestatusPage', () => {
  let component: UpdatestatusPage;
  let fixture: ComponentFixture<UpdatestatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatestatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatestatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
