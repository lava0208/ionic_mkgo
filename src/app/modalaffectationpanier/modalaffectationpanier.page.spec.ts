import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalaffectationpanierPage } from './modalaffectationpanier.page';

describe('ModalaffectationpanierPage', () => {
  let component: ModalaffectationpanierPage;
  let fixture: ComponentFixture<ModalaffectationpanierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalaffectationpanierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalaffectationpanierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
