import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import { name } from '../../../package.json';

import { defaultTemplate } from 'storybook/decorators/storyTemplates';
import {
  storybookPackageName,
  DOCUMENTATION_URL,
  STORYBOOK_CATEGORY
} from 'storybook/constants/siteConstants';

import Cordova from 'storybook/img/Cordova.svg';
import External from 'storybook/img/External.svg';
import Icon from 'storybook/img/Icon.svg';
import Mongo from 'storybook/img/Mongo DB.svg';
import MySQL from 'storybook/img/MySQL.svg';
import NodeJS from 'storybook/img/NodeJS.svg';
import Route from 'storybook/img/Route.svg';
import ThreeScale from 'storybook/img/3Scale.svg';

import TopologyView from './TopologyView';

const stories = storiesOf(
  `${storybookPackageName(name)}/${
    STORYBOOK_CATEGORY.CONTENT_VIEWS
  }/Topology View`,
  module
);

const route = { data: { id: 'route', title: '', image: Route } };
const mobile = { data: { id: 'mobile', title: 'Mobile App', image: Cordova } };
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
  data: { id: 'booking', title: 'Booking', image: NodeJS, total: 2, error: 0 }
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
  data: { id: 'movies', title: 'Movies', image: Icon, total: 3, unknown: 1 }
};

const containers = [
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
      labelPos: 'top'
    },
    nodes: [route2]
  }
];

const nodes = [
  route,
  mobile,
  route2,
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

const edges = [
  { data: { id: '1', source: route, target: api } },
  { data: { id: '2', source: mobile, target: api } },
  { data: { id: '3', source: mobile, target: storeWebUi } },
  { data: { id: '4', source: route2, target: cinemaWebUi } },
  { data: { id: '5', source: route2, target: testWebUi } },
  { data: { id: '6', source: api, target: booking } },
  { data: { id: '7', source: api, target: storeInventory } },
  //  { data: { id: '8', source: api, target: cinemaCatalog } },
  { data: { id: '9', source: storeWebUi, target: storeInventory } },
  { data: { id: '10', source: cinemaWebUi, target: cinemaCatalog } },
  { data: { id: '11', source: testWebUi, target: cinemaCatalog } },
  { data: { id: '12', source: booking, target: payments } },
  { data: { id: '13', source: booking, target: notifications } },
  { data: { id: '14', source: storeInventory, target: payments } },
  { data: { id: '15', source: storeInventory, target: notifications } },
  { data: { id: '16', source: cinemaCatalog, target: movies } }
];

stories.addDecorator(
  defaultTemplate({
    title: 'TopologyView',
    documentationLink: `${
      DOCUMENTATION_URL.PATTERNFLY_ORG_APPLICATION_FRAMEWORK
    }/canvas-view/`
  })
);

stories.add(
  'TopologyView',
  withInfo()(() => (
    <TopologyView containers={containers} nodes={nodes} edges={edges} />
  ))
);
