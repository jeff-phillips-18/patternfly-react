import React from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../../common/helpers';

import {
  Button,
  ControlLabel,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  Grid,
  MenuItem
} from '../../../index';

import Apple from 'storybook/img/Apple.svg';
import Cordova from 'storybook/img/Cordova.svg';
import External from 'storybook/img/External.svg';
import Icon from 'storybook/img/Icon.svg';
import Mongo from 'storybook/img/Mongo DB.svg';
import MySQL from 'storybook/img/MySQL.svg';
import NodeJS from 'storybook/img/NodeJS.svg';
import Route from 'storybook/img/Route.svg';
import ThreeScale from 'storybook/img/3Scale.svg';

import TopologyView from '../TopologyView';

const imageNameToImage = name => {
  switch (name) {
    case 'Apple':
      return Apple;
    case 'Cordova':
      return Cordova;
    case 'External':
      return External;
    case 'Icon':
      return Icon;
    case 'Mongo':
      return Mongo;
    case 'MySQL':
      return MySQL;
    case 'NodeJS':
      return NodeJS;
    case 'Route':
      return Route;
    case '3Scale':
      return ThreeScale;
    default:
      return Apple;
  }
};

class MockTopologyView extends React.Component {
  constructor(props) {
    super(props);

    this.createInitialData();

    this.state = {
      selection: null,
      newNodeTitle: '',
      newNodeImage: 'Apple',
      newEdgeSource: this.nodes[0],
      newEdgeTarget: this.nodes[1]
    };
  }

  createInitialData = () => {
    const route = { data: { id: 'route', title: '', image: Route } };
    const mobile = {
      data: { id: 'mobile', title: 'Mobile App', image: Cordova }
    };
    const route2 = {
      data: { id: 'route2', title: '', image: Route, total: 10, success: 2 }
    };
    const api = {
      data: {
        id: 'api',
        title: 'API Gateway',
        image: ThreeScale,
        total: 5,
        error: 0
      }
    };
    const storeWebUi = {
      data: {
        id: 'storeWebUi',
        title: 'Store Web UI',
        image: NodeJS,
        total: 1,
        error: 0
      }
    };
    const cinemaWebUi = {
      data: {
        id: 'cinemaWebUi',
        title: 'Cinema Web UI',
        image: NodeJS,
        total: 3,
        error: 1
      }
    };
    const testWebUi = {
      data: {
        id: 'testWebUi',
        title: 'Test Web UI',
        image: NodeJS,
        total: 2,
        error: 0
      }
    };
    const booking = {
      data: {
        id: 'booking',
        title: 'Booking',
        image: NodeJS,
        total: 2,
        error: 0
      }
    };
    const storeInventory = {
      data: {
        id: 'storeInventory',
        title: 'Store Inventory',
        image: Mongo,
        total: 2,
        error: 0
      }
    };
    const cinemaCatalog = {
      data: {
        id: 'cinemaCatalog',
        title: 'Cinema Catalog',
        image: MySQL,
        total: 1,
        error: 0
      }
    };
    const payments = {
      data: { id: 'payments', title: 'Payments', image: External }
    };
    const notifications = {
      data: { id: 'notifications', title: 'Notifications', image: External }
    };
    const movies = {
      data: {
        id: 'movies',
        title: 'Movies',
        iconClass: 'fa fa-video-camera',
        total: 10,
        error: 2,
        success: 4,
        unknown: 1
      }
    };

    this.containers = [
      {
        data: {
          id: 'myApps',
          title: 'My Apps',
          labelPos: 'top'
        },
        nodes: [route, mobile]
      },
      {
        data: {
          id: 'otherApps',
          title: 'Other Apps',
          labelPos: 'top'
        },
        nodes: [route2]
      }
    ];

    this.nodes = [
      api,
      storeWebUi,
      cinemaWebUi,
      testWebUi,
      booking,
      storeInventory,
      cinemaCatalog,
      payments,
      notifications,
      movies
    ];

    this.edges = [
      this.getEdge(route, api),
      this.getEdge(mobile, api),
      this.getEdge(mobile, storeWebUi),
      this.getEdge(route2, cinemaWebUi),
      this.getEdge(route2, testWebUi),
      this.getEdge(api, booking),
      this.getEdge(api, storeInventory),
      this.getEdge(api, cinemaCatalog),
      this.getEdge(storeWebUi, storeInventory),
      this.getEdge(cinemaWebUi, cinemaCatalog),
      this.getEdge(testWebUi, cinemaCatalog),
      this.getEdge(booking, payments),
      this.getEdge(booking, notifications),
      this.getEdge(storeInventory, payments),
      this.getEdge(storeInventory, notifications),
      this.getEdge(cinemaCatalog, movies)
    ];
  };

