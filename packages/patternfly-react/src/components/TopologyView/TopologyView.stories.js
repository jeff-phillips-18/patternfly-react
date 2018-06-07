import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { name } from '../../../package.json';

import { defaultTemplate } from 'storybook/decorators/storyTemplates';
import {
  storybookPackageName,
  DOCUMENTATION_URL,
  STORYBOOK_CATEGORY
} from 'storybook/constants/siteConstants';

import MockTopologyView from './__mocks__/MockTopologyView';
import TopologyView from './TopologyView';

const stories = storiesOf(
  `${storybookPackageName(name)}/${
    STORYBOOK_CATEGORY.CONTENT_VIEWS
  }/Topology View`,
  module
);

stories.addDecorator(
  defaultTemplate({
    title: 'TopologyView',
    documentationLink: `${
      DOCUMENTATION_URL.PATTERNFLY_ORG_APPLICATION_FRAMEWORK
    }/canvas-view/`
  })
);
stories.addDecorator(withKnobs);

stories.add(
  'TopologyView',
  withInfo({
    propTables: [TopologyView],
    propTablesExclude: [MockTopologyView]
  })(() => {
    const handleSelection = item => {
      action('selection')(item ? item.data.id : 'no selections');
    };

    const reLayoutOnChanges = boolean('Re-Layout Graph when changed', false);
    return <MockTopologyView onSelectionChange={handleSelection} reLayoutOnChanges={reLayoutOnChanges}/>;
  })
);
