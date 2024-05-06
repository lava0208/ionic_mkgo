import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpanierPage } from './listpanier.page';

describe('ListpanierPage', () => {
  let component: ListpanierPage;
  let fixture: ComponentFixture<ListpanierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListpanierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpanierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
