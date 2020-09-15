import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3FailuresGraphComponent } from './d3-failures-graph.component';

describe('D3FailuresGraphComponent', () => {
  let component: D3FailuresGraphComponent;
  let fixture: ComponentFixture<D3FailuresGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3FailuresGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3FailuresGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