  getEdgeId = (source, target) => `${source.data.id}-${target.data.id}`;

  getEdge = (source, target) => ({
    data: {
      id: this.getEdgeId(source, target),
      source,
      target
    }
  });

  updateNewNodeTitle = event => {
    this.setState({
      newNodeTitle: event.target.value
    });
  };

  setNewNodeImage = imageString => {
    this.setState({ newNodeImage: imageString });
  };

  onSubmitNewNode = e => {
    e.preventDefault();

    const newNode = {
      data: {
        id: this.state.newNodeTitle,
        title: this.state.newNodeTitle,
        image: imageNameToImage(this.state.newNodeImage)
      }
    };

    this.nodes.push(newNode);
    this.setState({ newNodeTitle: '' });
  };

  setNewEdgeSource = node => {
    this.setState({ newEdgeSource: node });
  };

  setNewEdgeTarget = node => {
    console.dir(node);
    this.setState({ newEdgeTarget: node });
  };

  onSubmitNewEdge = e => {
    const { newEdgeSource, newEdgeTarget } = this.state;

    e.preventDefault();

    const newId = this.getEdgeId(newEdgeSource, newEdgeTarget);

    if (!this.edges.find(edge => edge.data.id === newId)) {
      this.edges.push(this.getEdge(newEdgeSource, newEdgeTarget));
      this.forceUpdate();
    }
  };

  removeEdgeById = (edges, id) => {
    const edgeIndex = edges.findIndex(edge => edge.data.id === id);
    if (edgeIndex >= 0) {
      edges.splice(edgeIndex, 1);
    }
  };

  removeNodeById = (nodes, id) => {
    const nodeIndex = nodes.findIndex(node => node.data.id === id);
    if (nodeIndex >= 0) {
      nodes.splice(nodeIndex, 1);
      const edges = this.edges.filter(
        edge =>
          edge.data.id.startsWith(`${id}-`) || edge.data.id.endsWith(`-${id}`)
      );

      if (edges) {
        edges.forEach(edge => {
          this.removeEdgeById(this.edges, edge.data.id);
        });
      }
    }
  };

  removeSelected = () => {
    const { selection } = this.state;

    if (selection) {
      this.removeNodeById(this.nodes, selection.data.id);
      this.containers.forEach(container =>
        this.removeNodeById(container.nodes, selection.data.id)
      );
      this.removeEdgeById(this.edges, selection.data.id);
      this.setState({ selection: null });
    }
  };

  handleSelection = selection => {
    this.setState({ selection });
    this.props.onSelectionChange(selection);
  };

