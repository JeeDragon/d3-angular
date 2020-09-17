import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { json, thresholdFreedmanDiaconis } from 'd3';

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
  private height = 1200;
  private width = 1200;
  private simulation;
  private svg;
  constructor() { }

  ngOnInit(): void {
    console.log(this.createGraph());
  }

  private createGraph() {
    const root = d3.hierarchy(this.data);
    const links = root.links();
    const nodes = root.descendants();




    this.svg = d3.select('figure#graph1')
      .append('svg')
      .attr('viewBox', `0, 0, ${ this.width }, ${ this.height }`)
      .style('font', '22px sans-serif')
      .style('user-select', 'none');

    const link = this.svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .classed('link', true);


    this.simulation = d3
      .forceSimulation(nodes as any)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(links as any))
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

    const node = this.svg.append('g')
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
      .call(this.drag(this.simulation));
    // .style('transform', `translate(10px, 50px)`)
    // .call(drag as any);

    // .append('text')
    //   .attr('dy', '.35em')
    //   .attr('text-anchor', 'start')
    //   .style('fill', 'steelblue')
    //   .text('Sev3');

    const node2 = this.svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node');
    // .call(drag);

    // node.append('text')
    //   .attr('dy', '0.31em')
    //   // .attr('x', d => d.children ? -6 : 6)
    //   .attr('text-anchor', 'start')
    //   .style('fill', 'steelblue')
    //   .text((d: any) => {
    //     console.log(d);
    //     return d.data.name;
    //   });

    const nodeLabels = node2.append('svg:text')
      .classed('node-label', true)
      .attr('dy', 24)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name);

    node2.attr('transform', (d: any) => `translate(${ d.x }, ${ d.y })`);

    // node.append('title')
    //   .text(d => d.data.name);


    // const drag = d3
    //   .drag()
    //   .on('start', this.dragstarted)
    //   .on('drag', this.dragged)
    //   .on('end', this.dragended);
    node
      .call(this.drag(this.simulation))
      .on('click', this.click);

    // d3.invalidation.then(() => this.simulation.stop());

    return this.svg.node();
  }

  click(event, d) {
    console.log(event);
    console.log(d);
    delete d.fx;
    delete d.fy;
    d3.select(this as any).classed('fixed', false);
    this.simulation.alpha(1).restart();
  }

  dragstarted = (event, d) => {
    if (!event.active) { this.simulation.alphaTarget(0.3).restart(); }
    // d3.select(this as any).classed('fixed', true);
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged = (event, d) => {
    d.fx = this.clamp(event.x, 0, this.width);
    d.fy = this.clamp(event.y, 0, this.height);
    d3.select(this as any).classed('fixed', true);
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

  drag = (simulation) => {

    function dragstarted(event) {
      if (!event.active) { simulation.alphaTarget(0.3).restart(); }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
      d3.select(this as any).classed('fixed', true);
    }

    function dragended(event) {
      if (!event.active) { simulation.alphaTarget(0); }
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

}
