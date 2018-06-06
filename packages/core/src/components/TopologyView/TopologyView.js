import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dagre from 'dagre';

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

  layoutDagre = (props, graph) => {
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

  polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
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

  renderNodeCircle = (node, top, left) => (
    <circle
      className="node-circle"
      r={NODE_ICON_WIDTH / 2}
      cx={left + NODE_ICON_WIDTH / 2}
      cy={0}
    />
  );

  renderNodeSuccess = (node, top, left) => {
    const { data } = node;
    const total = data.total || 0;
    const percentSuccess = total > 0 ? (data.success || 0) / total : 0;

    return (
      <path
        className="node-circle ok"
        d={this.describeArc(
          left + NODE_ICON_WIDTH / 2,
          0,
          NODE_ICON_WIDTH / 2,
          360 - 360 * percentSuccess,
          360
        )}
      />
    );
  };

  renderNodeErrors = (node, top, left) => {
    const { data } = node;
    const total = data.total || 0;
    const percentError = total > 0 ? (data.error || 0) / total : 0;

    return (
      <path
        className="node-circle error"
        d={this.describeArc(
          left + NODE_ICON_WIDTH / 2,
          0,
          NODE_ICON_WIDTH / 2,
          0,
          360 * percentError
        )}
      />
    );
  };

  renderNodeUnknowns = (node, top, left) => {
    const { data } = node;

    if (!data.unknown) {
      return null;
    }

    const total = data.total || 0;
    const percentSuccess = total > 0 ? (data.success || 0) / total : 0;
    const percentUnknown = total > 0 ? data.unknown / total : 0;

    return (
      <path
        className="node-circle unknown"
        d={this.describeArc(
          left + NODE_ICON_WIDTH / 2,
          0,
          NODE_ICON_WIDTH / 2,
          360 - 360 * percentUnknown,
          360 - 360 * percentSuccess
        )}
      />
    );
  };

  renderNodeImage = (node, top, left) => {
    const { data, graphData } = node;

    return (
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
    );
  };

  renderNodeInputConnector = (node, top, left) => {
    const { edges } = this.props;
    const { graphData } = node;

    const hasSource =
      edges.find(edge => edge.data.target.data.id === node.data.id) !==
      undefined;

    if (hasSource) {
      return (
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
      );
    }

    return null;
  };

  renderNodeTitle = (node, top, left) => {
    const { data, graphData } = node;

    return (
      <foreignObject
        x={left + NODE_ICON_WIDTH + 5}
        y={top + (graphData.height - NODE_ICON_HEIGHT) / 2}
        width={graphData.width - (NODE_ICON_WIDTH + 5)}
        height={graphData.height}
      >
        <span className="node-title">{data.title}</span>
      </foreignObject>
    );
  };

  renderNode = node => {
    const { data, graphData } = node;

    const top = -graphData.height / 2;
    const left = -graphData.width / 2;

    return (
      <g key={data.id} transform={`translate(${graphData.x}, ${graphData.y})`}>
        {this.renderNodeCircle(node, top, left)}
        {this.renderNodeSuccess(node, top, left)}
        {this.renderNodeErrors(node, top, left)}
        {this.renderNodeUnknowns(node, top, left)}
        {this.renderNodeImage(node, top, left)}
        {this.renderNodeInputConnector(node, top, left)}
        {this.renderNodeTitle(node, top, left)}
      </g>
    );
  };

  renderNodes = (nodes, container) => (
    <g key={container ? `${container.data.id}_nodes` : 'nodes'}>
      {nodes.map(node => this.renderNode(node))}
    </g>
  );

  renderContainers = containers => (
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

  renderSvg = () => {
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

  render() {
    const { className, ...props } = this.props;

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
  edges: PropTypes.array
};

TopologyView.defaultProps = {
  className: '',
  containers: [],
  nodes: [],
  edges: []
};

export default TopologyView;
