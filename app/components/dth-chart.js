import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceLink,
  forceCenter,
} from 'd3-force';
import { selectAll } from 'd3-selection';
import drag from '../dthree/zdrag';

export default class D3ChartComponent extends Component {
  @tracked graph = {
    nodes: [
      {
        id: '123KGZ',
        firstName: 'Jenesio Omodo',
        lastName: 'Anyuru',
        dob: '11 November 1927',
        gender: 'Male',
      },
      {
        id: '126KGZ',
        firstName: 'Anna Maria',
        lastName: 'Kababito',
        dob: '11 Feb 1957',
        gender: 'Female',
      },
      {
        id: '123XFQ',
        firstName: 'Francis',
        lastName: 'Anyuru',
        dob: '28 June 1980',
        gender: 'Male',
      },
      {
        id: '123XFZ',
        firstName: 'Kenneth',
        lastName: 'Rogers',
        dob: '28 June 1983',
        gender: 'Male',
      },
      {
        id: '123XFY',
        firstName: 'Cynthia',
        lastName: 'Anyuru',
        dob: '28 June 1989',
        gender: 'Female',
      },
      {
        id: '123XVZ',
        firstName: 'Kelly Price',
        lastName: 'Anyuru',
        dob: '28 June 1991',
        gender: 'Male',
      },
    ],
    links: [
      { source: '123KGZ', target: '123XFQ' },
      { source: '123KGZ', target: '123XFZ' },
      { source: '123KGZ', target: '123XFY' },
      { source: '123KGZ', target: '123XVZ' },
      { source: '126KGZ', target: '123XFQ' },
      { source: '126KGZ', target: '123XFZ' },
      { source: '126KGZ', target: '123XFY' },
      { source: '126KGZ', target: '123XVZ' },
    ],
  };

  @action
  chart() {
    // the default phyllotaxis arrangement is centered on <0,0> with a distance between nodes of ~10 pixels
    // we will scale & translate it to fit the canvas

    function getNodeColor(node) {
      return node.gender === 'Male' ? 'red' : '#4682b4';
    }

    const svg = selectAll('svg');

    const simulation = forceSimulation()
      .force(
        'link',
        forceLink()
          .id((d) => d.id)
          .distance(200)
      )
      .force('charge', forceManyBody(-1000))
      .force(
        'collide',
        forceCollide().radius((d) => d.r + 0.5)
      )
      .force('center', forceCenter(200, 150));

    const linkElement = svg
      .append('g')
      .selectAll('line')
      .data(this.graph.links)
      .join('line')
      .attr('stroke', 'red')
      .attr('stroke-width', '1.5');

    const nodeElement = svg
      .append('g')
      .selectAll('circle')
      .data(this.graph.nodes)
      .join('circle')
      .attr('fill', getNodeColor)
      .attr('stroke', '#468204')
      .attr('r', 25)
      .call(drag(simulation));

    const textElement = svg
      .append('g')
      .selectAll('text')
      .data(this.graph.nodes)
      .join('text')
      .text((d) => d.firstName)
      .attr('font-size', 15);

    simulation.nodes(this.graph.nodes).on('tick', ticked);
    simulation.force('link').links(this.graph.links);

    function ticked() {
      linkElement
        .attr('x1', (link) => link.source.x)
        .attr('y1', (link) => link.source.y)
        .attr('x2', (link) => link.target.x)
        .attr('y2', (link) => link.target.y);

      nodeElement.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      textElement.attr('x', (node) => node.x).attr('y', (node) => node.y);
    }

    return svg.node();
  }
}
