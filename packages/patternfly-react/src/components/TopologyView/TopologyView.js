import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dagre from 'dagre';
import { noop } from '../../common/helpers';

/**
 * Topology View
 */
const DEFAULT_NODE_WIDTH = 60;
const DEFAULT_NODE_HEIGHT = 60;

const NODE_ICON_WIDTH = 60;
const NODE_ICON_HEIGHT = 60;

const NODE_TITLE_WIDTH = 110;

const CONNECTOR_RADIUS = 8;

class TopologyView extends React.Component {
  constructor(props) {
    super(props);

    this.graph = new dagre.graphlib.Graph({ compound: true, nodesep: 170 });
    this.graph.setGraph({
      marginx: NODE_TITLE_WIDTH,
      marginy: 20,
      nodesep: NODE_TITLE_WIDTH
    });
    this.layoutDagre(props, this.graph);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reLayoutOnChanges) {
      this.graph = new dagre.graphlib.Graph({ compound: true });
      this.graph.setGraph({
        marginx: NODE_TITLE_WIDTH,
        marginy: 20,
        nodesep: NODE_TITLE_WIDTH
      });
    }
    this.layoutDagre(nextProps, this.graph);
  }

  handleItemClick = item => {
    const { containers, nodes, edges, onSelectionChange } = this.props;

    if (item.selected) {
      item.selected = false;
      onSelectionChange();
    } else {
      containers.forEach(container => {
        container.nodes.forEach(node => {
          node.selected = false;
        });
      });
      nodes.forEach(node => {
        node.selected = false;
      });
      edges.forEach(edge => {
        edge.selected = false;
      });
      item.selected = true;
      onSelectionChange(item);
    }

    this.forceUpdate();
  };

  handleEdgeClick = item => {
    const { allowEdgeSelection } = this.props;

    if (allowEdgeSelection) {
      this.handleItemClick(item);
    }
  };

  getNodeGraphData = node => {
    const width = node.data.width || DEFAULT_NODE_WIDTH;
    const height = node.data.height || DEFAULT_NODE_HEIGHT;
    const left = -width / 2;
    const top = -height / 2;

    const inputOffsetX = left + NODE_ICON_WIDTH / 2;
    const inputOffsetY =
      top + (height - NODE_ICON_HEIGHT) / 2 - CONNECTOR_RADIUS / 2;
    const outputOffsetX = left + NODE_ICON_WIDTH / 2;
    const outputOffsetY = top + NODE_ICON_HEIGHT / 2;

    return {
      label: node.data.id,
      width,
      height,
      inputoffsetx: inputOffsetX,
      inputoffsety: inputOffsetY,
      outputoffsetx: outputOffsetX,
      outputoffsety: outputOffsetY
    };
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
      node.graphData = this.getNodeGraphData(node);
      graph.setNode(node.data.id, node.graphData);
    });

    containers.forEach(container => {
      container.nodes.forEach(node => {
        node.graphData = this.getNodeGraphData(node);
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

  getEdgePoints = edge => {
    let points = '';
    edge.graphData.points.forEach(point => {
      points += ` ${point.x},${point.y}`;
    });
    return points;
  };

  renderEdges = edges => (
    <g className="connection">
      {edges.map(edge => (
        <polyline
          key={edge.data.id}
          className={`connection-line ${edge.selected ? 'selected' : ''}`}
          points={this.getEdgePoints(edge)}
          onClick={() => this.handleEdgeClick(edge)}
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
      onClick={() => {
        this.handleItemClick(node);
      }}
    />
  );

  renderNodeSuccess = (node, top, left) => {
    const { data } = node;

    if (!data.success || !data.total) {
      return null;
    }

    const arcStart = 360 - 360 * (data.success / data.total);
    const arcEnd = 360;

    return (
      <path
        className="node-circle ok"
        d={this.describeArc(
          left + NODE_ICON_WIDTH / 2,
          0,
          NODE_ICON_WIDTH / 2,
          arcStart,
          arcEnd
        )}
        onClick={() => {
          this.handleItemClick(node);
        }}
      />
    );
  };

  renderNodeErrors = (node, top, left) => {
    const { data } = node;

    if (!data.error || !data.total) {
      return null;
    }

    const arcStart = 0;
    const arcEnd = 360 * (data.error / data.total);

    return (
      <path
        className="node-circle error"
        d={this.describeArc(
          left + NODE_ICON_WIDTH / 2,
          0,
          NODE_ICON_WIDTH / 2,
          arcStart,
          arcEnd
        )}
        onClick={() => {
          this.handleItemClick(node);
        }}
      />
    );
  };

  renderNodeUnknowns = (node, top, left) => {
    const { data } = node;

    if (!data.unknown || !data.total) {
      return null;
    }

    const arcEnd = 360 - 360 * ((data.success || 0) / data.total);
    const arcStart = arcEnd - 360 * (data.unknown / data.total);

    return (
      <path
        className="node-circle unknown"
        d={this.describeArc(
          left + NODE_ICON_WIDTH / 2,
          0,
          NODE_ICON_WIDTH / 2,
          arcStart,
          arcEnd
        )}
        onClick={() => {
          this.handleItemClick(node);
        }}
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
        onClick={() => {
          this.handleItemClick(node);
        }}
      >
        <div className="node-image-container">
          {data.image && (
            <img className="node-image" src={data.image} alt={data.id} />
          )}
          {data.iconClass && <span className={`node-icon ${data.iconClass}`} />}
          {!data.image &&
            !data.iconClass && <span className="node-title">{data.id}</span>}
        </div>
      </foreignObject>
    );
  };

  renderNodeSelection = (node, top, left) => {
    if (!node.selected) {
      return null;
    }

    return (
      <circle
        className="node-selection-circle"
        r={NODE_ICON_WIDTH / 2 + 5}
        cx={left + NODE_ICON_WIDTH / 2}
        cy={0}
      />
    );
  };

  renderNodeInputConnector = (node, top, left) => {
    const { edges } = this.props;
    const { graphData } = node;

    const hasSource =
      edges.find(edge => edge.data.target.data.id === node.data.id) !==
      undefined;

    if (hasSource) {
      let connectorSelection = null;
      if (node.selected) {
        connectorSelection = (
          <path
            key="connectorSelection"
            className="node-input-connector-selection"
            d={this.describeArc(
              left + NODE_ICON_WIDTH / 2,
              top +
                (graphData.height - NODE_ICON_HEIGHT) / 2 -
                CONNECTOR_RADIUS / 2,
              CONNECTOR_RADIUS + 2,
              270,
              90
            )}
          />
        );
      }

      const connector = (
        <circle
          key="connector"
          className="node-input-connector"
          r={CONNECTOR_RADIUS}
          cx={left + NODE_ICON_WIDTH / 2}
          cy={
            top +
            (graphData.height - NODE_ICON_HEIGHT) / 2 -
            CONNECTOR_RADIUS / 2
          }
          onClick={() => {
            this.handleItemClick(node);
          }}
        />
      );

      return [connectorSelection, connector];
    }

    return null;
  };

  renderNodeTitle = (node, top, left) => {
    const { data, graphData } = node;

    return (
      <foreignObject
        x={left + NODE_ICON_WIDTH + 5}
        y={top + (graphData.height - NODE_ICON_HEIGHT) / 2}
        width={graphData.width - (NODE_ICON_WIDTH + 5) + NODE_TITLE_WIDTH}
        height={graphData.height}
        onClick={() => {
          this.handleItemClick(node);
        }}
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
        {this.renderNodeSelection(node, top, left)}
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

  renderContainerTitle = container => {
    const { data, graphData } = container;

    return (
      <foreignObject
        x={-graphData.width / 2}
        y={-graphData.height / 2 + 5}
        width={graphData.width}
        height="40"
      >
        <span className="container-title">{data.title}</span>
      </foreignObject>
    );
  };

  renderContainers = containers => (
    <g>
      {containers.map(container => (
        <g
          key={container.data.id}
          transform={`translate(${container.graphData.x}, ${
            container.graphData.y
          })`}
        >
          <rect
            className="container-rect"
            ry="0"
            rx="0"
            x={-container.graphData.width / 2}
            y={-container.graphData.height / 2}
            width={container.graphData.width}
            height={container.graphData.height}
          />
          {this.renderContainerTitle(container)}
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
    const {
      className,
      allowEdgeSelection,
      onSelectionChange,
      containers,
      nodes,
      edges,
      reLayoutOnChanges,
      ...props
    } = this.props;

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
  /** Allow edges to be selected */
  allowEdgeSelection: PropTypes.bool,
  /** Relayout graph on data change */
  reLayoutOnChanges: PropTypes.bool,
  /** Callback function(item) when selection changes */
  onSelectionChange: PropTypes.func
};

TopologyView.defaultProps = {
  className: '',
  containers: [],
  nodes: [],
  edges: [],
  allowEdgeSelection: true,
  reLayoutOnChanges: false,
  onSelectionChange: noop
};

export default TopologyView;
