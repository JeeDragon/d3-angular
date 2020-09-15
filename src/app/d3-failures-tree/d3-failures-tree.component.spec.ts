import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3FailuresTreeComponent } from './d3-failures-tree.component';

describe('D3FailuresTreeComponent', () => {
  let component: D3FailuresTreeComponent;
  let fixture: ComponentFixture<D3FailuresTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3FailuresTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3FailuresTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
