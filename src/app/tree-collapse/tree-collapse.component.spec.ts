import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeCollapseComponent } from './tree-collapse.component';

describe('TreeCollapseComponent', () => {
  let component: TreeCollapseComponent;
  let fixture: ComponentFixture<TreeCollapseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeCollapseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
