import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dagre from 'dagre';

import { ReactCytoscape } from 'react-cytoscape';
import { patternfly } from '../../common/patternfly';

/**
 * Topology View
 */
const DEFAULT_NODE_WIDTH = 180;
const DEFAULT_NODE_HEIGHT = 100;

const NODE_ICON_WIDTH = 60;
const NODE_ICON_HEIGHT = 60;

const CONNECTOR_RADIUS = 8;

class TopologyView extends React.Component {
  constructor(props) {
    super(props);

    this.graph = new dagre.graphlib.Graph({ compound: true });
    this.graph.setGraph({
      marginx: 20,
      marginy: 20
    });
    this.layoutDagre(props, this.graph);
  }

  componentWillReceiveProps(nextProps) {
    this.layoutDagre(nextProps);
  }

  getElements = () => {
    const { containers, nodes, edges } = this.props;

    return {
      nodes: [...containers, ...nodes],
      edges
    };
  };

  /** Support Bezier connectors at some point?
  getBezierPath = edge => {
    const source = edge.data.source.graphData;
    const middle = edge.graphData.points[1];
    const target = edge.data.target.graphData;

    const startPoint = { x: source.x + (NODE_ICON_WIDTH / 2) - source.width / 2, y: source.y };
    const midPoint = { x: middle.x - startPoint.x, y: middle.y - startPoint.y };
    const endPoint = {
      x: target.x + (NODE_ICON_WIDTH / 2) - target.width / 2 - startPoint.x,
      y: target.y + 10 - target.height / 2 - startPoint.y
    };

    return `M ${startPoint.x} ${startPoint.y} q ${midPoint.x} ${midPoint.y} ${
      endPoint.x
    } ${endPoint.y}`;
  };
  */

  getEdgePoints = edge => {
    const source = edge.data.source.graphData;
    const target = edge.data.target.graphData;
    const top = -target.height / 2;
    const left = -target.width / 2;
    const iconOffset = NODE_ICON_WIDTH / 2;

    const startPoint = `${left + source.x + iconOffset},${source.y}`;
    const endPoint = `${left + target.x + iconOffset}, ${top + target.y + 10}`;

    return `${startPoint} ${endPoint}`;
  };

  layoutDagre = function(props, graph) {
    const { containers, nodes, edges } = props;

    containers.forEach(container => {
      container.graphData = {
        label: container.data.id,
        clusterLabelPos: container.clusterLabelPos,
        style: container.style
      };
      graph.setNode(container.data.id, container.graphData);
    });

    nodes.forEach(node => {
      node.graphData = {
        label: node.data.id,
        width: node.data.width || DEFAULT_NODE_WIDTH,
        height: node.data.height || DEFAULT_NODE_HEIGHT
      };
      graph.setNode(node.data.id, node.graphData);
    });

    containers.forEach(container => {
      container.nodes.forEach(node => {
        node.graphData = {
          label: node.data.id,
          width: node.data.width || DEFAULT_NODE_WIDTH,
          height: node.data.height || DEFAULT_NODE_HEIGHT
        };
        console.log(`Adding child node: ${node.data.id}`);
        graph.setNode(node.data.id, node.graphData);
        graph.setParent(node.data.id, container.data.id);
      });
    });

    edges.forEach(edge => {
      edge.graphData = {
        label: ''
      };
      graph.setEdge(
        edge.data.source.data.id,
        edge.data.target.data.id,
        edge.graphData
      );
    });

    dagre.layout(graph);
  };

  polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  describeArc = function(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(' ');

    return d;
  };

  renderEdges = edges => (
    <g className="connection">
      {edges.map(edge => (
        <polyline
          key={edge.data.id}
          className="connection-line"
          points={this.getEdgePoints(edge)}
        />
      ))}
    </g>
  );

  /** Support Bezier paths at some point?
          <path
          className="connection-line"
          d={this.getBezierPath(edge)}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />

   */
  renderNode = node => {
    const { edges } = this.props;
    const total = node.data.total || 0;
    const percentError = total > 0 ? (node.data.error || 0) / total : 0;

    const hasSource =
      edges.find(edge => edge.data.target.data.id === node.data.id) !==
      undefined;

    const { data, graphData } = node;
    const top = -graphData.height / 2;
    const left = -graphData.width / 2;

    return (
      <g key={data.id} transform={`translate(${graphData.x}, ${graphData.y})`}>
        <circle
          className="node-circle"
          r={NODE_ICON_WIDTH / 2}
          cx={left + NODE_ICON_WIDTH / 2}
          cy={0}
        />
        <foreignObject
          x={left}
          y={top + (graphData.height - NODE_ICON_HEIGHT) / 2}
          width={NODE_ICON_WIDTH}
          height={NODE_ICON_HEIGHT}
        >
          <div className="node-image-container">
            {data.image && (
              <img className="node-image" src={data.image} alt={data.id} />
            )}
            {!data.image && <span className="node-title">{data.id}</span>}
          </div>
        </foreignObject>
        <g x={-graphData.width / 2}>
          <path
            className="error-items-circle"
            d={this.describeArc(
              left + NODE_ICON_WIDTH / 2,
              0,
              NODE_ICON_WIDTH / 2,
              0,
              360 * percentError
            )}
          />
        </g>
        {hasSource && (
          <circle
            className="node-input-connector"
            r={CONNECTOR_RADIUS}
            cx={left + NODE_ICON_WIDTH / 2}
            cy={
              top +
              (graphData.height - NODE_ICON_HEIGHT) / 2 -
              CONNECTOR_RADIUS / 2
            }
          />
        )}
        <foreignObject
          x={left + NODE_ICON_WIDTH + 5}
          y={top + (graphData.height - NODE_ICON_HEIGHT) / 2}
          width={graphData.width - (NODE_ICON_WIDTH + 5)}
          height={graphData.height}
        >
          <span className="node-title">{data.title}</span>
        </foreignObject>
      </g>
    );
  };

