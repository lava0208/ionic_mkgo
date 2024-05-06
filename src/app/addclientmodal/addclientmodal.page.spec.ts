import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclientmodalPage } from './addclientmodal.page';

describe('AddclientmodalPage', () => {
  let component: AddclientmodalPage;
  let fixture: ComponentFixture<AddclientmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddclientmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclientmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
