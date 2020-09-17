import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularD3Component } from './angular-d3.component';

describe('AngularD3Component', () => {
  let component: AngularD3Component;
  let fixture: ComponentFixture<AngularD3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularD3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
