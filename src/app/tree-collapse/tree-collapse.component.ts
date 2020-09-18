import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { treeData0 } from '../data/tree-data';

@Component({
  selector: 'app-tree-collapse',
  templateUrl: './tree-collapse.component.html',
  styleUrls: [ './tree-collapse.component.scss' ]
})
export class TreeCollapseComponent implements OnInit {
  private height = 1200;
  private width = 1200;
  private simulation;
  private svg;
  private dx = 10;
  private dy = this.width / 6;
  private margin = { top: 10, right: 120, bottom: 10, left: 40 };

  constructor() { }

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

    const svg = d3.select('figure#cc')
      .append('svg')
      .attr('viewBox', `${ 0 }, -${ 0 }, ${ this.width }, ${ 1200 } `)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);
    // .attr('transform', `translate(${ root.dy / 3 },${ root.dx - x0 })`);

    // const gLink = svg.append('g')
    //   .attr('fill', 'none')
    //   .attr('stroke', '#555')
    //   .attr('stroke-opacity', 0.4)
    //   .attr('stroke-width', 1.5);
    // .attr('transform', 'translate(40, 40)');
    const diagonal = function link(d: any) {
      return 'M' + d.source.y + ',' + d.source.x
        + 'C' + (d.source.y + d.target.y) / 2 + ',' + d.source.x
        + ' ' + (d.source.y + d.target.y) / 2 + ',' + d.target.x
        + ' ' + d.target.y + ',' + d.target.x;
    };

    const gNode = svg.append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all')
      .attr('transform', `translate(${ 100 }, ${ 200 })`);

    const update = (source, diagonal) => {
      const duration = 250;
      const nodes = root.descendants().reverse();
      console.log(nodes);
      const links = root.links();
      console.log(links);

      // Compute the new tree layout.
      this.tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) { left = node; }
        if (node.x > right.x) { right = node; }
      });

      const transition = svg.transition()
        .duration(duration)
        .attr('viewBox', `${ -this.margin.left }, -${ this.margin.top }, ${ this.width }, ${ this.height } `);
      // .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

      // Update the nodes…
      const node = gNode.selectAll('g')
        .data(nodes, (d: any) => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('transform', d => `translate(${ source.y0 },${ source.x0 })`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d: any) => {
          d.children = d.children ? null : d._children;
          update(d, diagonal);
        });

      nodeEnter.append('circle')
        .attr('r', 10)
        .attr('fill', (d: any) => d._children ? '#555' : '#999')
        .attr('stroke-width', 10);

      nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d: any) => d._children ? -15 : 15)
        .attr('text-anchor', (d: any) => d._children ? 'end' : 'start')
        .text((d: any) => d.data.name)
        .clone(true).lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white');

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr('transform', (d: any) => `translate(${ d.y },${ d.x })`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
        .attr('transform', d => `translate(${ source.y },${ source.x })`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links…
      const link = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .attr('transform', `translate(${ 100 }, ${ 200 })`)
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('d', d3.linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x));

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append('path')
        .attr('d', diagonal(source));
      //  ((d: any) => {
      //   const o = { x: source.x0, y: source.y0 };
      //   return diagonal({ source: o, target: o });
      // }) as any);

      // // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
        .attr('d', diagonal);

      // // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
        .attr('d', diagonal(source));
      // ((d: any) => {
      //   const o = { x: source.x, y: source.y };
      //   return diagonal({ source: o, target: o });
      // }) as any);

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };
    update(root, diagonal);

  }


  tree(data) {
    // d3.tree().nodeSize([ this.dx, this.dy ]);
    const root: any = d3.hierarchy(treeData0);
    root.dx = 8;
    root.dy = this.width / (root.height + 10);
    return d3.tree().nodeSize([ root.dx, root.dy ])(root);
  }

  // diagonal(o: any) {
  //   d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.y);
  // }

}
