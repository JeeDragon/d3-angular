import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { tree } from 'd3';


@Component({
  selector: 'app-d3-failures-tree',
  templateUrl: './d3-failures-tree.component.html',
  styleUrls: [ './d3-failures-tree.component.scss' ]
})
export class D3FailuresTreeComponent implements OnInit {

  private data = {
    name: 'first',
    children: [
      { name: 'second a', },
      { name: 'second b', children: [] }
    ]
  };
  private svg;
  private root;
  private gNode: any;
  private gLink: any;
  private dx = 10;
  private dy = 159;
  private margin = { top: 60, right: 120, bottom: 10, left: 40 };
  private tree = d3.tree().nodeSize([ this.dx, this.dy ]);
  private diagonal = d3.linkHorizontal().x(d => d[ 0 ]).y(d => d[ 1 ]);

  constructor() { }

  ngOnInit(): void {
    this.createGraph();
  }

  private createSvg() {
    // this.svg = d3.select('figure#failures')
    //   .append('svg')
    //   .attr('width', '600px')
    //   .attr('height', '600px')
    //   .style('font', '10px sans-serif')
    //   .style('user-select', 'none')
    //   .append('g');

    // this.gLink = this.svg.append('g')
    //   .attr('fill', 'none')
    //   .attr('stroke', '#555')
    //   .attr('stroke-opacity', 0.4)
    //   .attr('stroke-width', 1.5);

    // this.gNode = this.svg.append('g')
    //   .attr('cursor', 'pointer')
    //   .attr('pointer-events', 'all');

    this.svg = d3.select('figure#failures')
      .append('svg')
      // .attr('width', 600)
      // .attr('height', 600)
      // .attr('transform', 'translate(' + this.margin.top + ',' + this.margin + ')')
      .attr('viewBox', `0 0 600 600`)
      // .style('transform', `translate(10px, 50px)`)
      .style('font', '22px sans-serif')
      .style('user-select', 'none');

    this.gLink = this.svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    this.gNode = this.svg.append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all')
      .style('transform', `translate(10px, 50px)`);

  }

  private createGraph() {
    this.root = d3.hierarchy(this.data);
    this.root.x = this.dy; // / 2;
    this.root.y = 0;
    this.root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) {
        d.children = null;
      }
    });
    this.createSvg();

    this.update(this.root);
    return this.svg.node();
  }

  private update(source) {
    console.log(source);
    const duration = 2500;
    const nodes = this.root.descendants().reverse();
    const links = this.root.links();

    // Compute the new tree layout.
    // tree();

    let left = this.root;
    let right = this.root;
    this.root.eachBefore(node => {
      if (node.x < left.x) { left = node; }
      if (node.x > right.x) { right = node; }
    });

    const height = right.x - left.x + this.margin.top + this.margin.bottom;

    console.log(`LEFT: ${ left }`, left);
    console.log(`RIGHT: ${ right }`, right);

    const transition = this.svg.transition()
      .duration(duration)
      .attr('viewBox', [ -this.margin.left, 0, 600, 600 ]);
    // .tween('resize', window.ResizeObserver ? null : () => () => this.svg.dispatch('toggle'));

    // Update the nodes…
    const node = this.gNode.selectAll('g')
      .data(nodes, d => {
        d.x = d.id;
        d.y = d.id * 20;
        return d.id;
      });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('transform', d => {
        console.log(d);
        return `translate(${ (source.y * d.id) + 100 },${ (source.x * d.id) + 100 })`;
      })
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0)
      .on('click', (event, d) => {
        d.children = d.children ? null : d._children;
        this.update(d);
      });

    nodeEnter.append('circle')
      .attr('r', 2.5)
      .attr('fill', d => d._children ? '#555' : '#999')
      .attr('stroke-width', 30);

    nodeEnter.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d._children ? -26 : 26)
      .attr('text-anchor', d => d._children ? 'end' : 'start')
      .text(d => d.data.name)
      .clone(true).lower()
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .attr('stroke', 'white');

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
      .attr('transform', d => {
        console.log(d);
        return `translate(${ d.y * d.id },${ d.x })`;
      })
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
      .attr('transform', d => `translate(${ source.y },${ source.x })`)
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0);

    // Update the links…
    const link = this.gLink.selectAll('path')
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append('path')
      .attr('d', d => {
        const o = { x: source.x, y: source.y };
        return this.diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
      .attr('d', this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
      .attr('d', d => {
        const o = { 0: source.x, 1: source.y };
        // this.diagonal({ source: o, target: { "0"}})
        return this.diagonal({ source: o, target: o }, [ o ]);
      });

    // Stash the old positions for transition.
    this.root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

}
