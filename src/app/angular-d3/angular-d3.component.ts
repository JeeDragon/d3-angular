import { Component, OnInit } from '@angular/core';
import { treeData0 } from '../data/tree-data';
import * as d3 from 'd3';

@Component({
  selector: 'app-angular-d3',
  templateUrl: './angular-d3.component.html',
  styleUrls: [ './angular-d3.component.scss' ]
})
export class AngularD3Component implements OnInit {

  private svg;
  private width: number;
  private height: number;
  public data;
  private dy;
  public nodes;
  public links;
  public circleR = '10';
  public get circleRNum() {
    return +this.circleR;
  }
  public fontSize = '12';
  public get fontSizeNum() {
    return +this.fontSize;
  }

  constructor() {
    this.width = 1000;
    this.height = 1000;
    this.dy = this.width / 6;
    this.data = treeData0;
  }

  ngOnInit(): void {
    const root: any = this.tree(treeData0);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) { x1 = d.x; }
      if (d.x < x0) { x0 = d.x; }
    });

    root.x0 = this.dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d: any, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) { d.children = null; }
    });

    this.nodes = root.descendants().reverse();
    this.links = root.links();
    console.log(this.links);
  }

  tree(data) {
    const root: d3.HierarchyNode<any> = d3.hierarchy(treeData0);
    (root as any).dx = 10;
    (root as any).dy = this.width / (root.height + 10);
    return d3.tree().nodeSize([ (root as any).dx, (root as any).dy ])(root);
  }

  nodeClicked(d, e) {
    console.log(d, e);
  }

}