  render() {
    const { reLayoutOnChanges } = this.props;
    const allNodes = [...this.nodes];
    this.containers.forEach(container => {
      allNodes.push(...container.nodes);
    });
    return (
      <div>
        <TopologyView
          containers={this.containers}
          nodes={this.nodes}
          edges={this.edges}
          allowEdgeSelection
          onSelectionChange={this.handleSelection}
          reLayoutOnChanges={reLayoutOnChanges}
        />
        <Grid style={{ marginTop: '15px' }}>
          <Grid.Row>
            <Grid.Col sm={6}>
              <Form
                horizontal
                onSubmit={e => {
                  this.onSubmitNewNode(e);
                }}
              >
                <FormGroup controlId="name">
                  <Grid.Col componentClass={ControlLabel} sm={2}>
                    Title
                  </Grid.Col>
                  <Grid.Col sm={9}>
                    <FormControl
                      type="name"
                      value={this.state.newNodeTitle}
                      placeholder="Enter new node title"
                      onChange={e => this.updateNewNodeTitle(e)}
                      required
                    />
                  </Grid.Col>
                </FormGroup>
                <FormGroup controlId="image">
                  <Grid.Col componentClass={ControlLabel} sm={2}>
                    Image
                  </Grid.Col>
                  <Grid.Col sm={9}>
                    <DropdownButton
                      id="image-select"
                      bsStyle="default"
                      title={this.state.newNodeImage}
                    >
                      <MenuItem
                        eventKey="1"
                        onClick={() => {
                          this.setNewNodeImage('Apple');
                        }}
                      >
                        Apple
                      </MenuItem>
                      <MenuItem
                        eventKey="2"
                        onClick={() => {
                          this.setNewNodeImage('Cordova');
                        }}
                      >
                        Cordova
                      </MenuItem>
                      <MenuItem
                        eventKey="3"
                        onClick={() => {
                          this.setNewNodeImage('External');
                        }}
                      >
                        External
                      </MenuItem>
                      <MenuItem
                        eventKey="4"
                        onClick={() => {
                          this.setNewNodeImage('Icon');
                        }}
                      >
                        Icon
                      </MenuItem>
                      <MenuItem
                        eventKey="5"
                        onClick={() => {
                          this.setNewNodeImage('Mongo');
                        }}
                      >
                        Mongo
                      </MenuItem>
                      <MenuItem
                        eventKey="6"
                        onClick={() => {
                          this.setNewNodeImage('MySQL');
                        }}
                      >
                        MySQL
                      </MenuItem>
                      <MenuItem
                        eventKey="7"
                        onClick={() => {
                          this.setNewNodeImage('NodeJS');
                        }}
                      >
                        NodeJS
                      </MenuItem>
                      <MenuItem
                        eventKey="8"
                        onClick={() => {
                          this.setNewNodeImage('Route');
                        }}
                      >
                        Route
                      </MenuItem>
                      <MenuItem
                        eventKey="9"
                        onClick={() => {
                          this.setNewNodeImage('3Scale');
                        }}
                      >
                        3Scale
                      </MenuItem>
                    </DropdownButton>
                  </Grid.Col>
                </FormGroup>
                <Grid.Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  <Grid.Col smOffset={2} sm={9}>
                    <Button
                      className="pull-right"
                      bsStyle="primary"
                      type="submit"
                    >
                      Add Node
                    </Button>
                  </Grid.Col>
                </Grid.Row>
              </Form>
            </Grid.Col>
            <Grid.Col sm={6} />
            <Grid.Col sm={3}>
              <Form
                horizontal
                onSubmit={e => {
                  this.onSubmitNewEdge(e);
                }}
              >
                <FormGroup controlId="sourceNode">
                  <Grid.Col componentClass={ControlLabel} sm={3}>
                    Source
                  </Grid.Col>
                  <Grid.Col sm={9}>
                    <DropdownButton
                      id="source-select"
                      bsStyle="default"
                      title={
                        this.state.newEdgeSource &&
                        (this.state.newEdgeSource.data.title ||
                          this.state.newEdgeTarget.data.id)
                      }
                      placeholder="Select source node"
                    >
                      {allNodes.map(node => (
                        <MenuItem
                          key={node.data.id}
                          eventKey={`source-${node.data.id}`}
                          onClick={() => {
                            this.setNewEdgeSource(node);
                          }}
                        >
                          {node.data.title || node.data.id}
                        </MenuItem>
                      ))}
                    </DropdownButton>
                  </Grid.Col>
                </FormGroup>
                <FormGroup controlId="targetNode">
                  <Grid.Col componentClass={ControlLabel} sm={3}>
                    Target
                  </Grid.Col>
                  <Grid.Col sm={9}>
                    <DropdownButton
                      id="target-select"
                      bsStyle="default"
                      title={
                        this.state.newEdgeTarget &&
                        (this.state.newEdgeTarget.data.title ||
                          this.state.newEdgeTarget.data.id)
                      }
                      placeholder="Select source node"
                    >
                      {allNodes.map(node => (
                        <MenuItem
                          key={node.data.id}
                          eventKey={`target-${node.data.id}`}
                          onClick={() => {
                            this.setNewEdgeTarget(node);
                          }}
                        >
                          {node.data.title || node.data.id}
                        </MenuItem>
                      ))}
                    </DropdownButton>
                  </Grid.Col>
                </FormGroup>
                <Grid.Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  <Grid.Col smOffset={3} sm={9}>
                    <Button
                      className="pull-right"
                      bsStyle="primary"
                      type="submit"
                    >
                      Add Edge
                    </Button>
                  </Grid.Col>
                </Grid.Row>
              </Form>
            </Grid.Col>
            <Grid.Col sm={3}>
              <Button
                className="pull-right"
                bsStyle="primary"
                disabled={!this.state.selection}
                onClick={() => {
                  this.removeSelected();
                }}
              >
                Remove Selected
              </Button>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

MockTopologyView.propTypes = {
  onSelectionChange: PropTypes.func,
  reLayoutOnChanges: PropTypes.bool
};

MockTopologyView.defaultProps = {
  onSelectionChange: noop,
  reLayoutOnChanges: false
};

export default MockTopologyView;