  renderNodes = (nodes, container) => (
    <g key={container ? `${container.data.id}_nodes` : 'nodes'}>
      {nodes.map(node => this.renderNode(node))}
    </g>
  );

  renderContainers = containers => {
    const containerComponents = (
      <g>
        {containers.map(node => (
          <g
            key={node.data.id}
            transform={`translate(${node.graphData.x}, ${node.graphData.y})`}
          >
            <rect
              className="container-rect"
              ry="0"
              rx="0"
              x={-node.graphData.width / 2}
              y={-node.graphData.height / 2}
              width={node.graphData.width}
              height={node.graphData.height}
            />
          </g>
        ))}
      </g>
    );

    return containerComponents;
  };

  renderSvg = function() {
    const { containers, nodes, edges } = this.props;

    return (
      <svg
        className="read-only"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: this.graph.graph().width,
          height: this.graph.graph().height
        }}
      >
        {this.renderContainers(containers)}
        {this.renderEdges(edges)}
        {containers.map(container =>
          this.renderNodes(container.nodes, container)
        )}
        {this.renderNodes(nodes)}
      </svg>
    );
  };

  renderCytoscpe = function() {
    const { className, nodeStyle, edgeStyle } = this.props;
    const topologyClasses = classNames('topology-container', className);

    const defaultStyles = [
      {
        selector: 'node',
        style: nodeStyle
      },
      {
        selector: 'edge',
        style: edgeStyle
      }
    ];

    const cyRef = cy => {
      this.cy = cy;
    };

    return (
      <ReactCytoscape
        className={topologyClasses}
        containerID="cy"
        elements={this.getElements()}
        style={defaultStyles}
        cyRef={cy => {
          cyRef(cy);
        }}
        cytoscapeOptions={{ wheelSensitivity: 0.1 }}
        layout={{ name: 'dagre' }}
      />
    );
  };

  /*
          {this.graph.edges().map(connection => (
            <g className="connection">
              <g>
                <path className="connection-line {{connection.classes()}}"
                      d="M {{connection.sourceCoordX()}}, {{connection.sourceCoordY()}}
                                   L {{connection.middleCoordX()}}, {{connection.sourceCoordY()}}
                                   L {{connection.middleCoordX()}}, {{connection.destCoordY()}}
                                   L {{connection.destCoordX()}}, {{connection.destCoordY()}}">
                </path>
                <polygon className={`connection-endpoint ${connection.classes()}`}
                         points="{connection.destEndPoints(connectorSize)}">
                </polygon>
              </g>
            </g>
          ))}
  */

  render() {
    const { className, nodeStyle, edgeStyle, ...props } = this.props;

    const topologyClasses = classNames('topology-container', className);

    return (
      <div className={topologyClasses} {...props}>
        {this.renderSvg()}
      </div>
    );
  }
}

TopologyView.propTypes = {
  /** Additional element css classes */
  className: PropTypes.string,
  /** Containers */
  containers: PropTypes.array,
  /** Nodes */
  nodes: PropTypes.array,
  /** Edges */
  edges: PropTypes.array,
  /** Node Styles, default style for all nodes */
  nodeStyle: PropTypes.object,
  /** Edge Styles, default style for all edges */
  edgeStyle: PropTypes.object
};

TopologyView.defaultProps = {
  className: '',
  containers: [],
  nodes: [],
  edges: [],
  nodeStyle: {
    width: 120,
    height: 60
  },
  edgeStyle: {
    width: 2,
    'curve-style': 'bezier',
    'line-color': patternfly.pfPaletteColors.black900,
    'source-arrow-shape': 'none',
    'source-endpoint': 'outside-to-node',
    'target-arrow-shape': 'circle',
    'target-arrow-fill': 'hollow',
    'target-arrow-color': patternfly.pfPaletteColors.black500,
    'target-endpoint': ['-0px', '-25px'],
    'arrow-scale': 2,
    'z-index': 2000
  }
};

export default TopologyView;
