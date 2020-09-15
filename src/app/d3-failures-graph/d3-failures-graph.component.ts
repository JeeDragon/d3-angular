import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-failures-graph',
  templateUrl: './d3-failures-graph.component.html',
  styleUrls: [ './d3-failures-graph.component.scss' ]
})
export class D3FailuresGraphComponent implements OnInit {

  private data = {
    name: 'a',
    children: [
      { name: 'aa', children: [] },
      {
        name: 'ab', children: [
          { name: 'aba', children: [] },
          { name: 'aba', children: [] },
          { name: 'aba', children: [] },
          { name: 'aba', children: [] },
          { name: 'aba', children: [] }
        ]
      }
    ]
  };
  private height = 600;
  private width = 1200;
  private simulation;
  constructor() { }

  ngOnInit(): void {
    console.log(this.createGraph());
  }

  private createGraph() {
    const root = d3.hierarchy(this.data);
    const links = root.links();
    const nodes = root.descendants();

    this.simulation = d3
      .forceSimulation(nodes as any)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(links as any))
      // .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });

    const drag = d3
      .drag()
      .on('start', this.dragstarted)
      .on('drag', this.dragged)
      .on('end', this.dragended);

    const svg = d3.select('figure#graph1')
      .append('svg')
      .attr('viewBox', `${ -this.width / 2 }, ${ -this.height / 2 }, ${ this.width }, ${ this.height }`)
      .style('font', '22px sans-serif')
      .style('user-select', 'none');

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .classed('link', true);

    const node = svg.append('g')
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('fill', d => d.children ? null : '#000')
      .attr('stroke', d => d.children ? null : '#fff')
      .attr('r', 10)
      .classed('node', true)
      .classed('fixed', (d: any) => d.fx !== undefined)
      // .style('transform', `translate(10px, 50px)`)
      .call(drag as any);

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -6 : 6)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name)
      .clone(true).lower()
      .attr('stroke', 'white');

    node.append('title')
      .text(d => d.data.name);



    node.call(drag as any)
      .on('click', this.click);

    // d3.invalidation.then(() => simulation.stop());

    return svg.node();
  }

  click = (event, d) => {
    delete d.fx;
    delete d.fy;
    d3.select(this as any).classed('fixed', false);
    this.simulation.alpha(1).restart();
  }

  dragstarted = (event, d) => {
    if (!event.active) { this.simulation.alphaTarget(0.3).restart(); }
    d3.select(this as any).classed('fixed', true);
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged = (event, d) => {
    d.fx = this.clamp(event.x, 0, this.width);
    d.fy = this.clamp(event.y, 0, this.height);
    this.simulation.alpha(1).restart();
  }

  dragended = (event, d) => {
    if (!event.active) { this.simulation.alphaTarget(0); }
    d.fx = null;
    d.fy = null;
  }

  clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }

}
